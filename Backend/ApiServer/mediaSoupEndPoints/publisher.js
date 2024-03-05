const io = require('socket.io-client')
const mediasoupClient = require('mediasoup-client')
const { v4: uuidv4 } = require('uuid');

const socket = io("ws://localhost:8900/live-video")

let roomId = null;
let device
let rtpCapabilities
let producerTransport
let streamId
let mediaSource

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

let camAudioParams = { appData: { mediaSource: 'cam-audio' } };
let screenAudioParams = { appData: { mediaSource: 'screen-audio' } };
let camVideoParams = { appData: { mediaSource: 'cam-video' }, ...params }
let screenVideoParams = { appData: { mediaSource: 'screen-video' }, ...params }

let silentAudioTrack = null;

let recording = false

const getSilentAudioTrack = () => {
    if(silentAudioTrack === null){
        const audioContext = new AudioContext();
        const oscillator = audioContext.createOscillator();
        oscillator.frequency.value = 0;
        const streamAudioDestination = audioContext.createMediaStreamDestination();
        oscillator.connect(streamAudioDestination);
        oscillator.start();

        // add audio track
        silentAudioTrack = streamAudioDestination.stream.getAudioTracks()[0];
    }
    return silentAudioTrack
}

const camSuccess = (stream) => {
    const [audioTrack, videoTrack] = stream.getTracks()

    localVideo.srcObject = new MediaStream([videoTrack])
    
    camAudioParams = { track: audioTrack, ...camAudioParams };
    camVideoParams = { track: videoTrack, ...camVideoParams };
  
    sendStream('cam');
}
 
const screenSuccess = (stream) => {
    const videoTrack = stream.getVideoTracks()[0]
    const audioTrack = stream.getAudioTracks()[0] || getSilentAudioTrack()
    
    screenShareVideo.srcObject = new MediaStream([videoTrack])

    screenAudioParams = { track: audioTrack, ...screenAudioParams };
    screenVideoParams = { track: videoTrack, ...screenVideoParams };
    
    sendStream('screen');
}

const getLocalStream = () => {
    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
            width : {
                min:100,
                max:100
            },
            height : {
                min:100,
                max:100
            }
        }
    })
    .then(camSuccess)
    .catch(error => {
        console.log(error.message)
    })
}

const getLocalScreen = () => {
    navigator.mediaDevices.getDisplayMedia({
        audio : true,
        video : true,
    })
    .then(screenSuccess)
    .catch(error => {
        console.log(error.message)
    })
}

const sendStream = (mediaTag) => {
    mediaSource = mediaTag
    if(!producerTransport) { 
        getRtpCapabilities()
    }
    else {
        connectSendTransport()
    }
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
   
    socket.emit('createWebRtcTransport', { consumer: false }, ({ params }) => {
        
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

const connectSendTransport = () => {
    if (mediaSource == 'cam'){
        handleProducer(camAudioParams,camVideoParams);
    }
    else {
        handleProducer(screenAudioParams, screenVideoParams);
    }
}

const handleProducer = async (audioParams, videoParams) => {
    const videoProducer = await producerTransport.produce(videoParams);
    const audioProducer = await producerTransport.produce(audioParams);

    videoProducer.on('trackended', () => {
        console.log('video track ended') 
        // close video track
    })
  
    videoProducer.on('transportclose', () => {
        console.log('video transport ended')
        videoProducer.close()
        // close video track
    })

    audioProducer.on('trackended', () => {
        console.log('audio track ended')
        // close audio track
    })

    audioProducer.on('transportclose', () => {
        console.log('audio transport ended')
        audioProducer.close()
        // close audio track
    })
}

const generateRoomId = (getStream) => {
    if(roomId != null){
        getStream()
        return ;
    }
    roomId = uuidv4()

    try {
        // Send the roomId to the server
        socket.emit('startStream', roomId, () => {
           // Get user media (webcam)
            getStream() 
        });
        console.log(`Streaming started in room: ${roomId}`);
        
        fetch("streamify/videos/newVideo",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                videoDesc : "new stream",
                previewImageUrl: "/logoMarkv2.png",
                live : true,
                roomId : roomId,
                authorId : "user_2cSJ7CwiOE9uPutXj6ChFkUJAZh",
            })
        })
        .then(res => res.json())
        .then(data => {
            streamId = data.videos[0].videoId;
        })
    } catch (error) {
        console.error('Error accessing webcam:', error);
    }
}

socket.on("viewer-count", (viewers) => {
    updateViewerCount(viewers)
})

const startRecording = () => {
    socket.emit("record-event", true, streamId)
    recording = true;
    startRecordingBtn.disabled = true;
}

const stopStream = () => {
    if (recording) {
        socket.emit("record-event", false, (message) => {
            console.log(message)
            recording = false
            stopStreamBtn.disabled = true
            disconnectPeer()
        })
    }
    else {
        fetch(`streamify/videos/deleteVideo/${streamId}`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(() => {
            console.log("Stream ended from db")
            disconnectPeer()
        })
        .catch(err => console.log("Error occured -", err))
    }   
}

const disconnectPeer = () => {
    socket.disconnect();
    updateViewerCount(0);
    producerTransport.close();
}

const startCam = () => {
    generateRoomId(getLocalStream);
}

const startScreenStream = () => {
    generateRoomId(getLocalScreen);
}

const startStream = () => {
    startCam()
    setTimeout(() => {startScreenStream()}, 2000);
}

document.getElementById('startWebcamBtn').addEventListener('click', startCam);
document.getElementById('startScreenShareBtn').addEventListener('click', startScreenStream)
document.getElementById('startStreamBtn').addEventListener('click', startStream)
document.getElementById('startRecordingBtn').addEventListener('click', startRecording);
document.getElementById('stopStreamBtn').addEventListener('click', stopStream)
