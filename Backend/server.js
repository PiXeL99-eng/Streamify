const express = require('express')
const { Server } = require('socket.io')
const mediasoup = require('mediasoup')
const path = require('path');
const http = require('http');
const config = require('./config/appConfig')
const Room = require('./lib/Room')
const app = express()

app.use('/webrtc', express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
    res.send('mediasoup app!')
})

const workers = []
const rooms = new Map()

const createWorkers = async () => {
  const {numWorkers, rtcMinPort, rtcMaxPort} = config.mediaSoup;

  for(let i = 0; i < numWorkers; i++) { 
    const worker = worker = await mediasoup.createWorker({
      rtcMinPort: rtcMinPort,
      rtcMaxPort: rtcMaxPort,
    })
    console.log(`worker pid ${worker.pid}`)
    workers.push(worker)

    worker.on('died', error => {
      console.error('mediasoup worker has died')
      setTimeout(() => process.exit(1), 2000) // exit in 2 seconds
    })
  }
}

// This is an Array of RtpCapabilities
// https://mediasoup.org/documentation/v3/mediasoup/rtp-parameters-and-capabilities/#RtpCodecCapability
// list of media codecs supported by mediasoup ...
// https://github.com/versatica/mediasoup/blob/v3/src/supportedRtpCapabilities.ts


const peers = io.of('/live-video')

peers.on('connection', async socket => {
  console.log(socket.id)

  socket.on('startStream', async (roomId) => {
    //socket.join(roomId);
    socket.roomId = roomId;
    const room = await Room.create(roomId,workers,socket.id)
    rooms.set(roomId,room);
  })

  socket.on('disconnect', () => {
    // do some cleanup
    console.log('peer disconnected')
  })

  socket.on('getRtpCaps', async (callback) => {
    const room = rooms.get(socket.roomId);
    const rtpCapabilities = room.getRtpCapabilities(socket.id)
    callback({rtpCapabilities});
  })

  // Client emits a request to create server side Transport
  // We need to differentiate between the producer and consumer transports
  socket.on('createWebRtcTransport', async ({ sender }, callback) => {
    const room = rooms.get(socket.roomId);
    await room.createTransport(socket.id, callback);
  })

  // see client's socket.emit('transport-connect', ...)
  socket.on('transport-connect', async ({ dtlsParameters }) => {
    console.log('DTLS PARAMS... ', { dtlsParameters })
    await rooms.get(socket.roomId).transportConnect(socket.id, { dtlsParameters })
  })

  // see client's socket.emit('transport-produce', ...)
  socket.on('transport-produce', async ({ kind, rtpParameters, appData }, callback) => {
    // call produce based on the prameters from the client
    producer = await producerTransport.produce({
      kind,
      rtpParameters,
    })

    console.log('Producer ID: ', producer.id, producer.kind)

    producer.on('transportclose', () => {
      console.log('transport for this producer closed ')
      producer.close()
    })

    // Send back to the client the Producer's id
    callback({
      id: producer.id
    })
  })

  // see client's socket.emit('transport-recv-connect', ...)
  socket.on('transport-recv-connect', async ({ dtlsParameters }) => {
    console.log(`DTLS PARAMS: ${dtlsParameters}`)
    await consumerTransport.connect({ dtlsParameters })
  })

  socket.on('consume', async ({ rtpCapabilities }, callback) => {
    try {
      // check if the router can consume the specified producer
      if (router.canConsume({
        producerId: producer.id,
        rtpCapabilities
      })) {
        // transport can now consume and return a consumer
        consumer = await consumerTransport.consume({
          producerId: producer.id,
          rtpCapabilities,
          paused: true,
        })

        consumer.on('transportclose', () => {
          console.log('transport close from consumer')
        })

        consumer.on('producerclose', () => {
          console.log('producer of consumer closed')
        })

        // from the consumer extract the following params
        // to send back to the Client
        const params = {
          id: consumer.id,
          producerId: producer.id,
          kind: consumer.kind,
          rtpParameters: consumer.rtpParameters,
        }
        // send the parameters to the client
        callback({ params })
      }
    } catch (error) {
      console.log(error.message)
      callback({
        params: {
          error: error
        }
      })
    }
  })

  socket.on('consumer-resume', async () => {
    console.log('consumer resume')
    await consumer.resume()
  })
})
