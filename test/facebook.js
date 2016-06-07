import test from 'ava';
import request from 'request-promise';
import { FacebookMessengerBot } from 'lib/facebook'; // eslint-disable-line

test('Evironment var for the Facebook app is set', t => {
    t.truthy(process.env.FB_CALLBACK_PATH);
    t.truthy(process.env.FB_VERIFY_TOKEN);
    t.truthy(process.env.FB_PAGE_ACCESS_TOKEN);
    t.truthy(process.env.FB_TEST_USER_ID);
    t.truthy(process.env.FB_TEST_USER_FIRST_NAME);
    t.truthy(process.env.PORT);
});

test('Bot Class empty instantiation', t => {
    const bot = new FacebookMessengerBot();
    t.is(typeof bot.launchPromise.then, 'function');
});

const PORT = parseInt(process.env.PORT, 10);
const FB_CALLBACK_PATH = process.env.FB_CALLBACK_PATH;
const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;
const FB_PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;

test('Bot Class empty instantiation, with default values missing', t => {
    t.throws(() => new FacebookMessengerBot({
        port: PORT + 1,
        callbackPath: null
    }));
});

test('Bot with pages to subscribe', t => {
    const bot = new FacebookMessengerBot({
        port: PORT + 2,
        pageTokens: [FB_PAGE_ACCESS_TOKEN]
    });
    t.is(typeof bot.launchPromise.then, 'function');
});

test('Bot Webserver launches and returns expected challenge', async t => {
    const port = PORT + 3;
    const uri = `http://localhost:${port}${FB_CALLBACK_PATH}`;
    const botConfig = {
        port
    };
    const bot = new FacebookMessengerBot(botConfig);
    const serverStarted = await bot.launchPromise;
    t.true(serverStarted);
    const challenge = 'Foobar';
    const validationErrorString = 'Error, wrong validation token';
    const requestOptions = {
        uri,
        qs: {
            'hub.verify_token': FB_VERIFY_TOKEN,
            'hub.challenge': challenge
        }
    };
    const returnedBody = await request(requestOptions);
    t.is(returnedBody, challenge);
    const returnedBody2 = await request.get(uri);
    t.is(returnedBody2, validationErrorString);
});

test(
    'Bot responds with false when it receives a POST on the webhook with no entry parameter',
    async t => {
        const port = PORT + 4;
        const uri = `http://localhost:${port}${FB_CALLBACK_PATH}`;
        const bot = new FacebookMessengerBot({ port });
        const serverStarted = await bot.launchPromise;
        t.true(serverStarted);
        const botResponse = await request({
            uri,
            method: 'POST',
            body: {},
            json: true
        });
        t.false(botResponse);
    }
);
test(
    'Bot with an onUpdate handler calls it when a POST is received',
    async t => {
        const port = PORT + 5;
        const uri = `http://localhost:${port}${FB_CALLBACK_PATH}`;
        const listeners = {
            onUpdate: ({ update }) => {
                t.is(typeof update, 'object');
            }
        };
        const bot = new FacebookMessengerBot({ port, listeners });
        const serverStarted = await bot.launchPromise;
        t.true(serverStarted);
        const requestOptions = {
            uri,
            method: 'POST',
            body: { entry: [{ messaging: [{ }] }] },
            json: true
        };
        const returnedBody = await request(requestOptions);
        t.true(returnedBody);
    }
);
test(
    'Bot with an onMessage handler calls it when a message POST is received',
    async t => {
        const port = PORT + 6;
        const uri = `http://localhost:${port}${FB_CALLBACK_PATH}`;
        const msg = 'Foobar';
        const listeners = {
            onMessage: ({ update }) => {
                const { message } = update;
                t.is(message.text, msg);
            }
        };
        const bot = new FacebookMessengerBot({ port, listeners });
        const serverStarted = await bot.launchPromise;
        t.true(serverStarted);
        const requestOptions = {
            uri,
            method: 'POST',
            body: { entry: [{ messaging: [{ message: { text: msg } }] }] },
            json: true
        };
        const returnedBody = await request(requestOptions);
        t.true(returnedBody);
    }
);

test('Bot get user data', async t => {
    const port = PORT + 7;
    const bot = new FacebookMessengerBot({ port });
    t.is(typeof bot.getUserInfo, 'function');
    const userInfo = await bot.getUserInfo(process.env.FB_TEST_USER_ID);
    t.is(userInfo.first_name, process.env.FB_TEST_USER_FIRST_NAME);
});

test(
    'Bot with onAuthentication, onDelivery and onPostback listeners',
    async t => {
        const port = PORT + 8;
        const uri = `http://localhost:${port}${FB_CALLBACK_PATH}`;
        const ref = 'PASS_THROUGH_PARAM';
        const watermark = 1458668856253;
        const payload = 'USER_DEFINED_PAYLOAD';
        const listeners = {
            onAuthentication: ({ update }) => {
                const { optin } = update;
                t.is(optin.ref, ref);
            },
            onDelivery: ({ update }) => {
                const { delivery } = update;
                t.is(delivery.watermark, watermark);
            },
            onPostback: ({ update }) => {
                const { postback } = update;
                t.is(postback.payload, payload);
            }
        };
        const bot = new FacebookMessengerBot({ port, listeners });
        const serverStarted = await bot.launchPromise;
        t.true(serverStarted);
        const requestOptions = {
            uri,
            method: 'POST',
            body: { entry: [
                { messaging: [
                    { optin: { ref } },
                    { delivery: { watermark } }
                ] },
                { messaging: [
                    { postback: { payload } }
                ] }
            ] },
            json: true
        };
        const returnedBody = await request(requestOptions);
        t.true(returnedBody);
    }
);

test(
    'Bot with an onMessage handler that calls a method of the owner bot (issue #11)',
    t => {
        const port = PORT + 9;
        const uri = `http://localhost:${port}${FB_CALLBACK_PATH}`;
        const msg = 'Foobar';
        return new Promise(async resolve => {
            const onMessage = async ({ bot, update }) => {
                const userInfo = await bot.getUserInfo(update.sender.id);
                t.is(userInfo.first_name, process.env.FB_TEST_USER_FIRST_NAME);
                return resolve();
            };
            const listeners = {
                onMessage
            };
            const bot = new FacebookMessengerBot({ port, listeners });
            const serverStarted = await bot.launchPromise;
            t.true(serverStarted);
            const requestOptions = {
                uri,
                method: 'POST',
                body: { entry: [{ messaging: [{
                    sender: { id: process.env.FB_TEST_USER_ID },
                    message: { text: msg }
                }] }] },
                json: true
            };
            const returnedBody = await request(requestOptions);
            t.true(returnedBody);
        });
    }
);

test('Bot sends a text message', t => {
    const bot = new FacebookMessengerBot({
        port: PORT + 10
    });
    const user = process.env.FB_TEST_USER_ID;
    const message = {
        userId: user,
        text: 'This is a test message!'
    };
    t.plan(1);
    return bot.sendMessage(message, FB_PAGE_ACCESS_TOKEN)
    .then(param => {
        t.truthy(param.message_id);
    }).catch(err => {
        t.is(err.error.error.type, 'OAuthException');
    });
});
