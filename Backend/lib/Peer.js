const config = require('../config/appConfig')

module.exports = class Peer {

    constructor(peerId, isProducer){
        this.peerId = peerId;
        this.producer = isProducer;
        this.router = null;
        this.data = null;
        this.transport = null;
        this.producer = null;
        this.consumer = null;
    }

    setRouter(router){
        this.router = router;
    }

    getRouter(){
        return this.router;
    }

    getRtpCapabilities(){
        return this.router.rtpCapabilities;
    }

    async createTransport(cb) {
        try {
            const { webRtcTransport_options } = config.mediaSoup;

            const transport = await router.createWebRtcTransport(webRtcTransport_options)
            console.log(`transport id: ${transport.id}`)

            transport.on('dtlsstatechange', dtlsState => {
                if (dtlsState === 'closed') {
                transport.close()
                }
            })

            transport.on('close', () => {
                console.log('transport closed')
            })

            cb({
                params: {
                id: transport.id,
                iceParameters: transport.iceParameters,
                iceCandidates: transport.iceCandidates,
                dtlsParameters: transport.dtlsParameters,
                }
            })

            this.transport=  transport

            } catch (error) {
            console.log(error)
            cb({
                params: {
                error: error
                }
            })
        }
    }

    async connect(dtlsParams){
        await this.transport.connect(dtlsParams)
    }

}