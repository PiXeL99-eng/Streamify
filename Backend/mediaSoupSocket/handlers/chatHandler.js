module.exports = (io, socket) => {
  
  const broadcastMessage = (msg, overlay) => {
    io.to(socket.roomId).emit("recv-message",{msg,overlay});
  }

  socket.on("send-message", broadcastMessage);
}