const express = require('express');
const prisma = require("../data/db")
const { authenticateRequest } = require('../middlewares/authMiddleware') 
const clerkClient = require('@clerk/clerk-sdk-node')

const router = express.Router();

router.post("/newUser", authenticateRequest, async (req, res) => {

    try {
        // const { user_id, user_name, user_preview_url } = req.auth.sessionClaims
        const userID = req.auth.userId
        const user = await clerkClient.users.getUser(userID);
        const { imageUrl, firstName, lastName } = user;
        await prisma.user.create({
            data: {
                userId : userID,
                userName : `${firstName} ${lastName}`,
                userPreviewUrl : imageUrl,
            },
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }        
})

module.exports = router;