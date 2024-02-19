import { io } from 'socket.io-client'
import * as mediasoupClient from "mediasoup-client"
import { v4 as uuidv4 } from 'uuid'
import { deleteVideo } from '../api/videoAPICalls'

const socket = io("ws://localhost:8900/live-video")

let roomId = null;
let device
let rtpCapabilities
let producerTransport
let mediaSource

// Function to update the viewer count on the page
const updateViewerCount = (viewers) => {
    viewersCount.textContent = `👀 ${viewers} viewers`;
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

let recording = false

const camSuccess = (stream) => {
    localVideo.srcObject = stream
    
    camAudioParams = { track: stream.getAudioTracks()[0], ...camAudioParams };
    camVideoParams = { track: stream.getVideoTracks()[0], ...camVideoParams };
  
    sendStream('cam');
}
 
const screenSuccess = (stream) => {
    screenShareVideo.srcObject = stream

    screenAudioParams = { track: stream.getAudioTracks()[0], ...screenAudioParams };
    screenVideoParams = { track: stream.getVideoTracks()[0], ...screenVideoParams };
  
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
        audio: true,
        video: true
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
        handleProducer(screenAudioParams,screenVideoParams);
    }
}

const handleProducer = async (audioParams, videoParams) => {

    const audioProducer = await producerTransport.produce(audioParams);
    const videoProducer = await producerTransport.produce(videoParams);

    audioProducer.on('trackended', () => {
        console.log('audio track ended')
        // close audio track
    })
  
    audioProducer.on('transportclose', () => {
        console.log('audio transport ended')
        audioProducer.close()
        // close audio track
    })
    
    videoProducer.on('trackended', () => {
        console.log('video track ended') 
        // close video track
    })
  
    videoProducer.on('transportclose', () => {
        console.log('video transport ended')
        videoProducer.close()
        // close video track
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
        
        // fetch("streamify/newVideo",{
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         videoDesc : "new stream",
        //         previewImageUrl: "/logoMarkv2.png",
        //         live : true,
        //         roomId : roomId,
        //         authorId : 1,
        //     })
        // })
        // .then(res => res.json())
        // .then(data => {
        //     streamId = data.videos[0].videoId;
        // })

    } catch (error) {
        console.error('Error accessing webcam:', error);
    }
}

socket.on("viewer-count", (viewers) => {
    updateViewerCount(viewers)
})

const startRecording = () => {
    // todo : send socket event
    startRecordingBtn.disabled = true;
}

const stopStream = async (streamId) => {
    if (recording) {
        // send stop recording event and make put request
        // upon receiving video url after upload
    }
    else {
        socket.disconnect();
        updateViewerCount(0);
        producerTransport.close();
        roomId = null;
        // deleteVideo(streamId)


        // await fetch(`streamify/deleteVideo/${streamId}`,{
        //     method: 'DELETE',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        // })
    }   
}

const startCam = () => {
    generateRoomId(getLocalStream);
}

const startScreenStream = () => {
    generateRoomId(getLocalScreen);
}

const startStream = async () => {
    startCam()
    setTimeout(() => {startScreenStream()}, 3000);
    return roomId;
}

//chat function
const sendMessage = (userName, time, message) => {
    let fullMessage = [userName, time, message]
    socket.emit("send-message", fullMessage)
}

export {
    startStream,
    stopStream,
    roomId,
    sendMessage,
    socket
}

