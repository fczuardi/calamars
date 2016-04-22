import test from 'ava';

const brainURL = process.env.LUIS_APP_URL;

test('Evironment var for the Luis app is set', t => {
    t.truthy(brainURL);
});

test.skip('GET on Luis URL returns a JSON', t => {
    t.pass();
});

test.todo('Get on the Luis url returns a JSON');
