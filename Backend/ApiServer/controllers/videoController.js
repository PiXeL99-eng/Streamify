const { decrypt, secureVideos } = require('../utils/encryption');
const prisma = require("../data/db")

const getAllVideos = async (req, res) => {
    const query = req.query.search ? req.query.search : "";

    const videos = await prisma.video.findMany({
        where : {
            videoDesc : {
                contains : query,
            }
        },
        select : {
            videoDesc : true,
            videoUrl : true,
            previewImageUrl : true,
            live : true,
            roomId : true,
            author : {
                select : {
                    userName : true,
                    userPreviewUrl : true,
                }
            }
        },
    });
    res.status(200).json(videos);
}

const pastStreams = async (req, res) => {
    try {
        const userID = req.params.userId;
        const userVideos = await prisma.user.findUnique({
            where : { 
                id : userID,
            },
            include : {
                videos : {
                    // Filter for non-live videos
                    where : { 
                        live : false 
                    }, 
                    select : { 
                        videoId: true,
                        videoDesc : true,
                        videoUrl : true,
                        previewImageUrl : true,
                    },
                    orderBy : {
                        createdAt : 'desc',
                    }
                },
            },
        });
        delete userVideos["id"];
        secureVideos(res, 200, userVideos);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

const newStream = async (req, res) => {
    try {
        const { videoDesc, previewImageUrl, live, roomId, authorId } = req.body;
        const videoUrl = "";
        
        const newVideo = await prisma.video.create({
            data: {
                videoDesc,
                videoUrl,
                previewImageUrl,
                live,
                roomId,
                authorId,
            },
            select : {
                videoId: true,
            }
        });
        
        secureVideos(res, 201, {"videos" : [newVideo]});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }        
}

const updateStream = async (req, res) => {
    try{
        // updateInfo should be a object in the frontend APi call
        // body : {
        //     videoID : "...",
        //     updateInfo : {
        //         videoDesc : "...",
        //         videoUrl : "...",
        //     }
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
        const videoID = req.params.Id;
    
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