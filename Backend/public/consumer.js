const io = require('socket.io-client')
const mediasoupClient = require('mediasoup-client')

// const socket = io("/live-video")

const generateRoomId = () => {
    return document.getElementById('roomIdInput').value;
};

const consumeStream = async () => {
    const roomId = generateRoomId();

    try {
    // // Request RTP capabilities from the server
    // const { rtpCapabilities } = await new Promise(resolve =>
    //     socket.emit('getRtpCapabilities', resolve)
    // );

    // // Create a consumer transport
    // consumerTransport = await new Promise(resolve =>
    //     socket.emit('createWebRtcTransport', { sender: false }, resolve)
    // );

    // // Connect consumer transport
    // await socket.emit('transport-recv-connect', {
    //     dtlsParameters: consumerTransport.dtlsParameters,
    // });

    // // Consume the stream
    // consumer = await new Promise((resolve, reject) => {
    //     socket.emit('consume', { rtpCapabilities }, async ({ params }) => {
    //     if (params.error) {
    //         reject(new Error(params.error));
    //         return;
    //     }

    //     const newConsumer = await consumerTransport.consume(params);
    //     resolve(newConsumer);
    //     });
    // });

    // Display the remote stream in a video element
    const remoteVideo = document.createElement('video');
    remoteVideo.srcObject = new MediaStream([]);
    remoteVideo.autoplay = true;

    // Append the video element to the container
    const remoteVideoContainer = document.getElementById('remoteVideoContainer');
    remoteVideoContainer.innerHTML = ''; // Clear previous content
    remoteVideoContainer.appendChild(remoteVideo);

    console.log(`Consuming stream in room: ${roomId}`);
    } catch (error) {
    console.error('Error consuming stream:', error);
    }
};

document.getElementById('consumeBtn').addEventListener('click', consumeStream);
