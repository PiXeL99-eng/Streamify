const config = require('../config/appConfig')
const Peer = require('./Peer')

module.exports = class Room {

    constructor(roomId, io, workers, streamerId, routers) {
        this.roomId = roomId;
        this.workers = workers
        this.io = io;
        this.peers = new Map();
        this.transports = new Map();
        this.consumers = new Map();
        this.producer = null;
        this.routers = routers;

        if (streamerId !== null){
            this.addPeer(streamerId, true);
        }
    }

    getLeastLoadedRouter(){
        const routerInfo = this.routers.entries().next().value;
        return routerInfo[0];
    }

    static async createRouters(roomId, io, workers, streamerId){
        const { mediaCodecs } = config.mediaSoup;
        const routers = new Map();

        for(let worker of workers){
            const router = await worker.createRouter({mediaCodecs, })
            routers.set(router.id,router);
        }
        return new Room(roomId, io, workers, streamerId, routers);
    }
    
    addPeer(peerId, isProducer) {
        const peer = new Peer(isProducer);
        const routerId = this.getLeastLoadedRouter();
        peer.setRouter(routerId);
        this.peers.set(peerId, peer);
    }

    getRouter(peerId){ 
        const routerId = this.peers.get(peerId).getRouterId();
        return this.routers.get(routerId);
    }

    getTransport(peerId) {
        return this.transports.get(peerId);
    }

    getRtpCapabilities(peerId) {
        return this.getRouter(peerId).rtpCapabilities;
    }

    async createTransport(peerId, cb) {
        try {
            const { webRtcTransport_options } = config.mediaSoup;

            const transport = await this.getRouter(peerId).createWebRtcTransport(webRtcTransport_options)

            transport.on('dtlsstatechange', dtlsState => {
                if (dtlsState === 'closed') {
                    transport.close()
                }
            })

            transport.on('close', () => {
                console.log('transport closed')
            })

            cb({
                params: {
                    id: transport.id,
                    iceParameters: transport.iceParameters,
                    iceCandidates: transport.iceCandidates,
                    dtlsParameters: transport.dtlsParameters,
                }
            })
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
        await this.getTransport(peerId).connect(params);
    }

    async createProducer(peerId, kind, rtpParameters, cb) {
        const producer = await this.getTransport(peerId).produce({
            kind,
            rtpParameters,
        })
        
        producer.on('transportclose', () => {
            // Transport for this producer closed 
            producer.close()
        })

        cb({
            id: producer.id
        })
        this.producer = producer;
    }

    async consume(peerId, rtpCapabilities, cb) {
        const consumerTransport = this.getTransport(peerId);
        const router = this.getRouter(peerId);
        try {
            // check if the router can consume the specified producer
            if (router.canConsume({
                producerId: this.producer.id,
                rtpCapabilities
            })) {
                const consumer = await consumerTransport.consume({
                    producerId: this.producer.id,
                    rtpCapabilities,
                    paused: true,
                })
        
                consumer.on('transportclose', () => {
                    console.log('transport close from consumer')
                })
        
                consumer.on('producerclose', () => {
                    this.io.to(peerId).emit("producer-closed");
                    this.removeConnections(peerId,true);
                })
        
                const params = {
                    id: consumer.id,
                    producerId: this.producer.id,
                    kind: consumer.kind,
                    rtpParameters: consumer.rtpParameters,
                }
                // send the parameters to the client
                cb({ params })

                this.consumers.set(peerId,consumer);
                this.updateViewerCount()
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

    async resumeConsuming(peerId) {
        const consumer = this.consumers.get(peerId);
        await consumer.resume();
    }

    removeConnections(peerId, isConsumer) {
        const transport = this.getTransport(peerId);
        // close the peer transport
        transport.close()
        this.transports.delete(peerId)
        
        if(isConsumer){
            const consumer = this.consumers.get(peerId);
            // close the consumer 
            consumer.close()
            this.consumers.delete(peerId)
            this.updateViewerCount()
        }
        
        // remove peer from room
        this.peers.delete(peerId);
    }

    disconnectPeer(peerId) {
        const isConsumer = this.consumers.has(peerId);
        this.removeConnections(peerId,isConsumer);
        return !isConsumer;
    }

    updateViewerCount() {
        this.io.to(this.roomId).emit("viewer-count",this.consumers.size)
    }
} 