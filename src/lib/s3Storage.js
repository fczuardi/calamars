import config from '../../s3Config';
import AWS from 'aws-sdk';
import {
    prop, lensProp, set
} from 'ramda';

AWS.config.update(config.AWS);
const path = config.path;

const getDb = param => new AWS.S3(param.S3);

// Just for compability
const getUsers = db => true;  // eslint-disable-line
const setUsers = (db, data) => true; // eslint-disable-line

const getUser = (db, userId) =>
    db.getObject({
        Key: `${path}/${userId}.json`
    }).promise()
    .then(body => body.Body.toString())
    .catch(err => {
        console.log(err);
        return {};
    });

const setUser = (db, userId, nextUser) => {
    if (!nextUser) { return null; }
    return db.putObject({
        Key: `${path}/${userId}.json`,
        Body: JSON.stringify(nextUser)
    }).promise()
    .then(() => userId)
    .catch(err => {
        console.log(err);
        return nextUser;
    });
};

const removeUser = (db, userId) => {
    if (!userId) { return null; }
    return db.deleteObject({
        Key: `${path}/${userId}.json`
    }).promise()
    .then(() => userId)
    .catch(err => {
        console.log(err);
        return undefined;
    });
};

const getUserProp = (db, userId, key) => {
    if (!userId) { return null; }
    return getUser(db, userId)
    .then(u => {
        if (!u || !key) { return undefined; }
        const user = JSON.parse(u);
        if (!key) {
            return '';
        }
        return prop(key, user);
    }).catch(err => {
        console.log(err);
        return undefined;
    });
};

const setUserProp = (db, userId, key, value) => {
    if (!userId) { return null; }
    return getUser(db, userId)
    .then(u => {
        if (!u || !key) { return undefined; }
        const user = JSON.parse(u);
        return set(lensProp(key), value, user);
    })
    .catch(err => {
        console.log(err);
        return undefined;
    });
};

const removeUserProp = (db, userId, key) => {
    if (!userId || !key) { return null; }
    return getUser(db, userId)
    .then(u => {
        if (!u) { return undefined; }
        const { [key]: oldItem, ...other} = JSON.parse(u); // eslint-disable-line
        return setUser(db, userId, { ...other });
    })
    .catch(err => {
        console.log(err);
        return undefined;
    });
};


export {
    getDb,
    getUsers,
    setUsers,
    getUser,
    setUser,
    removeUser,
    getUserProp,
    setUserProp,
    removeUserProp
};
