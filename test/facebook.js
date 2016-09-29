import test from 'ava';
import request from 'request-promise';
import { FacebookMessengerBot } from 'lib/facebook'; // eslint-disable-line
import { readFileSync } from 'fs';
import crypto from 'crypto';
import jsesc from 'jsesc';

test('Evironment var for the Facebook app is set', t => {
    t.truthy(process.env.FB_CALLBACK_PATH);
    t.truthy(process.env.FB_VERIFY_TOKEN);
    t.truthy(process.env.FB_PAGE_ID);
    t.truthy(process.env.FB_PAGE_ACCESS_TOKEN);
    t.truthy(process.env.FB_TEST_USER_ID);
    t.truthy(process.env.FB_TEST_USER_FIRST_NAME);
    t.truthy(process.env.PORT);
});

test('Bot Class empty instantiation', t => {
    const bot = new FacebookMessengerBot();
    const launchPromise = bot.start();
    t.is(typeof launchPromise.then, 'function');
    bot.stop();
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
    const launchPromise = bot.start();
    t.is(typeof launchPromise.then, 'function');
    bot.stop();
});

test('Bot Webserver launches and returns expected challenge', async t => {
    const port = PORT + 3;
    const uri = `http://localhost:${port}${FB_CALLBACK_PATH}`;
    const botConfig = {
        port
    };
    const bot = new FacebookMessengerBot(botConfig);
    const serverStarted = await bot.start();
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
    bot.stop();
});

const appSecret = process.env.FB_APP_SECRET;
const bodyDigest = body => {
    const digest = crypto.createHmac('sha1', appSecret)
        .update(jsesc(body, { json: true, lowercaseHex: true }))
        .digest('hex');
    return `sha1=${digest}`;
};

test(
    'Bot responds with false when it receives a POST on the webhook with no entry parameter',
    async t => {
        const port = PORT + 4;
        const uri = `http://localhost:${port}${FB_CALLBACK_PATH}`;
        const bot = new FacebookMessengerBot({ port });
        const serverStarted = await bot.start();
        t.true(serverStarted);
        const body = {};
        const botResponse = await request({
            uri,
            method: 'POST',
            body,
            headers: {
                'x-hub-signature': `${bodyDigest(body)}`
            },
            json: true
        });
        t.false(botResponse);
        bot.stop();
    }
);

test(
    'Bot responds with false when it receives a POST on the webhook with wrong sha1 hash',
    async t => {
        const port = PORT + 5;
        const uri = `http://localhost:${port}${FB_CALLBACK_PATH}`;
        const bot = new FacebookMessengerBot({ port });
        const serverStarted = await bot.start();
        t.true(serverStarted);
        const body = {
            object: 'page',
            entry: [{
                id: '721458654659118',
                time: 1468468354711,
                messaging: [{
                    sender: { id: '10154319360809636' },
                    recipient: { id: '721458654659118' },
                    timestamp: 1468468354680,
                    message: {
                        mid: 'mid.1468468354673:414fa177e7544ac274',
                        seq: 5225,
                        text: 'äöå'
                    }
                }]
            }]
        };
        try {
            const botResponse = await request({
                uri,
                method: 'POST',
                headers: {
                    'x-hub-signature': `${bodyDigest(body)}foo`
                },
                body,
                json: true
            });
            t.fail(botResponse);
        } catch (e) {
            t.is(e.message, '401 - false');
        }
        bot.stop();
    }
);

test(
    'Bot with an onUpdate handler calls it when a POST is received',
    async t => {
        const port = PORT + 6;
        const uri = `http://localhost:${port}${FB_CALLBACK_PATH}`;
        const listeners = {
            onUpdate: ({ update }) => {
                t.is(typeof update, 'object');
            }
        };
        const bot = new FacebookMessengerBot({ port, listeners });
        const serverStarted = await bot.start();
        t.true(serverStarted);
        const body = { entry: [{ messaging: [{ }] }] };
        const requestOptions = {
            uri,
            method: 'POST',
            body,
            headers: {
                'x-hub-signature': `${bodyDigest(body)}`
            },
            json: true
        };
        const returnedBody = await request(requestOptions);
        t.true(returnedBody);
        bot.stop();
    }
);
test(
    'Bot with an onMessage handler calls it when a message POST is received',
    async t => {
        const port = PORT + 7;
        const uri = `http://localhost:${port}${FB_CALLBACK_PATH}`;
        const msg = '/reset';
        const listeners = {
            onMessage: ({ update }) => {
                const { message } = update;
                t.is(message.text, msg);
            }
        };
        const bot = new FacebookMessengerBot({ port, listeners });
        const serverStarted = await bot.start();
        t.true(serverStarted);
        const body = { entry: [{ messaging: [{ message: { text: msg } }] }] };
        const requestOptions = {
            uri,
            method: 'POST',
            body,
            headers: {
                'x-hub-signature': `${bodyDigest(body)}`
            },
            json: true
        };
        const returnedBody = await request(requestOptions);
        t.true(returnedBody);
        bot.stop();
    }
);

test('Bot get user data', async t => {
    const port = PORT + 8;
    const bot = new FacebookMessengerBot({ port });
    t.is(typeof bot.getUserInfo, 'function');
    const userInfo = await bot.getUserInfo(process.env.FB_TEST_USER_ID);
    t.is(userInfo.first_name, process.env.FB_TEST_USER_FIRST_NAME);
});

