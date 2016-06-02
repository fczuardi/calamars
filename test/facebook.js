import test from 'ava';
import request from 'request-promise';
import { FacebookMessengerBot } from 'lib/facebook';

test('Evironment var for the Facebook app is set', t => {
    t.truthy(process.env.FB_CALLBACK_PATH);
    t.truthy(process.env.FB_VERIFY_TOKEN);
    t.truthy(process.env.FB_PAGE_ACCESS_TOKEN);
    t.truthy(process.env.PORT);
});

test('Bot Class empty instantiation', t => {
    const bot = new FacebookMessengerBot();
    t.is(typeof bot.then, 'function');
});

let port = parseInt(process.env.PORT, 10);
const FB_CALLBACK_PATH = process.env.FB_CALLBACK_PATH;
const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;

test('Bot Webserver launches and returns expected challenge', async t => {
    port += 1;
    const uri = `http://localhost:${port}${FB_CALLBACK_PATH}`;
    const botConfig = {
        port
    };
    const bot = new FacebookMessengerBot(botConfig);
    const serverStarted = await bot;
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
    'Bot instantiated with a message handler calls it when a message POST is received',
    async t => {
        port += 1;
        const uri = `http://localhost:${port}${FB_CALLBACK_PATH}`;
        const msg = 'Foobar';
        const messageHandler = ({ text }) => {
            t.is(text, msg);
        };
        const bot = new FacebookMessengerBot({ port, messageHandler });
        const serverStarted = await bot;
        t.true(serverStarted);
        const requestOptions = {
            uri,
            method: 'POST',
            body: { entry: [{ messaging: [{ text: msg }] }] },
            json: true
        };
        const returnedBody = await request(requestOptions);
        t.true(returnedBody);
        const returnedBody2 = await request({
            ...requestOptions,
            body: {}
        });
        t.false(returnedBody2);
    }
);
