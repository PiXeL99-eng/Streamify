const Room = require('../lib/Room')

const rooms = new Map()

module.exports = (io, socket, workers) => {

    const startStream = async (roomId, callback) => {
        //socket.join(roomId);
        socket.roomId = roomId;
        const room = await Room.createRouters(roomId, io, workers, socket.id)
        rooms.set(roomId,room);
        callback();
    }

    const joinRoom = (roomId, callback) => {
        socket.roomId = roomId;
        rooms.get(roomId).addPeer(socket.id,false);
        callback();
    }

    const getRtpCaps = async (callback) => {
        const room = rooms.get(socket.roomId);
        const rtpCapabilities = room.getRtpCapabilities(socket.id)
        callback({rtpCapabilities});
    }

    const createWebRtcTransport = async (callback) => {
        const room = rooms.get(socket.roomId);
        await room.createTransport(socket.id, callback);
    }

    const transportConnect = async ({ dtlsParameters }) => {
        console.log('DTLS PARAMS... ', { dtlsParameters })
        await rooms.get(socket.roomId).transportConnect(socket.id, { dtlsParameters })
    }

    const transportProduce = async ({ kind, rtpParameters, appData }, callback) => {
        await rooms.get(socket.roomId).createProducer(socket.id, kind, rtpParameters, callback);
    }

    const consume = async ({ rtpCapabilities }, callback) => {
        await rooms.get(socket.roomId).consume(socket.id, rtpCapabilities, callback);
    }

    const resumeConsumer = async () => {
        console.log('consumer resume')
        await rooms.get(socket.roomId).resumeConsuming(socket.id);
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