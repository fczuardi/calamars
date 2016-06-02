// FacebookMessengerBot
// ====================
//
// A class for setting-up and launch a webserver to comunicate with
// Facebook Messenger apps.
//

import express from 'express';
import bodyParser from 'body-parser';

// default values can be setup using environment vars
const PORT = process.env.PORT || 8082;
const FB_CALLBACK_PATH = process.env.FB_CALLBACK_PATH;
const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;

// The main class, this represents a facebook messenger chat bot/server
class FacebookMessengerBot {
    // ## Constructor
    // ### Parameters
    // - **options** - _Object_ - Configuration object.
    //   - **port** - _number_ - The port that the server will listen to.
    //   - **callbackPath** - _string_ - The endpoint path of the setup [Callback URL][fbwebhook]
    //   - **verifyToken** - _string_ - The [Verify Token][fbwebhook]
    //   - **messageHandler** - _function_ - A callback function that will be called
    // for each ["messaging"][fbmessageformat] object present in POST requests
    // that your bot server receives.
    //
    // [expressjs]: http://expressjs.com/
    // [fbwebhook]: https://developers.facebook.com/docs/messenger-platform/implementation#setup_webhook
    // [fbmessageformat]: https://developers.facebook.com/docs/messenger-platform/implementation#receive_message
    constructor(options = {}) {
        const { port, callbackPath, verifyToken, messageHandler } = options;
        const fbWebHook = callbackPath || FB_CALLBACK_PATH;
        const fbVerifyToken = verifyToken || FB_VERIFY_TOKEN;
        const fbPort = port || PORT;
        const app = express();
        app.use(bodyParser.json());
        app.get(fbWebHook, (req, res) => {
            if (req.query['hub.verify_token'] === fbVerifyToken) {
                res.send(req.query['hub.challenge']);
            } else {
                res.send('Error, wrong validation token');
            }
        });
        app.post(fbWebHook, (req, res) => {
            if (!req.body.entry || !Array.isArray(req.body.entry)) {
                console.error('Facebook POST dont have an entry array', req.body);
                return res.send(false);
            }
            req.body.entry.forEach(({ messaging }) => {
                messaging.forEach(message => messageHandler(message));
            });
            return res.send(true);
        });
        const p = new Promise(resolve => {
            app.listen(fbPort, () => {
                console.log(`Facebook Messenger Bot listening on port ${fbPort}!`);
                resolve(true);
            });
        });
        return p;
    }
}

export { FacebookMessengerBot };
