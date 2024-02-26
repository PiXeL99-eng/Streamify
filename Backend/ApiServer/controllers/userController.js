const prisma = require("../data/db")
const clerkClient = require('@clerk/clerk-sdk-node')

const userExists = async (args) => {
    const count = await prisma.user.count(args);
    return Boolean(count);
}

const addUser = async (req, res) => {
    try {
        const userID = req.auth.userId
        if (userExists({
            where : {
                id : userID
            }
        })){
            return res.status(403).send("User already exists")
        }

        const user = await clerkClient.users.getUser(userID);
        const { imageUrl, firstName, lastName } = user;
        await prisma.user.create({
            data: {
                userId : userID,
                userName : `${firstName} ${lastName}`,
                userPreviewUrl : imageUrl,
            },
        });
        res.status(201).send("user created")
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }        
}

module.exports = { addUser };