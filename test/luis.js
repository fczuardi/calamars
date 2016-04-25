import test from 'ava';
import fakeLuisApi from './fixtures/luis/nock';
import LuisDriver, { previewBaseURL } from 'lib/luis';

const options = {
    id: process.env.LUIS_APP_ID,
    subscriptionKey: process.env.LUIS_APP_SUBSCRIPTION_KEY
};

const scope = fakeLuisApi(previewBaseURL);

test('Luis API is mocked', t => {
    t.is(scope.urlParts.href, `${previewBaseURL}/`);
});

test('Instantiation attempt without options should fail', t => {
    t.throws(() => (new LuisDriver()));
    t.throws(() => (new LuisDriver({})));
    t.throws(() => (new LuisDriver({ id: '12345' })));
    t.notThrows(() => (new LuisDriver({ id: '12345', subscriptionKey: '54321' })));
});

test('Evironment var for the Luis app is set', t => {
    t.truthy(process.env.LUIS_APP_ID);
    t.truthy(process.env.LUIS_APP_SUBSCRIPTION_KEY);
});

test('GET on Luis URL returns an object', t => {
    const luis = new LuisDriver(options);
    return luis.query()
        .then(result => t.is(typeof result, 'object'))
        .catch(err => t.is(err.statusCode, 200));
});

test(
    'Query "Hi" should return a topScoringIntent object with intent and score attributes',
    t => {
        const luis = new LuisDriver(options);
        const queryPromise = luis.query('Hi')
            .then(result => {
                const {
                    intent,
                    score
                } = result.topScoringIntent;
                t.is(result.query, 'Hi');
                t.is(typeof intent, 'string');
                t.is(typeof score, 'number');
            });
        return queryPromise;
    }
);
