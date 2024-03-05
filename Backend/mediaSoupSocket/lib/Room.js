const { mediaSoupRouters, mediaSoupTransport } = require('../utils/mediaSoupUtils')
const { getPort, releasePort } = require('../utils/port');
const FFmpeg = require('./FFmpeg');
const Peer = require('./Peer')

module.exports = class Room {

    constructor(roomId, io, streamerId, routers) {
        this.roomId = roomId;
        //this.workers = workers
        this.io = io;
        this.peers = new Map();
        this.transports = new Map();
        this.consumers = new Map();
        this.producers = new Map();
        this.routers = routers;
        this.mediaSources = { 
            'screen' : ['screen-video', 'screen-audio'],
            'cam' : ['cam-video', 'cam-audio']
        }
        if (streamerId !== null){
            this.addPeer(streamerId, true);
        }
    }

    _getLeastLoadedRouter(){
        const routerInfo = this.routers.entries().next().value;
        return routerInfo[0];
    }

    static async createRouters(roomId, io, streamerId){
        const routers = await mediaSoupRouters();
        return new Room(roomId, io, streamerId, routers);
    }
    
    addPeer(peerId, isProducer) {
        const peer = new Peer(isProducer);
        const routerId = this._getLeastLoadedRouter();
        peer.setRouter(routerId);
        this.peers.set(peerId, peer);
    }

    _getRouter(peerId){ 
        const routerId = this.peers.get(peerId).getRouterId();
        return this.routers.get(routerId);
    }

    _getTransport(peerId) {
        return this.transports.get(peerId);
    }

    getRtpCapabilities(peerId) {
        return this._getRouter(peerId).rtpCapabilities;
    }

    async createTransport(peerId, consumer, cb) {
        try {
            const transport = await mediaSoupTransport('webRtc', this._getRouter(peerId))

            transport.on('dtlsstatechange', dtlsState => {
                if (dtlsState === 'closed') {
                    transport.close()
                }
            })

            transport.on('close', () => {
                console.log('transport closed')
            })

            let transportParams = {
                params : {
                    id: transport.id,
                    iceParameters: transport.iceParameters,
                    iceCandidates: transport.iceCandidates,
                    dtlsParameters: transport.dtlsParameters,
                }
            }
            if(consumer){
                transportParams = { mediaSources: Array.from(this.producers.keys()), ...transportParams }
            }

            cb(transportParams)
            this.transports.set(peerId,transport)

        } catch (error) {
            console.log(error)
            cb({
                params: {
                    error: error
                }
            })
        }
    }

    async transportConnect(peerId, params){
        await this._getTransport(peerId).connect(params);
    }

    async createProducer(peerId, kind, rtpParameters, appData, cb) {
        const producer = await this._getTransport(peerId).produce({
            kind,
            rtpParameters,
            appData,
        })
        
        producer.on('transportclose', () => {
            // Transport for this producer closed 
            producer.close()
        })

        cb({
            id: producer.id
        })

        this.producers.set(appData.mediaSource, producer);
        this.io.to(this.roomId).emit("new-producer", appData.mediaSource);
    }

    async consume(peerId, media, rtpCapabilities, cb) {
        const consumerTransport = this._getTransport(peerId);
        const router = this._getRouter(peerId);
        const producer = this.producers.get(media)
        try {
            // check if the router can consume the specified producer
            if (router.canConsume({
                producerId: producer.id,
                rtpCapabilities
            })) {
                const consumer = await consumerTransport.consume({
                    producerId: producer.id,
                    rtpCapabilities,
                    paused: true,
                })
        
                consumer.on('transportclose', () => {
                    console.log('transport close from consumer')
                    consumer.close()
                    this.consumers.delete(peerId)
                    this._updateViewerCount()
                })
        
                consumer.on('producerclose', () => {
                    this.io.to(peerId).emit("producer-closed");
                    this._removeConnections(peerId);
                })
        
                const params = {
                    id: consumer.id,
                    producerId: producer.id,
                    kind: consumer.kind,
                    rtpParameters: consumer.rtpParameters,
                    appData : { mediaSource: media },
                }
                // send the parameters to the client
                cb({ params })

                if (this.consumers.has(peerId)) {
                    this.consumers.get(peerId).set(media,consumer);
                }
                else {
                    this.consumers.set(peerId, new Map([[media,consumer]]) );
                    this._updateViewerCount()
                }
            }
        } catch (error) {
            console.log(error.message)
            cb({
                params: {
                    error: error
                }
            })
        }
    }

    async resumeConsuming(peerId, media) {
        const consumer = this.consumers.get(peerId).get(media);
        await consumer.resume();
    }

    async _publishProducerRtpStream(router, producer, peer){
        const rtpTransport = await mediaSoupTransport('plain', router);

        let remoteRtcpPort;
        const remoteRtpPort = await getPort();
        peer.addRemoteRtpPort(remoteRtpPort)

        await rtpTransport.connect({
            ip: '127.0.0.1',
            port: remoteRtpPort,
            rtcpPort: remoteRtcpPort
        });
        
        const codecs = [];
        // Codec passed to the RTP Consumer must match the codec in the Mediasoup router rtpCapabilities
        const routerCodec = router.rtpCapabilities.codecs.find(
            codec => codec.kind === producer.kind
        );
        codecs.push(routerCodec);

        const rtpCapabilities = {
            codecs,
            rtcpFeedback: []
        };

        // Once the ffmpeg process is ready to consume resume and send a keyframe
        const rtpConsumer = await rtpTransport.consume({
            producerId: producer.id,
            rtpCapabilities,
            paused: true
        });
        peer.addRtpConsumer(rtpConsumer)

        return {
            remoteRtpPort,
            remoteRtcpPort,
            rtpCapabilities,
            rtpParameters: rtpConsumer.rtpParameters
        };
    }

    async startRecord(peerId, streamId) {
        let recordInfo = {
            'screen': {}, 
            'cam' : {}, 
        };
    
        const router = this._getRouter(peerId)
        const streamer = this.peers.get(peerId)

        for(let media in this.mediaSources){
            for(let mediaType of this.mediaSources[media]) {
                const producer = this.producers.get(mediaType);
                recordInfo[media][producer.kind] = await this._publishProducerRtpStream(router, producer, streamer);
            }
            recordInfo[media].fileName = Date.now().toString(); 
        }
        streamer.process = new FFmpeg(recordInfo, streamId)
        
        setTimeout(async () => {
            for (const consumer of streamer.getRtpConsumers()) {
              await consumer.resume();
              await consumer.requestKeyFrame();
            }
        }, 1000);

    }

    stopRecord(peerId, cb) {
        const streamer = this.peers.get(peerId);
        streamer.process.kill();
        streamer.process = undefined;

        for(const remotePort of streamer.getRemoteRtpPorts()){
            releasePort(remotePort);
        }

        cb("Recording completed successfully")
    }

    _removeConnections(peerId) {
        const transport = this._getTransport(peerId);
        // close the peer transport
        transport.close()
        this.transports.delete(peerId)
        
        // remove peer from room
        this.peers.delete(peerId);
    }

    disconnectPeer(peerId) {
        const isConsumer = this.consumers.has(peerId);
        this._removeConnections(peerId);
        return !isConsumer;
    }

    _updateViewerCount() {
        this.io.to(this.roomId).emit("viewer-count",this.consumers.size)
    }
} 