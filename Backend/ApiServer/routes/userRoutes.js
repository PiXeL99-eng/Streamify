const express = require('express');
const { authenticateRequest } = require('../middlewares/authMiddleware') 
const { addUser } = require('../controllers/userController')

const router = express.Router();

router.use(authenticateRequest)

router.post("/newUser", addUser)

module.exports = router;