const io = require('socket.io-client')
const mediasoupClient = require('mediasoup-client')

const generateRoomId = () => {
    return document.getElementById('roomIdInput').value;
};

let device
let rtpCapabilities
let socket
let consumerTransport

// Function to update the viewer count on the page
const updateViewerCount = (viewers) => {
    viewersCount.textContent = `Viewers: ${viewers}`;
};

const getRtpCapabilities = () => {

    socket.emit('getRtpCaps', (data) => {
        rtpCapabilities = data.rtpCapabilities
        createDevice()
    })
}

const createDevice = async () => {
    try {
        device = new mediasoupClient.Device()
        // Loads the device with RTP capabilities of the Router (server side)
        await device.load({
            routerRtpCapabilities: rtpCapabilities
        })

        // once the device loads, create transport
        createRecvTransport()

    } catch (error) {
        console.log(error)
        if (error.name === 'UnsupportedError')
        console.warn('browser not supported')
    }
}

const createRecvTransport = async () => {
    
    await socket.emit('createWebRtcTransport', { consumer: true }, ({ mediaSources, params }) => {
        if (params.error) {
            console.log(params.error)
        return
        }

        // creates a new WebRTC Transport to receive media
        // based on server's consumer transport params
        consumerTransport = device.createRecvTransport(params)
        consumerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
            try {
                // Signal local DTLS parameters to the server side transport
                await socket.emit('transport-connect', {
                    dtlsParameters,
                })
                // Tell the transport that parameters were transmitted.
                callback()

            } catch (error) {
                // Tell the transport that something was wrong
                errback(error)
            }
        })
        subscribeToMedia(mediaSources)
    })
}

const subscribeToMedia = (mediaSources) => {
    mediaSources.forEach( media => connectRecvTransport(media) );
}

const connectRecvTransport = async (media) => {

    await socket.emit('consume', { media, rtpCapabilities: device.rtpCapabilities, }, async ({ params }) => {
        if (params.error) {
            console.log('Cannot Consume')
            return
        }
       
        const consumer = await consumerTransport.consume({
            id: params.id,
            producerId: params.producerId,
            kind: params.kind,
            rtpParameters: params.rtpParameters,
            appData : params.appData,
        })
        // destructure and retrieve the video track from the producer
        const { track } = consumer
        const mediaInfo = params.appData.mediaSource

        if (params.kind == 'audio') {
            if (mediaInfo == 'cam-audio') {
                setMedia(remoteVideo, track)
            }
            else{
                setMedia(remoteScreenShareAudio, track)
            }
        }
        else {
            if (mediaInfo == 'cam-video') {
                setMedia(remoteVideo, track)
            }
            else{
                setMedia(remoteScreenShareVideo, track)
            }
        }

        // the server consumer started with media paused
        // so we need to inform the server to resume
        socket.emit('consumer-resume', mediaInfo)
    })
}

const setMedia = (container, track) => {
    container.srcObject = new MediaStream([track])
}

const consumeStream = () => {
    const roomId = generateRoomId();
    socket = io("ws://localhost:8900/live-video")

    try {
        socket.emit("JoinRoom",roomId, () => {
            getRtpCapabilities()
        });

        socket.on("new-producer", (mediaSource) => {
            connectRecvTransport(mediaSource)
        })

        socket.on("producer-closed", () => {
            consumerTransport.close();
            remoteVideo.srcObject = null;
            remoteAudio.srcObject = null;
            remoteScreenShareVideo.srcObject = null;
            remoteScreenShareAudio.srcObject = null;
            updateViewerCount(0)
        })

        socket.on("viewer-count", (viewers) => {
            updateViewerCount(viewers)
        })
        console.log(`Consuming stream in room: ${roomId}`);
    } catch (error) {
        console.error('Error consuming stream:', error);
    }
};

document.getElementById('consumeBtn').addEventListener('click', consumeStream);
