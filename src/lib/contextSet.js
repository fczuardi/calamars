import {
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
} from './dbLocalStorage';

class ContextSet {
    constructor(config) {
        this.db = getDb(config);
        if (!getUsers(this.db)) {
            setUsers(this.db, []);
        }
    }
    setContext(id, nextContext) {
        return setUser(this.db, id, nextContext);
    }
    getContext(id) {
        return getUser(this.db, id);
    }
    removeContext(id) {
        return removeUser(this.db, id);
    }
    setContextProp(id, key, value) {
        return setUserProp(this.db, id, key, value);
    }
    getContextProp(id, key) {
        return getUserProp(this.db, id, key);
    }
    removeContextProp(id, key) {
        return removeUserProp(this.db, id, key);
    }
    getPropValueList (key, value) {
        return getSelectWhereList (this.db, key, value)
    }

}

export default ContextSet;
