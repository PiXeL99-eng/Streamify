const Room = require('../lib/Room')

const rooms = new Map()

module.exports = (io, socket, workers) => {

    const initiateRoom = (roomId) => {
        socket.join(roomId);
        socket.roomId = roomId;
    }

    const startStream = async (roomId, callback) => {
        initiateRoom(roomId)
        const room = await Room.createRouters(roomId, io, workers, socket.id);
        rooms.set(roomId,room);
        callback();
    }

    const joinRoom = (roomId, callback) => {
        initiateRoom(roomId)
        rooms.get(roomId).addPeer(socket.id,false);
        callback();
    }

    const getRtpCaps = async (callback) => {
        const room = rooms.get(socket.roomId);
        const rtpCapabilities = room.getRtpCapabilities(socket.id)
        callback({rtpCapabilities});
    }

    const createWebRtcTransport = async ({ consumer }, callback) => {
        const room = rooms.get(socket.roomId);
        await room.createTransport(socket.id, consumer, callback);
    }

    const transportConnect = async ({ dtlsParameters }) => {
        await rooms.get(socket.roomId).transportConnect(socket.id, { dtlsParameters })
    }

    const transportProduce = async ({ kind, rtpParameters, appData }, callback) => {
        await rooms.get(socket.roomId).createProducer(socket.id, kind, rtpParameters, appData, callback);
    }

    const consume = async ({ media, rtpCapabilities }, callback) => {
        await rooms.get(socket.roomId).consume(socket.id, media, rtpCapabilities, callback);
    }

    const resumeConsumer = async (media) => {
        await rooms.get(socket.roomId).resumeConsuming(socket.id, media);
    }

    socket.on('startStream',startStream)
    socket.on('JoinRoom', joinRoom)
    
    socket.on('getRtpCaps', getRtpCaps)
    socket.on('createWebRtcTransport', createWebRtcTransport)

    socket.on('transport-connect', transportConnect)
    socket.on('transport-produce', transportProduce)
    
    socket.on('consume', consume)
    socket.on('consumer-resume', resumeConsumer)

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
}