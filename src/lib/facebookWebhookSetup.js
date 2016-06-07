// facebookWebhookSetup
// ====================
//
// Helpers for generating [Express][expressjs]-style GET and POST functions to
// be used with Facebook Messenger Webhooks
//
// [expressjs]: http://expressjs.com/
//
// -----

// ## setupGetWebhook(fbVerifyToken)
//
// High order function that given a verify token returns a function that either
// sends the challenge as response or a validation error message depending on
// the requested ```hub.verify_token``` parameter value.
const setupGetWebhook = fbVerifyToken => (req, res) => {
    if (req.query['hub.verify_token'] === fbVerifyToken) {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Error, wrong validation token');
    }
};

// ## setupPostWebhook(bot, listeners)
//
// High order function that given an object with event handlers,
// returns a function that will take POST requests and call the proper handlers
// depending on the contents of the request. Or respond false when no entry
// value is present in the body of the POST.
//
// The returned function assumes you are using a body parser, such as
// [body-parser][npmbodyparser], that makes req.body acessible as an object.
//
// ### Parameters
// - **listeners** - _Object_ - An object with different handler functions for each
// different webhook post format, see [Webhook reference][webhookreference].
// - **bot** - _FacebookMessengerBot_ - A bot server instance to be passed as
// parameter to the listener callbacks.
//
// | Listener | Description |
// |--------|-------------|
// | onUpdate | Generic callback, called for every messaging item received. |
// | onMessage | Specific callback for messages (text or media) |
// | onAuthentication | Specific callback for authentication updates |
// | onDelivery | Specific callback for delivery updates |
// | onPostback | Specific callback for postback updates |
//
//
// [npmbodyparser]: https://www.npmjs.com/package/body-parser
// [webhookreference]: https://developers.facebook.com/docs/messenger-platform/webhook-reference
const setupPostWebhook = (listeners, bot) => (req, res) => {
    const fNull = () => null;
    const {
        onUpdate = fNull,
        onMessage = fNull,
        onAuthentication = fNull,
        onDelivery = fNull,
        onPostback = fNull
    } = listeners;
    if (!req.body.entry || !Array.isArray(req.body.entry)) {
        return res.send(false);
    }
    req.body.entry.forEach(({ messaging }) => {
        messaging.forEach(update => {
            const { message, optin, delivery, postback } = update;
            const payload = {
                update,
                bot
            };
            onUpdate(payload);
            if (message) {
                onMessage(payload);
            }
            if (optin) {
                onAuthentication(payload);
            }
            if (delivery) {
                onDelivery(payload);
            }
            if (postback) {
                onPostback(payload);
            }
        });
    });
    return res.send(true);
};

export { setupGetWebhook, setupPostWebhook };
