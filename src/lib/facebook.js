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
    //   - **appSecret** - _string_ - The app secret of your facebook app, used
    // to verify that the source of the updates is Facebook
    //   - **staticFiles** - _Array_ - List of specific static files to be served
    //   - **autoSubscribe** - _boolean_ - If true will attempt to subscribe
    // your facebook app to all facebook pages in **pageTokens** using an API call
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
            autoSubscribe = false,
            listeners = {}
        } = options;

        if (!callbackPath || !verifyToken || !pageTokens[0] || !appSecret) {
            throw new Error('FacebookMessengerBot could not be created, missing required option');
        }

        this.pageIds = pageIds;
        this.pageTokens = pageTokens;
        this.staticFiles = staticFiles;
        this.appSecret = appSecret;
        this.callbackPath = callbackPath;
        this.verifyToken = verifyToken;
        this.listeners = listeners;
        this.port = port;
        this.pageTokens = pageTokens;
        this.autoSubscribe = autoSubscribe;
        this.server = {};
    }

    setupExpressApp(app) {
        app.use(bodyParser.json({ verify: verifySignature(this.appSecret) }));
        app.get(this.callbackPath, setupGetWebhook(this.verifyToken));
        app.post(this.callbackPath, setupPostWebhook(this.listeners, this));
        this.staticFiles.forEach(item => {
            app.get(item.path, (req, res) => res.sendFile(resolvePath(item.file)));
        });
    }

    // NEW in v0.17
    // The constructor no longer launch a webserver, you will have
    // to launch it up manually with bot.start() or if you already have
    // an express app running, you can use bot.setupExpressApp(app)
    // to attach your bot config to an existing expressjs
    start() {
        const app = express();
        this.setupExpressApp(app);
        const bot = this;
        const launchPromise = new Promise(resolve => {
            bot.server = app.listen(bot.port, () => {
                if (!bot.autoSubscribe) {
                    return resolve(true);
                }
                const subscriptionPromises = bot.pageTokens.map(token =>
                    pageSubscribe(token)
                );
                return Promise.all(subscriptionPromises)
                        .then(() => resolve(true))
                        .catch(e => console.error(e.message));
            });
        });
        return launchPromise;
    }

    // NEW in v0.17
    stop() {
        this.server.close();
    }

    sendMessage(message, pageToken = this.pageTokens[0]) {
        return sendTextMessage(message, pageToken);
    }

    sendQuickReplies(text, attachment, userId, pageToken = this.pageTokens[0]) {
        return quickRepliesText(text, attachment, userId, pageToken);
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

    setSenderActions(status, userId, pageToken = this.pageTokens[0]) {
        return senderActions(status, userId, pageToken);
    }
}

export { FacebookMessengerBot };
