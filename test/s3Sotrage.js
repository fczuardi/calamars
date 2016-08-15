import test from 'ava';
import config from '../s3Config';
import {
    getDb,
    getUsers,
    setUsers,
    getUser,
    setUser,
    removeUser,
    getUserProp,
    setUserProp,
    removeUserProp
} from '../src/lib/s3Storage';

const path = config.path;
const storage = getDb(config);

test('Check if env vars is properly defined', t => {
    t.truthy(config.AWS);
    t.truthy(config.AWS.accessKeyId);
    t.truthy(config.AWS.secretAccessKey);
    t.truthy(config.AWS.region);
    t.truthy(config.path);
    t.truthy(config.S3);
    t.truthy(config.S3.params);
    t.truthy(config.S3.params.Bucket);
    const db = getDb(config);
    t.truthy(db);
});

test('getUsers and setUsers should return true', t => {
    t.true(getUsers(storage));
    t.true(setUsers(storage, { foo: 'bar' }));
});

test('setUser works with valid data input', async t => {
    const nextUser = {
        name: 'foo',
        info: 'bar'
    };
    const nextUserId = '123456';
    const userId = await setUser(storage, nextUserId, nextUser);
    t.is(userId, nextUserId);
});

test('setUser works with valid data input', async t => {
    const nextUser = {
        name: 'foo',
        info: 'bar'
    };
    const nextUserId = '1234567';
    await setUser(storage, nextUserId, nextUser);
    const user = JSON.parse(await getUser(storage, nextUserId));
    t.is(user.name, nextUser.name);
    t.is(user.info, nextUser.info);
});

test('remove user works with valid data input', async t => {
    const nextUser = {
        name: 'foo',
        info: 'bar'
    };
    const nextUserId = '12345678';
    await setUser(storage, nextUserId, nextUser);
    const removedUserId = await removeUser(storage, nextUserId);
    t.is(removedUserId, nextUserId);
    const removedUser = await getUser(storage, removedUserId);
    t.deepEqual(removedUser, Object({}));
});

test('getUserProp works with valid data inpu', async t => {
    const nextUser = {
        name: 'foo',
        info: 'bar'
    };
    const nextUserId = '123456789';
    await setUser(storage, nextUserId, nextUser);
    const userProp = await getUserProp(storage, nextUserId, 'name');
    t.is(userProp, 'foo');
});
