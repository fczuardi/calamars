import test from 'ava';
import {
    createExactMatchRouter,
    createRegexRouter
} from 'lib/answers';

test('string -> string: Hello/Goodbye exact match router', t => {
    const stringPairs = [
        ['yes', 'no'],
        ['stop', 'go go go'],
        ['goodbye', 'hello'],
        ['high', 'low'],
        ['why', 'I don’t know']
    ];
    const router = createExactMatchRouter(stringPairs);
    t.is(router('high'), 'low');
    t.is(router('cha cha cha'), null);
});

test('regex -> string: Hello/Goodbye regex router', t => {
    const regexPairs = [
        [/yes/i, 'no'],
        [/stop/i, 'go go go'],
        [/goodbye/i, 'hello'],
        [/high/i, 'low'],
        [/why/i, 'I don’t know']
    ];
    const router = createRegexRouter(regexPairs);
    t.is(router('I say HIGH, you say?'), 'low');
    t.is(router('cha cha cha'), null);
});

test('string -> callback -> string : Hello/Goodbye exact match router', t => {
    const callbacks = {
        yes() { return 'no'; },
        halt() { return 'go go go'; },
        goodbye() { return 'hello'; },
        high() { return 'low'; },
        why() { return 'I don’t know'; }
    };
    const stringCbPairs = [
        ['yes', callbacks.yes],
        ['stop', callbacks.halt],
        ['goodbye', callbacks.goodbye],
        ['high', callbacks.high],
        ['why', callbacks.why]
    ];
    const router = createExactMatchRouter(stringCbPairs);
    t.is(router('high')(), 'low');
    t.is(router('cha cha cha'), null);
});

test('regex -> callback -> string: Hello/Goodbye regex router', t => {
    const regexCbPairs = [
        [/yes/i, () => 'yes'],
        [/stop/i, () => 'go go go'],
        [/goodbye/i, () => 'hello'],
        [/high/i, () => 'low'],
        [/why/i, () => 'I don’t know']
    ];
    const router = createRegexRouter(regexCbPairs);
    t.is(router('hIGh')(), 'low');
    t.is(router('cha cha cha'), null);
});

test.todo('string -> LUIS -> intentName -> callback -> string');
test.todo('string -> LUIS -> luisPayload -> callback -> string');
test.todo('chatSession -> string -> LUIS -> intentName -> callback -> string -> chatSession');
test.todo('chatSession -> string -> LUIS -> luisPayload -> callback -> string -> chatSession');
