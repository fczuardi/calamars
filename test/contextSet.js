import test from 'ava';

import ContextSet from 'lib/contextSet'; // eslint-disable-line

const storage = new ContextSet({ localPath: '../cache-test' });

test('removeContext', t => {
    const contextId = 1;
    storage.removeContext(contextId);
    t.deepEqual(storage.getContext(contextId), {});
});

test('setContext without id or next context returns null', t => {
    t.falsy(storage.setContext());
    t.falsy(storage.setContext('2'));
});

test('setContext, getContext, getContextProp', t => {
    const contextId = '2';
    const nextContext = {
        id: contextId,
        name: 'foo'
    };
    storage.removeContext(contextId);
    storage.setContext(contextId, nextContext);
    t.deepEqual(storage.getContext(contextId), nextContext);
    t.is(storage.getContextProp(contextId, 'name'), nextContext.name);
});

test('setContextProp, removeContextProp', t => {
    const contextId = '345';
    const context = {
        firstName: 'foo',
        lastName: 'bar'
    };
    const age = 37;
    const age2 = 18;
    storage.removeContext(contextId);
    storage.setContext(contextId, context);
    storage.setContextProp(contextId, 'age', age);
    t.is(storage.getContextProp(contextId, 'age'), age);
    t.deepEqual(storage.getContext(contextId), { id: contextId, age, ...context });
    storage.setContextProp(contextId, 'age', age2);
    t.deepEqual(storage.getContext(contextId), { id: contextId, age: age2, ...context });

    storage.removeContextProp(contextId, 'age');
    t.deepEqual(storage.getContext(contextId), { id: contextId, ...context });
    return t.pass();
});

test('getPropValueList', t => {
    const contextId1 = '1';
    const contextId2 = '2';
    const contextId3 = '3';
    const context1 = {
        name: 'foo',
        age: '16'
    };
    const context2 = {
        name: 'bar',
        age: '12'
    };

    storage.removeContext(contextId1);
    storage.removeContext(contextId2);
    storage.removeContext(contextId3);

    storage.setContext(contextId1, context1); // Foo
    storage.setContext(contextId2, context2); // Bar
    storage.setContext(contextId3, context2); // Bar

    const list = storage.getPropValueList('name', 'bar');
    t.deepEqual(list, [{
        id: '2',
        name: 'bar',
        age: '12'
    }, {
        id: '3',
        name: 'bar',
        age: '12'
    }]);
});
