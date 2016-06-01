import test from 'ava';
import request from 'request-promise';
import FBBot from '../src/lib/facebook';

test('Evironment var for the Facebook app is set', t => {
    t.truthy(process.env.FB_CALLBACK_PATH);
    t.truthy(process.env.FB_VERIFY_TOKEN);
    t.truthy(process.env.FB_PAGE_ACCESS_TOKEN);
});

test('Facebook Bot Class empty instantiation', t => {
    const bot = new FBBot();
    t.is(typeof bot.app, 'function');
    t.is(typeof bot.app.listen, 'function');
    t.is(typeof bot.start, 'function');
});

test.only('Facebook Bot Webserver launches and returns expected challenge', async t => {
    const bot = new FBBot();
    const serverStarted = await bot.start();
    t.true(serverStarted);
    const challenge = 'Foobar';
    const validationErrorString = 'Error, wrong validation token';
    const PORT = process.env.PORT || 8082;
    const FB_CALLBACK_PATH = process.env.FB_CALLBACK_PATH;
    const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;
    const uri = `http://localhost:${PORT}${FB_CALLBACK_PATH}`;
    const requestOptions = {
        uri,
        qs: {
            'hub.verify_token': FB_VERIFY_TOKEN,
            'hub.challenge': challenge
        }
    };
    const returnedBody = await request.get(requestOptions);
    t.is(returnedBody, challenge);
    const returnedBody2 = await request.get(uri);
    t.is(returnedBody2, validationErrorString);
});
