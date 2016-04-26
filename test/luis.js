import test from 'ava';
import { LuisDriver, previewBaseURL } from 'lib/luis';
import { createExactMatchRouter } from 'lib/answers';
import fakeLuisApi from 'fixtures/luis/nock';

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
            .then(({ query, topScoringIntent }) => {
                const {
                    intent,
                    score
                } = topScoringIntent;
                t.is(query, 'Hi');
                t.is(typeof intent, 'string');
                t.is(typeof score, 'number');
            });
        return queryPromise;
    }
);

test('string -> LUIS -> intentName -> callback -> string', t => {
    const luis = new LuisDriver(options);
    const callback = () => 'go go go';
    const routes = [
        ['goodbye', callback]
    ];
    const router = createExactMatchRouter(routes);
    return luis.query('Good Bye!')
        .then(({ topScoringIntent }) => {
            const intentName = topScoringIntent.intent;
            t.is(router(intentName), callback);
            t.is(router(intentName)(), 'go go go');
        });
});
test.todo('string -> LUIS -> luisPayload -> callback -> string');
test.todo('chatSession -> string -> LUIS -> intentName -> callback -> string -> chatSession');
test.todo('chatSession -> string -> LUIS -> luisPayload -> callback -> string -> chatSession');
