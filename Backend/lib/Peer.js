module.exports = class Peer {

    constructor(isProducer){
        this.producer = isProducer;
        this.routerId = null;
        this.data = null;
    }

    setRouter(routerId){
        this.routerId = routerId;
    }

    getRouterId(){
        return this.routerId;
    }

}