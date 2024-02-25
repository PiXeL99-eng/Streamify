require("dotenv").config();

const express = require('express')
const path = require('path');
const cors = require('cors');
const videoRouter = require('./routes/videoRoutes')
const userRouter = require('./routes/userRoutes')

const app = express()

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
)

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", 
      "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use("/streamify/videos", videoRouter);
app.use("/streamify/users", userRouter);


app.get('/stream', (req, res) => {
  res.sendFile(path.join(__dirname,"/public/stream.html"))
})

app.get('/consume', (req, res) => {
  res.sendFile(path.join(__dirname,"/public/consume.html"))
})

const PORT = process.env.API_SERVER_PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Server Listening on port: ${PORT}`);
})