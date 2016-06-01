import test from 'ava';
import * as lib from 'lib';

test('Get version function', t => {
    t.truthy(lib.version);
});

test('Have LUIS lib functions', t => {
    t.truthy(lib.previewBaseURL);
    t.truthy(lib.previewApiPath);
    t.truthy(lib.LuisDriver);
});

test('Have router lib functions', t => {
    t.truthy(lib.createRouter);
});

test('Have FacebookMessenger class', t => {
    t.truthy(lib.FacebookMessengerBot);
});
