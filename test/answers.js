import test from 'ava';
import {
    createExactMatchRouter,
    createRegexRouter,
    createRegexFunctionRouter
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

test('string -> regex -> string: Hello/Goodbye regex router', t => {
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

test('string-> regex -> callback -> string: Hello/Goodbye regex router', t => {
    const regexCbPairs = [
        [/yes/i, () => 'no'],
        [/stop/i, () => 'go go go'],
        [/goodbye/i, () => 'hello'],
        [/high/i, () => 'low'],
        [/why/i, () => 'I don’t know']
    ];
    const router = createRegexRouter(regexCbPairs);
    t.is(router('hIGh')(), 'low');
    t.is(router('cha cha cha'), null);
});

test('string -> regex -> callback -> string : Echo function regex router.', t => {
    const regexCbPairs = [
        [/(.*)/, matches => matches[0]]
    ];
    const router = createRegexFunctionRouter(regexCbPairs);
    t.is(router('cha cha cha'), 'cha cha cha');
});

test(
    'string -> regex -> callback -> string : Regex router with matches and default answer.',
    t => {
        const regexCbPairs = [
            [/yes/i, matches => `You say ${matches[0]}, I say no.`],
            [/stop/i, matches => `You say ${matches[0]}, I say go go go, oh no.`],
            [/high/i, matches => `I say ${matches[0]}, You say low.`],
            [/why/i, matches => `You say ${matches[0]} and I say I don’t know`],
            [/(.*)/, matches => `I dont know why you say ${matches[0]}, I say hello.`]
        ];
        const router = createRegexFunctionRouter(regexCbPairs);
        t.is(router('foobar HiGH'), 'I say HiGH, You say low.');
        t.is(router('cha cha cha'), 'I dont know why you say cha cha cha, I say hello.');
    }
);

test.todo('string -> LUIS -> intentName -> callback -> string');
test.todo('string -> LUIS -> luisPayload -> callback -> string');
test.todo('chatSession -> string -> LUIS -> intentName -> callback -> string -> chatSession');
test.todo('chatSession -> string -> LUIS -> luisPayload -> callback -> string -> chatSession');
