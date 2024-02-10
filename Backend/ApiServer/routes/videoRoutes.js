const express = require('express');
const { getAllVideos, pastStreams, newStream, updateStream, deleteVideo } = require('../controllers/videoController');

const router = express.Router();

router.get("/allVideos", getAllVideos)
router.get("/userVideos/:userId", pastStreams)

router.post("/newVideo", newStream)

router.put("/updateVideo", updateStream)

router.delete("/deleteVideo/:Id", deleteVideo)

module.exports = router;