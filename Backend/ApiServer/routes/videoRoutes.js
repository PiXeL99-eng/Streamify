const express = require('express');

const { getAllVideos, pastStreams, newStream, updateStream, deleteVideo } = require('../controllers/videoController');
const { authenticateRequest } = require('../middlewares/authMiddleware') 
const router = express.Router();

//router.use(authenticateRequest)

router.get("/allVideos", getAllVideos)
router.get("/userVideos", pastStreams)

router.post("/newVideo", newStream)

router.put("/updateVideo", updateStream)

router.delete("/deleteVideo/:Id", deleteVideo)


module.exports = router;