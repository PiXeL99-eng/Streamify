const express = require('express')
const { Server } = require('socket.io')
const mediasoup = require('mediasoup')
const path = require('path');
const http = require('http');
const config = require('./config/appConfig')
const Room = require('./lib/Room')
const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
    res.send('mediasoup app!')
})

app.get('/stream', (req, res) => {
  res.sendFile(path.join(__dirname,"/public/stream.html"))
})

app.get('/consume', (req, res) => {
  res.sendFile(path.join(__dirname,"/public/consume.html"))
})

const workers = []
const rooms = new Map()

const createWorkers = async () => {
  const {numWorkers, rtcMinPort, rtcMaxPort} = config.mediaSoup;

  for(let i = 0; i < numWorkers; i++) { 
    const worker = await mediasoup.createWorker({
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

const peers = io.of('/live-video')

peers.on('connection', async socket => {
  console.log(socket.id)

  socket.on('startStream', async (roomId, callback) => {
    //socket.join(roomId);
    socket.roomId = roomId;
    const room = await Room.createRouters(roomId, peers, workers, socket.id)
    rooms.set(roomId,room);
    callback();
  })

  socket.on('JoinRoom', (roomId, callback) => {
    socket.roomId = roomId;
    rooms.get(roomId).addPeer(socket.id,false);
    callback();
  })

  socket.on('disconnect', () => {
    // do some cleanup
    try{
      if(rooms.has(socket.roomId)){
        const producerDisconnect = rooms.get(socket.roomId).disconnectPeer(socket.id);
        if(producerDisconnect){
          rooms.delete(socket.roomId);
          console.log("Room removed")
        }
        else{
          console.log('peer disconnected')
        }
      }
    } catch(err) {
      console.log("Error occured");
    }
  })

  socket.on('getRtpCaps', async (callback) => {
    const room = rooms.get(socket.roomId);
    const rtpCapabilities = room.getRtpCapabilities(socket.id)
    callback({rtpCapabilities});
  })

  socket.on('createWebRtcTransport', async (callback) => {
    const room = rooms.get(socket.roomId);
    await room.createTransport(socket.id, callback);
  })

  socket.on('transport-connect', async ({ dtlsParameters }) => {
    console.log('DTLS PARAMS... ', { dtlsParameters })
    await rooms.get(socket.roomId).transportConnect(socket.id, { dtlsParameters })
  })

  socket.on('transport-produce', async ({ kind, rtpParameters, appData }, callback) => {
    await rooms.get(socket.roomId).createProducer(socket.id, kind, rtpParameters, callback);
  })

  socket.on('consume', async ({ rtpCapabilities }, callback) => {
    await rooms.get(socket.roomId).consume(socket.id, rtpCapabilities, callback);
  })

  socket.on('consumer-resume', async () => {
    console.log('consumer resume')
    await rooms.get(socket.roomId).resumeConsuming(socket.id);
  })
})

server.listen(3000, async () => {
  console.log('listening on port: ' + 3000);

  try {
    await createWorkers();
  } catch(err) {
    console.error('Create Worker error', err);
    process.exit(1);
  }
})