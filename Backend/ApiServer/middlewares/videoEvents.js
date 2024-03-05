const { updateStream } = require('../controllers/videoController');

const videoEvents = (app) => {
    app.post("/streamify/videos/app-events", (req, res) => {
        const { event } = req.body;
        
        switch (event) {
            case "update" :
                return updateStream(req, res);
            case "delete":
                return;
            case "add" :
                return;
        }
        return;
    })
}

module.exports = videoEvents;