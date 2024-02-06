const io = require('socket.io-client')
const mediasoupClient = require('mediasoup-client')
const { v4: uuidv4 } = require('uuid');

const socket = io("ws://localhost:8900/live-video")

let device
let rtpCapabilities
let producerTransport
let streamId
let recording = false

// Function to update the viewer count on the page
const updateViewerCount = (viewers) => {
    viewersCount.textContent = `Viewers: ${viewers}`;
};

let params = {
    // mediasoup params
    encodings: [
      {
        rid: 'r0',
        maxBitrate: 100000,
        scalabilityMode: 'S1T3',
      },
      {
        rid: 'r1',
        maxBitrate: 300000,
        scalabilityMode: 'S1T3',
      },
      {
        rid: 'r2',
        maxBitrate: 900000,
        scalabilityMode: 'S1T3',
      },
    ],
    codecOptions: {
      videoGoogleStartBitrate: 1000
    }
}

const streamSuccess = (stream) => {
    localVideo.srcObject = stream
    const track = stream.getVideoTracks()[0]
    params = {
      track,
      ...params
    }
  
    getRtpCapabilities()
  }
  
const getLocalStream = () => {
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
        width: {
            min: 640,
            max: 1920,
        },
        height: {
            min: 400,
            max: 1080,
        }
        }
    })
    .then(streamSuccess)
    .catch(error => {
        console.log(error.message)
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
        createSendTransport()

    } catch (error) {
        console.log(error)
        if (error.name === 'UnsupportedError')
        console.warn('browser not supported')
    }
}

const getRtpCapabilities = () => {

    socket.emit('getRtpCaps', (data) => {
        rtpCapabilities = data.rtpCapabilities
        createDevice()
    })
}

const createSendTransport = () => {
   
    socket.emit('createWebRtcTransport',({ params }) => {
        
        if (params.error) {
            console.log(params.error)
            return
        }
        // creates a new WebRTC Transport to send media
        // based on the server's producer transport params
        producerTransport = device.createSendTransport(params)
        producerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
            try {
                // Signal local DTLS parameters to the server side transport
                await socket.emit('transport-connect', {
                    dtlsParameters,
                })

                // Tell the transport that parameters were transmitted.
                callback()
            } catch (error) {
                errback(error)
            }
        })

        producerTransport.on('produce', async (parameters, callback, errback) => {

            try {
                // Tell the server to create a Producer with the following parameters and produce
                await socket.emit('transport-produce', {
                    kind: parameters.kind,
                    rtpParameters: parameters.rtpParameters,
                    appData: parameters.appData,
                    }, ({ id }) => {
                    // Tell the transport that parameters were transmitted.
                    callback({ id })
                })
            } catch (error) {
                errback(error)
            }
        })

        connectSendTransport()
    })
}

const connectSendTransport = async () => {
    const producer = await producerTransport.produce(params)

    producer.on('trackended', () => {
        console.log('track ended')
        // close video track
    })

    producer.on('transportclose', () => {
        console.log('transport ended')
        producer.close()
        // close transport
    })
}

const generateRoomId = () => {
    const randomId = uuidv4();
    return randomId;
};

const startStream = async () => {
    const roomId = generateRoomId();

    try {
        // Send the roomId to the server
        socket.emit('startStream', roomId, () => {
           // Get user media (webcam)
            getLocalStream() 
        });

        console.log(`Streaming started in room: ${roomId}`);
        fetch("Streamify/newVideo",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                videoDesc : "new stream",
                previewImageUrl: "/logoMarkv2.png",
                live : true,
                roomId : roomId,
                userId : "1"
            })
        })
        .then(res => res.json())
        .then(data => {
            streamId = data[0].videoId;
        })
    } catch (error) {
        console.error('Error accessing webcam:', error);
    }
};

socket.on("viewer-count", (viewers) => {
    updateViewerCount(viewers)
})

const startRecording = () => {
    // todo : send socket event
    startRecordingBtn.disabled = true;
}

const stopStream = async () => {
    if (recording) {
        // send stop recording event and make put request
        // upon receiving video url after upload
    }
    else {
        socket.disconnect();
        updateViewerCount(0);
        producerTransport.close();
        await fetch("Streamify/deleteVideo",{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ videoID : streamId })
        })
    }   
}

document.getElementById('startStreamBtn').addEventListener('click', startStream);
document.getElementById('startRecordingBtn').addEventListener('click', startRecording);
document.getElementById('stopStreamBtn').addEventListener('click', stopStream)
