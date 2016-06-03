// FacebookMessengerBot
// ====================
//
// A class for setting-up and launching a webserver to comunicate with
// Facebook Messenger apps.
//

import express from 'express';
import bodyParser from 'body-parser';

// Facebook helpers, see [facebookWebhookSetup.js](./facebookWebhookSetup.html)
// and [facebookGraphHelpers.js](./facebookGraphHelpers.html)
import { setupGetWebhook, setupPostWebhook } from './facebookWebhookSetup';
import { pageSubscribe } from './facebookGraphHelpers';

// default values can be setup using environment vars
const PORT = process.env.PORT || 8082;
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
    //   - **messageHandler** - _function_ - A callback function that will be called
    // for each ["messaging"][fbmessageformat] object present in POST requests
    // that your bot server receives.
    //
    // [expressjs]: http://expressjs.com/
    // [fbwebhook]: https://developers.facebook.com/docs/messenger-platform/implementation#setup_webhook
    // [fbmessageformat]: https://developers.facebook.com/docs/messenger-platform/implementation#receive_message
    constructor(options = {}) {
        const {
            port,
            callbackPath,
            verifyToken,
            pageTokens,
            messageHandler
        } = options;
        const fbWebHook = callbackPath || FB_CALLBACK_PATH;
        const fbVerifyToken = verifyToken || FB_VERIFY_TOKEN;
        const fbPageTokens = pageTokens || [FB_PAGE_ACCESS_TOKEN];
        const fbPort = port || PORT;
        const app = express();
        return new Promise(resolve => {
            app.use(bodyParser.json());
            app.get(fbWebHook, setupGetWebhook(fbVerifyToken));
            app.post(fbWebHook, setupPostWebhook(messageHandler));
            app.listen(fbPort, () => {
                console.log(`Facebook Messenger Bot listening on port ${fbPort}!`);
                Promise.all(fbPageTokens.map(token => pageSubscribe(token)))
                .then(() => resolve(true));
            });
        });
    }
}

export { FacebookMessengerBot };
