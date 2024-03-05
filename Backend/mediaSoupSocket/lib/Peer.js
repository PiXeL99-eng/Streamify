module.exports = class Peer {

    constructor(isProducer){
        this.producer = isProducer;
        this.routerId = null;
        this.data = null;
        this.process = undefined;
        this._remoteRtpPorts = [];
        this._rtpConsumers = [];
    }

    setRouter(routerId){
        this.routerId = routerId;
    }

    getRouterId(){
        return this.routerId;
    }

    addRtpConsumer(consumer) {
        this._rtpConsumers.push(consumer);
    }

    addRemoteRtpPort(port) {
        this._remoteRtpPorts.push(port);
    }

    getRtpConsumers(){
        return this._rtpConsumers;
    }

    getRemoteRtpPorts(){
        return this._remoteRtpPorts;
    }

}