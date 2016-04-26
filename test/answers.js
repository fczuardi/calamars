import test from 'ava';
import {
    createExactMatchRouter,
    createRegexRouter
} from 'lib/answers';

const stringPairs = [
    ['yes', 'no'],
    ['stop', 'go go go'],
    ['goodbye', 'hello'],
    ['high', 'low'],
    ['why', 'I don’t know']
];
test('string -> string: Hello/Goodbye exact match router', t => {
    const router = createExactMatchRouter(stringPairs);
    t.is(router('high'), 'low');
    t.is(router('cha cha cha'), null);
});

const regexPairs = [
    [/yes/i, 'no'],
    [/stop/i, 'go go go'],
    [/goodbye/i, 'hello'],
    [/high/i, 'low'],
    [/why/i, 'I don’t know']
];
test('regex -> string: Hello/Goodbye regex router', t => {
    const router = createRegexRouter(regexPairs);
    t.is(router('I say HIGH, you say?'), 'low');
    t.is(router('cha cha cha'), null);
});

const callbacks = {
    yes() { return 'no'; },
    halt() { return 'go go go'; },
    goodbye() { return 'hello'; },
    high() { return 'low'; },
    why() { return 'I don’t know'; }
};
const cbKeys = Object.keys(callbacks);
const stringCbPairs = stringPairs.map((pair, i) => [pair[0], callbacks[cbKeys[i]]]);
test('string -> callback: Hello/Goodbye exact match router', t => {
    const router = createExactMatchRouter(stringCbPairs);
    t.is(router('high')(), 'low');
    t.is(router('cha cha cha'), null);
});

const regexCbPairs = regexPairs.map((pair, i) => [pair[0], callbacks[cbKeys[i]]]);
test('regex -> callback: Hello/Goodbye regex router', t => {
    const router = createRegexRouter(regexCbPairs);
    t.is(router('high')(), 'low');
    t.is(router('cha cha cha'), null);
});
