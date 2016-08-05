import { LocalStorage } from 'node-localstorage';
import {
    propEq, find, findIndex, remove, defaultTo,
    update, gte, concat, of, merge, filter
} from 'ramda';

const getDb = config => new LocalStorage(config.localPath);

const setTable = (db, tableName, data) => db.setItem(tableName, JSON.stringify(data));
const getTable = (db, tableName) => JSON.parse(db.getItem(tableName));

const getUsers = db => getTable(db, 'users');
const setUsers = (db, data) => setTable(db, 'users', data);

const getUser = (db, userId) => {
    const users = getUsers(db);
    const propEqIdUserId = propEq('id', userId);
    const user = defaultTo({}, find(propEqIdUserId, users));
    return user;
};
const getUserIndex = (users, userId) => {
    if (!userId) { return -1; }
    const propEqIdUserId = propEq('id', userId);
    return findIndex(propEqIdUserId, users);
};
const setUser = (db, userId, nextUser) => {
    if (!nextUser) { return null; }
    const users = getUsers(db);
    const userIndex = getUserIndex(users, userId);
    const updatedUsers = of(merge({ id: userId }, nextUser));
    const nextUsers = gte(userIndex, 0)
        ? update(userIndex, nextUser, users)
        : concat(users, updatedUsers);
    return setUsers(db, nextUsers);
};
const removeUser = (db, userId) => {
    const users = getUsers(db);
    const userIndex = getUserIndex(users, userId);
    return setUsers(db, remove(userIndex, 1, users));
};

const getUserProp = (db, userId, key) => getUser(db, userId)[key];
const setUserProp = (db, userId, key, value) => setUser(db, userId, {
    ...getUser(db, userId),
    id: userId,
    [key]: value
});
const removeUserProp = (db, userId, key) => {
    const { [key]: oldItem, ...other } = getUser(db, userId);
    return setUser(db, userId, { ...other });
};

const getSelectWhereList = (db, key, value) => {
    var isValue = n => n[key] === value
    const users = getUsers(db);
    const list = filter(isValue, users)
    return list;
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
    removeUserProp,
    getSelectWhereList
};
