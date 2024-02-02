const mediasoup = require('mediasoup');
const config = require('../../config/appConfig')

const createWorkers = async () => {
    const workers = [];

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

    return workers;
};

module.exports = { createWorkers };
