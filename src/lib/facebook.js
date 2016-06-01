// Facebook Messenger Bot
// ======================
//
// A simple server that listen to facebook messenger webhook calls and is able
// to return authentication challenges.
//
import express from 'express';

const PORT = process.env.PORT || 8082;
const FB_CALLBACK_PATH = process.env.FB_CALLBACK_PATH;
const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;

// Function that creates an expressjs app with the proper get routes
// for Facebook Messenger authentication in place
const fbServer = ({ callbackPath, verifyToken }) => {
    const app = express();
    app.get(callbackPath, (req, res) => {
        if (req.query['hub.verify_token'] === verifyToken) {
            res.send(req.query['hub.challenge']);
        } else {
            res.send('Error, wrong validation token');
        }
    });
    return app;
};

// The main class, this represents a facebook messenger chat bot
class Bot {
    constructor() {
        this.app = fbServer({
            callbackPath: FB_CALLBACK_PATH,
            verifyToken: FB_VERIFY_TOKEN
        });
    }
    start() {
        const p = new Promise(resolve => {
            this.app.listen(PORT, () => {
                console.log(`Example app listening on port ${PORT}!`);
                resolve(true);
            });
        });
        return p;
    }
}

export default Bot;
