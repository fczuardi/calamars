// FacebookMessengerBot
// ====================
//
// A class for setting-up and launching a webserver to comunicate with
// Facebook Messenger apps.
//

import express from 'express';
import bodyParser from 'body-parser';

// Facebook helpers: [facebookWebhookSetup.js](./facebookWebhookSetup.html)
// and [facebookGraphHelpers.js](./facebookGraphHelpers.html)
import { setupGetWebhook, setupPostWebhook } from './facebookWebhookSetup';
import { pageSubscribe, sendTextMessage, userInfo } from './facebookGraphHelpers';

// default values can be setup using environment vars
const PORT = process.env.PORT;
const FB_CALLBACK_PATH = process.env.FB_CALLBACK_PATH;
const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;
const FB_PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;

// The main class, this represents a facebook messenger chat bot/server
class FacebookMessengerBot {
    // ## Constructor
    // ### Parameters
    // - **options** - _Object_ - Configuration object.
    //   - **port** - _number_ - The port that the server will listen to.
    //   - **callbackPath** - _string_ - The endpoint path of the setup [Callback URL][fbwebhook]
    //   - **verifyToken** - _string_ - The [Verify Token][fbwebhook]
    //   - **pageTokens** - _Array_ - A list of page tokens to subscribe to
    //   - **listeners** - _Object_ - An object containing handler functions for
    // specific "[messaging][fbmessageformat]" updates or just a generic
    // ```onUpdate``` handler. (see the
    // [implementation](./facebookWebhookSetup.html#setuppostwebhook-options-)
    // for details):
    //     - onUpdate
    //     - onMessage
    //     - onAuthentication
    //     - onDelivery
    //     - onPostback
    //
    // [expressjs]: http://expressjs.com/
    // [fbwebhook]: https://developers.facebook.com/docs/messenger-platform/implementation#setup_webhook
    // [fbmessageformat]: https://developers.facebook.com/docs/messenger-platform/implementation#receive_message
    constructor(options = {}) {
        const {
            port = PORT,
            callbackPath = FB_CALLBACK_PATH,
            verifyToken = FB_VERIFY_TOKEN,
            pageTokens = [FB_PAGE_ACCESS_TOKEN],
            listeners = {}
        } = options;

        if (!callbackPath || !verifyToken || !pageTokens[0]) {
            throw new Error('FacebookMessengerBot could not be created, missing required option');
        }

        this.pageTokens = pageTokens;
        const app = express();
        this.launchPromise = new Promise(resolve => {
            app.use(bodyParser.json());
            app.get(callbackPath, setupGetWebhook(verifyToken));
            app.post(callbackPath, setupPostWebhook(listeners, this));
            app.listen(port, () => {
                Promise.all(pageTokens.map(token => pageSubscribe(token)))
                .then(() => resolve(true));
            });
        });
    }

    sendMessage(message) {
        return sendTextMessage(message, FB_PAGE_ACCESS_TOKEN);
    }

    getUserInfo(userId, pageToken = this.pageTokens[0]) {
        return userInfo(userId, pageToken);
    }
}

export { FacebookMessengerBot };
