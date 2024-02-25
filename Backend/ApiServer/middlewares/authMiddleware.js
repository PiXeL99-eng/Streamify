const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');

const authenticateRequest = (req, res, next) => {
    ClerkExpressWithAuth()(req,res, () => {
        if (req.auth.userId) {
            return next();
        }
        // check if userId exists in db 
        res.status(401).send({"error" : "Unathenticated user"})
    })
}

module.exports = { authenticateRequest } ;