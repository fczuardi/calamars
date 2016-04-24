import test from 'ava';
import LuisDriver from 'lib/luis';

test('Evironment var for the Luis app is set', t => {
    t.truthy(process.env.LUIS_APP_ID);
    t.truthy(process.env.LUIS_APP_SUBSCRIPTION_KEY);
});

test('GET on Luis URL returns an object', t => {
    const options = {
        id: process.env.LUIS_APP_ID,
        subscriptionKey: process.env.LUIS_APP_SUBSCRIPTION_KEY
    }
    const luis = new LuisDriver(options);
    luis.query('')
        .then(result => t.is(typeof result, 'object'))
        .catch(err => t.is(err.statusCode, 200))
});
