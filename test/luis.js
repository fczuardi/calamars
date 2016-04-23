import test from 'ava';
import * as luis from 'lib/luis';

test('Evironment var for the Luis app is set', t => {
    t.truthy(luis.brainURL);
});

test('GET on Luis URL returns an object',
    t => luis.query('')
        .then(result => t.is(typeof result, 'object'))
        .catch(err => t.is(err.statusCode, 200))
);
