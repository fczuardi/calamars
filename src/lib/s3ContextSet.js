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
} from './s3Storage';
import AWS from 'aws-sdk';

class ContextSet {
    constructor(config) {
        AWS.config.update(config.AWS);
        this.db = getDb(config);
        this.path = config.path;
        if (!getUsers(this.db)) {
            setUsers(this.db, []);
        }
    }
    setContext(id, nextContext) {
        return setUser(this.db, this.path, id, nextContext);
    }
    getContext(id) {
        return getUser(this.db, this.path, id);
    }
    removeContext(id) {
        return removeUser(this.db, this.path, id);
    }
    setContextProp(id, key, value) {
        return setUserProp(this.db, this.path, id, key, value);
    }
    getContextProp(id, key) {
        return getUserProp(this.db, this.path, id, key);
    }
    removeContextProp(id, key) {
        return removeUserProp(this.db, this.path, id, key);
    }
}

export default ContextSet;
