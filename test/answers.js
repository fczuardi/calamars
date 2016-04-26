import test from 'ava';
import {
    createExactMatchRouter,
    createRegexRouter
} from 'lib/answers';

test('Hello/Goodbye exact match router works as expected', t => {
    const pairs = [
        ['yes', 'no'],
        ['stop', 'go go go'],
        ['goodbye', 'hello'],
        ['high', 'low'],
        ['why', 'I don’t know']
    ];
    const router = createExactMatchRouter(pairs);
    t.is(router('high'), 'low');
    t.is(router('cha cha cha'), null);
});

test('Hello/Goodbye regex router works as expected', t => {
    const pairs = [
        [/yes/i, 'no'],
        [/stop/i, 'go go go'],
        [/goodbye/i, 'hello'],
        [/high/i, 'low'],
        [/why/i, 'I don’t know']
    ];
    const router = createRegexRouter(pairs);
    t.is(router('I say HIGH, you say?'), 'low');
    t.is(router('cha cha cha'), null);
});
