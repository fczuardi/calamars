import test from 'ava';
import { WitDriver } from 'lib/wit';

const options = {
    id: process.env.WIT_APP_ID,
    serverToken: process.env.WIT_SERVER_TOKEN
};

test('Instantiation attempt without options should fail', t => {
    t.throws(() => (new WitDriver()));
    t.throws(() => (new WitDriver({})));
    t.throws(() => (new WitDriver({ id: '12345' })));
    t.notThrows(() => (new WitDriver({ id: '12345', serverToken: '54321' })));
});

test('Evironment var for the Luis app is set', t => {
    t.truthy(process.env.WIT_APP_ID);
    t.truthy(process.env.WIT_SERVER_TOKEN);
});

test('GET on Wit URL with empty query returns an error, with body object', t => {
    const wit = new WitDriver(options);
    return wit.query()
        .then(result => t.is(typeof result, 'object'))
        .catch(err => {
            t.is(err.statusCode, 400);
            t.is(JSON.parse(err.error).code, 'msg-invalid');
        });
});

test(
    'Query "Hi" should return a payload with _text and outcomes properties',
    t => {
        const wit = new WitDriver(options);
        const queryPromise = wit.query('Hi')
            .then(result => {
                const { _text, outcomes } = result;
                t.is(_text, 'Hi');
                t.truthy(outcomes.length);
            });
        return queryPromise;
    }
);
