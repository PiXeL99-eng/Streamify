const express = require('express')
const { Server } = require('socket.io')
const mediasoup = require('mediasoup')
const path = require('path');
const http = require('http');
const config = require('./config/appConfig')
const app = express()

app.use('/webrtc', express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
    res.send('mediasoup app!')
})

server.listen(3000, () => {
    console.log('listening on port: ' + 3000)
})

const workers = new Map()

const createWorkers = async () => {
  const {numWorkers, rtcMinPort, rtcMaxPort} = config.mediaSoup;

  for(let i = 0; i < numWorkers; i++) { 
    const worker = worker = await mediasoup.createWorker({
      rtcMinPort: rtcMinPort,
      rtcMaxPort: rtcMaxPort,
    })
    console.log(`worker pid ${worker.pid}`)
    workers.set(worker.pid, worker)

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
  socket.emit('connection-success', {
    socketId: socket.id
  })

  socket.on('disconnect', () => {
    // do some cleanup
    console.log('peer disconnected')
  })

  socket.on('createRoom', async (callback) => {
    if (router === undefined) {
      // worker.createRouter(options)
      // options = { mediaCodecs, appData }
      // mediaCodecs -> defined above
      // appData -> custom application data - we are not supplying any
      // none of the two are required
      router = await worker.createRouter({ mediaCodecs, })
      console.log(`Router ID: ${router.id}`)
    }

    getRtpCapabilities(callback)
  })

  const getRtpCapabilities = (callback) => {
    const rtpCapabilities = router.rtpCapabilities

    callback({ rtpCapabilities })
  }

  // Client emits a request to create server side Transport
  // We need to differentiate between the producer and consumer transports
  socket.on('createWebRtcTransport', async ({ sender }, callback) => {
    console.log(`Is this a sender request? ${sender}`)
    // The client indicates if it is a producer or a consumer
    // if sender is true, indicates a producer else a consumer
    if (sender)
      producerTransport = await createWebRtcTransport(callback)
    else
      consumerTransport = await createWebRtcTransport(callback)
  })

  // see client's socket.emit('transport-connect', ...)
  socket.on('transport-connect', async ({ dtlsParameters }) => {
    console.log('DTLS PARAMS... ', { dtlsParameters })
    await producerTransport.connect({ dtlsParameters })
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

const createWebRtcTransport = async (callback) => {
  try {
    // https://mediasoup.org/documentation/v3/mediasoup/api/#WebRtcTransportOptions
    const webRtcTransport_options = {
      listenIps: [
        { ip: '0.0.0.0', announcedIp: '127.0.0.1' }
      ],
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
    }

    // https://mediasoup.org/documentation/v3/mediasoup/api/#router-createWebRtcTransport
    let transport = await router.createWebRtcTransport(webRtcTransport_options)
    console.log(`transport id: ${transport.id}`)

    transport.on('dtlsstatechange', dtlsState => {
      if (dtlsState === 'closed') {
        transport.close()
      }
    })

    transport.on('close', () => {
      console.log('transport closed')
    })

    // send back to the client the following prameters
    callback({
      // https://mediasoup.org/documentation/v3/mediasoup-client/api/#TransportOptions
      params: {
        id: transport.id,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters,
      }
    })

    return transport

  } catch (error) {
    console.log(error)
    callback({
      params: {
        error: error
      }
    })
  }
}