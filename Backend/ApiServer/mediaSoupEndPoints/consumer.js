const io = require('socket.io-client')
const mediasoupClient = require('mediasoup-client')

const generateRoomId = () => {
    return document.getElementById('roomIdInput').value;
};

let device
let rtpCapabilities
let socket
let consumerTransport
let consumer

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
    
    await socket.emit('createWebRtcTransport', ({ params }) => {
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
        connectRecvTransport()
    })
}

const connectRecvTransport = async () => {

    await socket.emit('consume', { rtpCapabilities: device.rtpCapabilities, }, async ({ params }) => {
        if (params.error) {
            console.log('Cannot Consume')
            return
        }
       
        consumer = await consumerTransport.consume({
            id: params.id,
            producerId: params.producerId,
            kind: params.kind,
            rtpParameters: params.rtpParameters
        })
        // destructure and retrieve the video track from the producer
        const { track } = consumer
        remoteVideo.srcObject = new MediaStream([track])

        // the server consumer started with media paused
        // so we need to inform the server to resume
        socket.emit('consumer-resume')
    })
}

const consumeStream = () => {
    const roomId = generateRoomId();
    socket = io("ws://localhost:8900/live-video")

    try {
        socket.emit("JoinRoom",roomId, () => {
            getRtpCapabilities()
        });

        socket.on("producer-closed", () => {
            consumerTransport.close();
            consumer.close();
            remoteVideo.srcObject = new MediaStream();
        })
        console.log(`Consuming stream in room: ${roomId}`);
    } catch (error) {
        console.error('Error consuming stream:', error);
    }
};

document.getElementById('consumeBtn').addEventListener('click', consumeStream);
