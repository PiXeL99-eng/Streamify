const prisma = require("../data/db")
const clerkClient = require('@clerk/clerk-sdk-node')

const userExists = async (args) => {
    const count = await prisma.user.count(args);
    return count;
}

const addUser = async (req, res) => {
    try {
        const userID = req.auth.userId
        const checkUserExists = await userExists({
            where : {
                id : userID
            }
        })

        if (checkUserExists){
            return res.status(200).send("User already exists")
        }

        const user = await clerkClient.users.getUser(userID);
        const { imageUrl, firstName, lastName } = user;
        await prisma.user.create({
            data: {
                id : userID,
                userName : `${firstName} ${lastName}`,
                userPreviewUrl : imageUrl,
            },
        });
        res.status(201).send("User created")
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }        
}

module.exports = { addUser };