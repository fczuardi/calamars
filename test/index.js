import test from 'ava';

import * as lib from '../dist/npm/src/lib';

test('Get version function', t => {
    t.truthy(lib.version);
});
