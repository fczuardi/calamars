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
// const storage = getDb(config);

test.only('Check if env vars is properly defined', t => {
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
