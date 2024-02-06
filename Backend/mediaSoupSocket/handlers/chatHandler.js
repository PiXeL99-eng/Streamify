const { messageBuffer } = require('../config/appConfig').chat;

const messages = []
const addMessage = (newMessage) => {
    messages.push(newMessage);
    if (messages.length > messageBuffer) {
      messages.shift();
    }
  };
  

module.exports = (io, socket) => {
    
    const startLiveChat = (cb) => {
        cb(messages);
    }

    const broadcastMessage = (msg) => {
        addMessage(msg)
        io.to(socket.roomId).emit("recv-message",msg);
    }

    socket.on("open-chat", startLiveChat);
    socket.on("send-message", broadcastMessage);
}