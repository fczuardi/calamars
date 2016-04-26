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

test('Have answers lib functions', t => {
    t.truthy(lib.createExactMatchRouter);
    t.truthy(lib.createRegexRouter);
});
