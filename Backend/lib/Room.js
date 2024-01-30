const config = require('../config/appConfig')
const Peer = require('./Peer')

module.exports = class Room {
    constructor(roomId, workers, streamerId, routers) {
        this.roomId = roomId;
        this.workers = workers
        this.routers = routers
        this.peers = new Map();
        this.producerId = streamerId;

        if (this.producerId !== null){
            this.addPeer(this.producerId, true);
        }
    }

    getLeastLoadedRouter(){
        const routerInfo = this.routers.entries.next().value;
        return routerInfo[1];
    }

    static async createRouters(roomId, workers, streamerId){
        const { mediaCodecs } = config.mediaSoup;
        const routers = new Map();

        for(let worker of workers){
            const router = await worker.createRouter({mediaCodecs, })
            routers.set(router.id,router);
        }
        return new Room(roomId, workers, streamerId, routers);
    }
    
    addPeer(peerId, isProducer) {
        const peer = new Peer(peerId, isProducer);
        const router = this.getLeastLoadedRouter();
        peer.setRouter(router);
        
        this.peers.set(peerId, peer);
    }

    getRtpCapabilities(peerId) {
        return this.peers.get(peerId).getRtpCapabilities();
    }

    async createTransport(peerId, cb) {
        await this.peers.get(peerId).createTransport(cb);
    }

    async transportConnect(peerId, params){
        await this.peers.get(peerId).connect(params);
    }
} 