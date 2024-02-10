require("dotenv").config({path : '../.env'});

const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY;

const encrypt = (objectId) => {
    const token = jwt.sign({id : objectId}, SECRET_KEY);
    return token;
};

const decrypt = (token) => {
    const decodedId = jwt.verify(token,SECRET_KEY);
    return decodedId.id;
}

const secureVideos = (res, statusCode, userVideos) => {
    userVideos.videos.map(video => {
        const videoID = video.videoId;
        video.videoId = encrypt(videoID);
        return video;
    })
    res.status(statusCode).json(userVideos);
}

module.exports = { encrypt, decrypt, secureVideos };
