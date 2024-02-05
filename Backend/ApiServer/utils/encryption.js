const crypto = require('crypto');
const ALGORITHM = 'aes-256-ctr';
const SECRET_KEY = crypto.randomBytes(32).toString('hex');

const encrypt = (videoId) => {
    const text = videoId.toString();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY, 'hex'), iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex'),
    };
};

const decrypt = (hash) => {
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY, 'hex'), Buffer.from(hash.iv, 'hex'));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
    return parseInt(decrypted.toString(), 10);
};

const secureVideos = (videos) => {
    const securedVideos = videos.map(video => {
        const videoID = video.videoId;
        video.videoId = encrypt(videoID);
        return video;
    })
    res.status(statusCode).json(securedVideos);
}

module.exports = { encrypt, decrypt, secureVideos };
