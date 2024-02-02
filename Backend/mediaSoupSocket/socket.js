const { Server } = require('socket.io')
const { createWorkers } = require('./utils/mediaSoupUtils');
require("dotenv").config({path : "../config/config.env"});

let mediasoupWorkers = []

const io = new Server(process.env.WEB_SOCKET_PORT || 8900, {
    cors: {
      origin : ['*'],
      methods : ['GET','POST'],
    }
});

const peers = io.of('/live-video')

const registerTransportHandlers = require("./handlers/transportHandler");
const registerChatHandlers = require("./handlers/chatHandler");

peers.on('connection', async socket => {
    console.log(socket.id)

    registerTransportHandlers(peers, socket);
    registerChatHandlers(peers, socket);
})

async function setupMediaSoup() {
  try {
    const workers = await createWorkers();
    console.log('mediasoup workers created');

    mediasoupWorkers = workers;
    console.log('Media Soup Server setup complete');
  } catch (error) {
    console.error('Error setting up mediasoup:', error);
  }
}

console.log('Socket Server setup complete');
setupMediaSoup();
