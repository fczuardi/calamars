import test from 'ava';
import { createRouter } from 'lib/router';

test('createRouter with no routes parameters', t => {
    const router = createRouter();
    t.truthy(router);
    t.falsy(router());
});

test('createRouter with empty routes', t => {
    const routes = [];
    const router = createRouter(routes);
    t.truthy(router);
    t.falsy(router('hi'));
});

test('createRouter with invalid routes', t => {
    const routes = [1, 2, 3];
    const router = createRouter(routes);
    t.truthy(router);
    t.falsy(router('hi'));
});

test('string → string: Hello/Goodbye exact match router', t => {
    const routes = [
        ['yes', 'no'],
        ['stop', 'go go go'],
        ['goodbye', 'hello'],
        ['high', 'low'],
        ['why', 'I don’t know']
    ];
    const router = createRouter(routes);
    t.is(router('high'), 'low');
    t.is(router('cha cha cha'), null);
});

test('string → regex → string: Hello/Goodbye regex router', t => {
    const routes = [
        [/yes/i, 'no'],
        [/stop/i, 'go go go'],
        [/goodbye/i, 'hello'],
        [/high/i, 'low'],
        [/why/i, 'I don’t know']
    ];
    const router = createRouter(routes);
    t.is(router('I say HIGH, you say?'), 'low');
    t.is(router('cha cha cha'), null);
});

test('string → callback → string: Hello/Goodbye exact match router', t => {
    const callbacks = {
        yes() { return 'no'; },
        halt() { return 'go go go'; },
        goodbye() { return 'hello'; },
        high() { return 'low'; },
        why() { return 'I don’t know'; }
    };
    const routes = [
        ['yes', callbacks.yes],
        ['stop', callbacks.halt],
        ['goodbye', callbacks.goodbye],
        ['high', callbacks.high],
        ['why', callbacks.why]
    ];
    const router = createRouter(routes);
    t.is(router('high'), 'low');
    t.is(router('cha cha cha'), null);
});

test('string → regex → callback → string: Hello/Goodbye regex router', t => {
    const routes = [
        [/yes/i, () => 'no'],
        [/stop/i, () => 'go go go'],
        [/goodbye/i, () => 'hello'],
        [/high/i, () => 'low'],
        [/why/i, () => 'I don’t know']
    ];
    const router = createRouter(routes);
    t.is(router('hIGh'), 'low');
    t.is(router('cha cha cha'), null);
});

test('string → regex → callback → string: Echo function regex router.', t => {
    const routes = [
        [/.*/, matches => matches[0]]
    ];
    const router = createRouter(routes);
    t.is(router('cha cha cha'), 'cha cha cha');
});

test(
    'string → regex → callback → string: Regex router with matches and default answer.',
    t => {
        const routes = [
            [/yes/i, matches => `You say ${matches[0]}, I say no.`],
            [/stop/i, matches => `You say ${matches[0]}, I say go go go, oh no.`],
            [/high/i, matches => `I say ${matches[0]}, You say low.`],
            [/why/i, matches => `You say ${matches[0]} and I say I don’t know`],
            [/.*/, matches => `I dont know why you say ${matches[0]}, I say hello.`]
        ];
        const router = createRouter(routes);
        t.is(router('foobar HiGH'), 'I say HiGH, You say low.');
        t.is(router('cha cha cha'), 'I dont know why you say cha cha cha, I say hello.');
    }
);

test(
    'object → comparisonFunction → callback → string: Routes mapping function to function.',
    t => {
        const routes = [
            [
                payload => payload.intentName === 'yes',
                () => 'no'
            ],
            [
                payload => (payload.intentName === 'goodbye' && payload.score > 0.8),
                () => 'hello'
            ],
            [
                () => true,
                payload => `I dont know why you say ${payload.query}, I say hello.`
            ]
        ];
        const router = createRouter(routes);
        t.is(router({
            query: 'Good Bye mate!',
            intentName: 'goodbye',
            score: 0.9629247
        }), 'hello');
        t.is(router({
            query: 'cha cha cha'
        }), 'I dont know why you say cha cha cha, I say hello.');
    }
);

test(
    'comparisonFunction receiving extra arguments',
    t => {
        const routes = [
            [
                (payload, context) => (payload.intentName === 'yes' && context.foo === 'bar'),
                () => 'no'
            ],
            [
                () => true,
                payload => `I dont know why you say ${payload.query}, I say hello.`
            ]
        ];
        const context = {
            foo: 'bar'
        };
        const router = createRouter(routes);
        t.is(router({
            query: 'Yes',
            intentName: 'yes',
            score: 0.9629247
        }, context), 'no');
        t.is(router({
            query: 'cha cha cha'
        }), 'I dont know why you say cha cha cha, I say hello.');
    }
);

test(
    'pass extra parameters to the generated router and use them in the callback',
    t => {
        const routes = [[
            payload => payload.intentName === 'yes',
            (payload, context) => `You ${context.username} say ${payload.query}, I say no.`
        ], [
            () => true,
            (payload, context, foo) =>
                `I dont know why you, ${context.username}, say ${payload.query}, I say ${foo}.`
        ]];
        const router = createRouter(routes);
        t.is(
            router({
                query: 'Yes',
                intentName: 'yes',
                score: 0.9629247
            }, {
                username: 'George'
            }),
            'You George say Yes, I say no.'
        );
        t.is(router({ query: 'foobar' }, { username: 'George M.' }, 'hello'),
            'I dont know why you, George M., say foobar, I say hello.'
        );
    }
);
