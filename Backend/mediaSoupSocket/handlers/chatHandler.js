module.exports = (io, socket) => {
  
  const broadcastMessage = (msg) => {
    io.to(socket.roomId).emit("recv-message",msg);
  }

  socket.on("send-message", broadcastMessage);
}