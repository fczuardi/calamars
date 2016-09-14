// FacebookMessengerBot
// ====================
//
// A class for setting-up and launching a webserver to comunicate with
// Facebook Messenger apps.
//

import express from 'express';
import bodyParser from 'body-parser';
import { resolve as resolvePath } from 'path';

// Facebook helpers: [facebookWebhookSetup.js](./facebookWebhookSetup.html)
// and [facebookGraphHelpers.js](./facebookGraphHelpers.html)
import { setupGetWebhook, setupPostWebhook, verifySignature } from './facebookWebhookSetup';
import {
    pageSubscribe,
    sendTextMessage,
    userInfo,
    setWelcomeMessage,
    threadSettings,
    senderActions,
    quickRepliesText
} from './facebookGraphHelpers';

// default values can be setup using environment vars
const {
    PORT,
    FB_CALLBACK_PATH,
    FB_VERIFY_TOKEN,
    FB_PAGE_ID,
    FB_PAGE_ACCESS_TOKEN,
    FB_APP_SECRET
} = process.env;

// The main class, this represents a facebook messenger chat bot/server
class FacebookMessengerBot {
    // ## Constructor
    // ### Parameters
    // - **options** - _Object_ - Configuration object.
    //   - **port** - _number_ - The port that the server will listen to.
    //   - **callbackPath** - _string_ - The endpoint path of the setup [Callback URL][fbwebhook]
    //   - **verifyToken** - _string_ - The [Verify Token][fbwebhook]
    //   - **pageTokens** - _Array_ - A list of page tokens to subscribe to
    //   - **staticFiles** - _Array_ - List of specific static files to be served
    // by the same expressjs server that runs the bot. Each item of this array
    // should be an object in the format
    // ```{path: '\some_get_endpoit', file: 'path/to/static.file'}```
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
            pageIds = [FB_PAGE_ID],
            pageTokens = [FB_PAGE_ACCESS_TOKEN],
            appSecret = FB_APP_SECRET,
            staticFiles = [],
            listeners = {}
        } = options;

        if (!callbackPath || !verifyToken || !pageTokens[0] || !appSecret) {
            throw new Error('FacebookMessengerBot could not be created, missing required option');
        }

        this.pageIds = pageIds;
        this.pageTokens = pageTokens;
        const app = express();
        this.launchPromise = new Promise(resolve => {
            app.use(bodyParser.json({ verify: verifySignature(appSecret) }));
            app.get(callbackPath, setupGetWebhook(verifyToken));
            app.post(callbackPath, setupPostWebhook(listeners, this));
            staticFiles.forEach(item => {
                app.get(item.path, (req, res) => res.sendFile(resolvePath(item.file)));
            });
            app.listen(port, () => {
                Promise.all(pageTokens.map(token => pageSubscribe(token)))
                .then(() => resolve(true));
            });
        });
    }

    sendMessage(message, pageToken = this.pageTokens[0]) {
        return sendTextMessage(message, pageToken);
    }

    sendQuickReplies(text, attachment, userId, pageToken = this.pageTokens[0] ) {
        return quickRepliesText(text, attachment, userId, pageToken)
    }

    getUserInfo(userId, pageToken = this.pageTokens[0]) {
        return userInfo(userId, pageToken);
    }

    setWelcomeMessage(message, pageId = this.pageIds[0], pageAccessToken = this.pageTokens[0]) {
        return setWelcomeMessage(message, pageId, pageAccessToken);
    }

    setThreadSettings(options, pageId = this.pageIds[0], pageAccessToken = this.pageTokens[0]) {
        return threadSettings(options, pageId, pageAccessToken);
    }

    setSenderActions (status, userId, pageToken = this.pageTokens[0]) {
        return senderActions(status, userId, pageToken)
    }
}

export { FacebookMessengerBot };
