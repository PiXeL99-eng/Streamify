const Room = require('../lib/Room')

const rooms = new Map()

const getRoom = (id) => {
    return rooms.get(id)
}

module.exports = (io, socket) => {

    const initiateRoom = (roomId) => {
        socket.join(roomId);
        socket.roomId = roomId;
    }

    const startStream = async (roomId, callback) => {
        initiateRoom(roomId)
        const room = await Room.createRouters(roomId, io, socket.id);
        rooms.set(roomId,room);
        callback();
    }

    const joinRoom = (roomId, callback) => {
        initiateRoom(roomId)
        getRoom(roomId).addPeer(socket.id,false);
        callback();
    }

    const getRtpCaps = async (callback) => {
        const room = getRoom(socket.roomId);
        const rtpCapabilities = room.getRtpCapabilities(socket.id)
        callback({rtpCapabilities});
    }

    const createWebRtcTransport = async ({ consumer }, callback) => {
        const room = getRoom(socket.roomId);
        await room.createTransport(socket.id, consumer, callback);
    }

    const transportConnect = async ({ dtlsParameters }) => {
        await getRoom(socket.roomId).transportConnect(socket.id, { dtlsParameters })
    }

    const transportProduce = async ({ kind, rtpParameters, appData }, callback) => {
        await getRoom(socket.roomId).createProducer(socket.id, kind, rtpParameters, appData, callback);
    }

    const consume = async ({ media, rtpCapabilities }, callback) => {
        await getRoom(socket.roomId).consume(socket.id, media, rtpCapabilities, callback);
    }

    const resumeConsumer = async (media) => {
        await getRoom(socket.roomId).resumeConsuming(socket.id, media);
    }

    const recordEvent = async (record, recordArg) => {
        const room = getRoom(socket.roomId);
        const peerId = socket.id;
        if(record) {
            await room.startRecord(peerId, recordArg)
        }
        else{
            room.stopRecord(peerId, recordArg)
        }
    }

    const disconnectPeer = () => {
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
    }

    socket.on('startStream',startStream)
    socket.on('JoinRoom', joinRoom)
    
    socket.on('getRtpCaps', getRtpCaps)
    socket.on('createWebRtcTransport', createWebRtcTransport)

    socket.on('transport-connect', transportConnect)
    socket.on('transport-produce', transportProduce)
    
    socket.on('consume', consume)
    socket.on('consumer-resume', resumeConsumer)

    socket.on('record-event', recordEvent)

    socket.on('disconnect', disconnectPeer)

}