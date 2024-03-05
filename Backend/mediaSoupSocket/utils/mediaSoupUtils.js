const mediasoup = require('mediasoup');
const config = require('../config/appConfig')

const workers = [];

const createWorkers = async () => {

    const { numWorkers, rtcMinPort, rtcMaxPort } = config.mediaSoup;

    for (let i = 0; i < numWorkers; i++) {
        const worker = await mediasoup.createWorker({
            rtcMinPort: rtcMinPort,
            rtcMaxPort: rtcMaxPort,
        });

        console.log(`worker pid ${worker.pid}`);
        workers.push(worker);

        worker.on('died', error => {
            console.error('mediasoup worker has died');
            setTimeout(() => process.exit(1), 2000); // exit in 2 seconds
        });
    }
};

const mediaSoupRouters = async () => {
    const { mediaCodecs } = config.mediaSoup;
    const routers = new Map();

    for(let worker of workers){
        const router = await worker.createRouter({mediaCodecs, })
        routers.set(router.id,router);
    }
    return routers;
}

const mediaSoupTransport= async (transportType, router) => {
    const { webRtcTransport_options, plainRtpTransport_options } = config.mediaSoup;

    switch (transportType) {
      case 'webRtc':
        return await router.createWebRtcTransport(webRtcTransport_options);
      case 'plain':
        return await router.createPlainTransport(plainRtpTransport_options);
    }
}

module.exports = { 
    createWorkers,
    mediaSoupRouters,
    mediaSoupTransport
};
