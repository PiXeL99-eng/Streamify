const { Server } = require('socket.io')
const { createWorkers } = require('./utils/mediaSoupUtils');
const path = require('path');
require("dotenv").config({path : './config/config.env'});

let mediasoupWorkers = []

const PORT = process.env.WEB_SOCKET_PORT || 8900;
const io = new Server(PORT, {
    cors: {
      origin : '*',
      methods : ['GET','POST'],
    }
});

const peers = io.of('/live-video')

const registerTransportHandlers = require("./handlers/transportHandler");
const registerChatHandlers = require("./handlers/chatHandler");

peers.on('connection', async socket => {
    console.log(socket.id)

    registerTransportHandlers(peers, socket, mediasoupWorkers);
    registerChatHandlers(peers, socket);
})

async function setupMediaSoup() {
  try {
    const workers = await createWorkers();
    console.log('Mediasoup workers created');

    mediasoupWorkers = workers;
    console.log('Mediasoup Server setup complete');
  } catch (error) {
    console.error('Error setting up mediasoup:', error);
  }
}

console.log(`Socket Server running on port ${PORT}`);
setupMediaSoup();
