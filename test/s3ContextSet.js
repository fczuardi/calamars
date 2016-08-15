import test from 'ava';
import config from '../s3Config';
import ContextSet from '../src/lib/s3ContextSet';

const db = new ContextSet(config);

test('checks config files parameters', t => {
    const localDb = new ContextSet(config);
    t.truthy(localDb);
});

test('setContext works with valid data', async t => {
    const nextUser = {
        name: 'foo',
        info: 'bar'
    };
    const nextUserId = '123';
    const userId = await db.setContext(nextUserId, nextUser);
    t.is(userId, nextUserId);
});

test('getContext works with valid data', async t => {
    const nextUser = {
        name: 'foo',
        info: 'bar'
    };
    const nextUserId = '1234';
    const userId = await db.setContext(nextUserId, nextUser);
    const newUser = JSON.parse(await db.getContext(userId));
    t.deepEqual(newUser, nextUser);
});

test('setContextProp works with valid data', async t => {
    const nextUser = {
        name: 'foo'
    };
    const nextUserId = '12345';
    const userId = await db.setContext(nextUserId, nextUser);
    const newUser = await db.setContextProp(userId, 'info', 'bar');
    const foo = { ...nextUser, info: 'bar' }; // this is ava bitchin me
    t.deepEqual(foo, newUser);
});

test('getContextProp works with valid data', async t => {
    const nextUser = {
        name: 'foo',
        info: 'bar'
    };
    const nextUserId = '123456';
    const userId = await db.setContext(nextUserId, nextUser);
    const userProp = await db.getContextProp(userId, 'name');
    t.is('foo', userProp);
});

test('removeContextProp works with valid data', async t => {
    const nextUser = {
        name: 'foo',
        info: 'bar'
    };
    const nextUserId = '123456';
    const userId = await db.setContext(nextUserId, nextUser);
    const newUserId = await db.removeContextProp(userId, 'info');
    const newUser = JSON.parse(await db.getContext(newUserId));
    t.deepEqual(newUser, { name: 'foo' });
});