test(
    'Bot with onAuthentication, onDelivery and onPostback listeners',
    async t => {
        const port = PORT + 9;
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
        const serverStarted = await bot.start();
        t.true(serverStarted);
        const body = { entry: [
            { messaging: [
                { optin: { ref } },
                { delivery: { watermark } }
            ] },
            { messaging: [
                { postback: { payload } }
            ] }
        ] };
        const requestOptions = {
            uri,
            method: 'POST',
            body,
            headers: {
                'x-hub-signature': `${bodyDigest(body)}`
            },
            json: true
        };
        const returnedBody = await request(requestOptions);
        t.true(returnedBody);
        bot.stop();
    }
);

test(
    'Bot with an onMessage handler that calls a method of the owner bot (issue #11)',
    t => {
        const port = PORT + 10;
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
            const serverStarted = await bot.start();
            t.true(serverStarted);
            const body = { entry: [{ messaging: [{
                sender: { id: process.env.FB_TEST_USER_ID },
                message: { text: msg }
            }] }] };
            const requestOptions = {
                uri,
                method: 'POST',
                body,
                headers: {
                    'x-hub-signature': `${bodyDigest(body)}`
                },
                json: true
            };
            const returnedBody = await request(requestOptions);
            t.true(returnedBody);
            bot.stop();
        });
    }
);

test('Bot sends a text message', async t => {
    const bot = new FacebookMessengerBot({
        port: PORT + 11
    });
    const serverStarted = await bot.start();
    t.true(serverStarted);
    const invalidUserIdMessage = {
        userId: 'Foo12345',
        text: 'This is a test message to an unauthorized user.'
    };
    bot.sendMessage(invalidUserIdMessage).catch(err => {
        t.is(err.error.error.type, 'OAuthException');
    });
    const userId = process.env.FB_TEST_USER_ID;
    const message = {
        userId,
        text: 'This is a test message! 🐙'
    };
    const sendMessageResult = await bot.sendMessage(message);
    t.truthy(sendMessageResult.message_id);
    bot.stop();
});

test('Bot sends a long text message', async t => {
    const bot = new FacebookMessengerBot({
        port: PORT + 12
    });
    const serverStarted = await bot.start();
    t.true(serverStarted);
    const userId = process.env.FB_TEST_USER_ID;
    const message = {
        userId,
        text: `
Out of death, though grant thou, residing here, where it holds well served in post;
If I heard breaking through the burden do now,
Taking the ladies both, must eat,
That meat is not frantic,--
As I could have at the moon and all gaze upon thine eyes, which of goods at fainting under
The pleasing punishment that deceive the Capitol!
        `
    };
    const sendMessageResult = await bot.sendMessage(message);
    t.truthy(sendMessageResult.message_id);
    t.truthy(sendMessageResult.recipient_id);
    bot.stop();
});

test('Bot sends a message with image attachment', async t => {
    const bot = new FacebookMessengerBot({
        port: PORT + 13
    });
    const serverStarted = await bot.start();
    t.true(serverStarted);
    const userId = process.env.FB_TEST_USER_ID;
    const message = {
        userId,
        attachment: {
            type: 'image',
            payload: {
                url: 'https://openclipart.org/image/200px/svg_to_png/230920/planet-remix.png'
            }
        }
    };
    const sendMessageResult = await bot.sendMessage(message);
    t.truthy(sendMessageResult.message_id);
    t.truthy(sendMessageResult.recipient_id);
    bot.stop();
});

test('Change welcome message of a bot', async t => {
    const bot = new FacebookMessengerBot({
        port: PORT + 14
    });
    const serverStarted = await bot.start();
    t.true(serverStarted);
    const message = {
        text: 'A new test welcome message. 🐨'
    };
    const setWelcomeMessageResult = await bot.setWelcomeMessage(message);
    t.truthy(setWelcomeMessageResult.result);
    bot.stop();
});

test('Setup persistent menu of a bot', async t => {
    const bot = new FacebookMessengerBot({
        port: PORT + 15
    });
    const serverStarted = await bot.start();
    t.true(serverStarted);
    const type = 'call_to_actions';
    const state = 'existing_thread';
    const cta = [
        {
            type: 'web_url',
            title: 'Foo',
            url: 'http://example.com'
        }
    ];
    const setThreadSettingResult = await bot.setThreadSettings({
        type,
        state,
        cta
    });
    t.truthy(setThreadSettingResult);
    bot.stop();
});

test('Setup Get Start button postback of a bot', async t => {
    const bot = new FacebookMessengerBot({
        port: PORT + 16
    });
    const serverStarted = await bot.start();
    t.true(serverStarted);
    const type = 'call_to_actions';
    const state = 'new_thread';
    const cta = [
        {
            payload: 'START'
        }
    ];
    const setThreadSettingResult = await bot.setThreadSettings({
        type,
        state,
        cta
    });
    t.truthy(setThreadSettingResult);
    bot.stop();
});

test('Bot server can also serve static files', async t => {
    const port = PORT + 17;
    const path = '/foo';
    const file = '../LICENSE';
    const uri = `http://localhost:${port}${path}`;
    const staticFiles = [{ path, file }];
    const bot = new FacebookMessengerBot({
        port,
        staticFiles
    });
    const serverStarted = await bot.start();
    t.true(serverStarted);
    const returnedBody = await request(uri);
    const fileContents = readFileSync(file);
    t.is(returnedBody, fileContents.toString());
    bot.stop();
});
