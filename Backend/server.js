const express = require('express')
const path = require('path');
const cors = require('cors');
require("dotenv").config({path : "./config/config.env"});

const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/stream', (req, res) => {
  res.sendFile(path.join(__dirname,"/public/stream.html"))
})

app.get('/consume', (req, res) => {
  res.sendFile(path.join(__dirname,"/public/consume.html"))
})

app.listen(process.env.API_SERVER_PORT, () => {
  console.log('listening on port: ' + 3000);
})