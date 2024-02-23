const express = require('express');
const jwt = require("jsonwebtoken")
require("dotenv").config({ path: '../.env' });

// const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node')

const { getAllVideos, pastStreams, newStream, updateStream, deleteVideo } = require('../controllers/videoController');

const router = express.Router();

const authenticateRequest = (req, res, next) => {
    const authHeader = req.headers["authorization"]     // Bearer 'accessToken'
    const accessToken = authHeader && authHeader.split(' ')[1]

    if (!accessToken) return res.status(200).json({ error: "Missing JWT" })

    // (accessToken, secret_key, callback)

    const public_key = process.env.CLERK_PEM_PUBLIC_KEY;

    jwt.verify(accessToken, public_key, (err, user) => {

        if (err) return res.status(200).json({ error: "Invalid JWT" })

        console.log(user)
        req.details = user
        next()
    })
}

router.get("/allVideos", authenticateRequest, getAllVideos)
router.get("/userVideos/:userId", pastStreams)

router.post("/newVideo", newStream)

router.put("/updateVideo", updateStream)

router.delete("/deleteVideo/:Id", deleteVideo)


module.exports = router;