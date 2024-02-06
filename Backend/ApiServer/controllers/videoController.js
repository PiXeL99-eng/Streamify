const { decrypt, secureVideos } = require('../utils/encryption');
const prisma = require("../data/db")

const getAllVideos = async (req, res) => {
    const videos = await prisma.video.findMany({
        select : {
            videoDesc : true,
            videoUrl : true,
            previewImageUrl : true,
            live : true,
            roomId : true
        }
    });

    res.status(200).json(videos);
}

const pastStreams = async (req, res) => {
    try {
        const userID = req.params.userId;
        const userVideos = await prisma.video.findMany({
            // filter out live videos
            where: {
                userId : userID,
                live : false
            },
            select : {
                videoId: true,
                videoDesc : true,
                videoUrl : true,
                previewImageUrl : true,
            }
        });

        secureVideos(res, 200, userVideos);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

const newStream = async (req, res) => {
    try {
        const { videoDesc, previewImageUrl, live, roomId, userId } = req.body;
        const videoUrl = "";
        
        const newVideo = await prisma.video.create({
            data: {
                videoDesc,
                videoUrl,
                previewImageUrl,
                live,
                roomId,
                userId,
            },
            select : {
                videoId: true,
                roomId : true
            }
        });
        
        secureVideos(res, 201, [newVideo]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }        
}

const updateStream = async (req, res) => {
    try{
        // updateInfo should be a object of form - 
        // {
        //    videoDesc : "..",
        //    videoUrl  : "..", 
        //    ....,
        // }
        const { videoID, updateInfo } = req.body;

        const decryptedVideoID = decrypt(videoID);
        await prisma.video.update({
            where : {
                videoId : decryptedVideoID
            },
            data : updateInfo,
        })
        res.status(200).send(true)
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }  
}

const deleteVideo = async (req, res) => {
    try {
        const { videoID } = req.body;
    
        const decryptedVideoID = decrypt(videoID);
        await prisma.video.delete({
            where: {
                videoId : decryptedVideoID
            },
        });
    
        res.status(204).send(true);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    getAllVideos,
    pastStreams,
    newStream,
    updateStream,
    deleteVideo
}