import test from 'ava';

import * as lib from 'lib';

test('Get version function', t => {
    t.truthy(lib.version);
});
