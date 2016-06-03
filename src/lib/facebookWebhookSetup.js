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

// ## setupPostWebhook(fbVerifyToken)
//
// High order function that given a messageHandler function,
// returns a function that will take POST requests and send received messages
// to the messageHandler or respond false when no entry value is present in the
// body of the POST.
//
// The returned function assumes you are using a body parser, such as
// [body-parser][npmbodyparser], that makes req.body acessible as an object.
//
// [npmbodyparser]: https://www.npmjs.com/package/body-parser
const setupPostWebhook = messageHandler => (req, res) => {
    if (!req.body.entry || !Array.isArray(req.body.entry)) {
        console.error('Facebook POST dont have an entry array', req.body);
        return res.send(false);
    }
    req.body.entry.forEach(({ messaging }) => {
        messaging.forEach(message => messageHandler(message));
    });
    return res.send(true);
};

export { setupGetWebhook, setupPostWebhook };
