// createRouter
// ------------
//
// Creates a router that maps inputs to outputs based on a set of routes.
//
// ### Syntax
// ```javascript
// createRouter(routes)
// ```
//
// #### Parameters
// **routes**: An array of routes
//
// ##### route
// Each route is a two-elements array in the format ```[compare(), callback()]```.
// The first element is the compare function ```compare```
// and the second is the associated callback function ```callback```.
//
// #### Return
// Returns a router function.
//
// ### Examples
//
// #### [string, value] routes
// ```javascript
// const routes = [
//     ['yes', 'no'],
//     ['stop', 'go go go'],
//     ['goodbye', 'hello'],
//     ['high', 'low'],
//     ['why', 'I don’t know']
// ];
// const router = createRouter(routes);
//
// console.log(router('high')); // 'low'
// console.log(router('cha cha cha')); // null
// ```
//
// #### [regExp, value] routes
// ```javascript
// const routes = [
//     [/yes/i, 'no'],
//     [/stop/i, 'go go go'],
//     [/goodbye/i, 'hello'],
//     [/high/i, 'low'],
//     [/why/i, 'I don’t know']
// ];
// const router = createRouter(routes);
//
// console.log(router('I say HIGH, you say?')); // 'low'
// console.log(router('cha cha cha')); // null
// ```
//
// #### [string, function] routes
// ```javascript
// const callbacks = {
//     yes() { return 'no'; },
//     halt() { return 'go go go'; },
//     goodbye() { return 'hello'; },
//     high() { return 'low'; },
//     why() { return 'I don’t know'; }
// };
// const routes = [
//     ['yes', callbacks.yes],
//     ['stop', callbacks.halt],
//     ['goodbye', callbacks.goodbye],
//     ['high', callbacks.high],
//     ['why', callbacks.why]
// ];
// const router = createRouter(routes);
//
// console.log(router('high')); // 'low'
// console.log(router('cha cha cha')); // null
// ```
//
// #### [function, function] routes
// ```javascript
// import { createRouter } from 'calamars';
// const input1 = {
//     query: 'Stop!',
//     intentName: 'stop',
//     score: 0.9629247
// };
// const input2 = {
//     query: 'Foobar',
//     intentName: 'None',
//     score: 0.546681643
// };
// const routes = [[
//     obj => obj.intentName === 'stop',
//     obj => `You say ${obj.query}, I say go go go, oh no.`
// ], [
//     obj => obj.intentName === 'None',
//     obj => `I dont know why you say ${obj.query}, I say hello.`
// ]];
//
// const router = createRouter(routes);
//
// console.log(router(input1)); // You say Stop!, I say go go go, oh no.
// console.log(router(input2)); // I dont know why you say Foobar, I say hello.
// ```
//
// See [test/router.js](https://github.com/fczuardi/calamars/blob/master/test/router.js) for more examples.
//
// ---
//
// ### Source
const createRouter = (routes, config = {}) => input => {
    if (!routes) { return null; }

    // The ```compare``` side of a ```[compare(), callback()]``` route
    // is normally a function. But it can also be a string or a regular
    // expression, and on those cases it will be treated as a shortcut
    // for exact match or ```RegExp.test``` respectively.
    const matchingRoutes = routes.filter(route => {
        const cmp = route[0];
        if (typeof cmp === 'function') {
            return cmp(input);
        }
        if (typeof cmp === 'string') {
            return cmp === input;
        }
        if (cmp instanceof RegExp) {
            return cmp.test(input);
        }
        return [null, null];
    });

    // if no route is matched, return null
    if (!matchingRoutes.length) { return null; }

    // first matched route
    const firstMatch = matchingRoutes[0];

    // if matched route is not a properly formatted route
    if (!firstMatch.length) { return null; }

    const [compare, callback] = firstMatch;

    // _Deprecated API to be removed after 0.7.0_
    if (config.deprecatedName) { return deprecatedResult(firstMatch, config, input); } // eslint-disable-line no-use-before-define, max-len

    // When the callback is a function, return the call
    // to the callback passing the input as argument
    if (typeof callback === 'function' && !(compare instanceof RegExp)) {
        return callback(input);
    }

    // Alternative usage. When the ```compare``` part of a route is a regular
    // expression, returns the call to the callback passing the matches as argument.
    if (compare instanceof RegExp && typeof callback === 'function') {
        const matches = compare.exec(input);
        return callback(matches);
    }

    // Alternative usage. When the ```callback``` part of a
    // ```[compare(), callback()]``` route is a value instead
    // of a function, return it
    return callback;
};

// ---

// ### Deprecated on 0.6.x
// The functions below will be removed after 0.7.0
const deprecatedResult = (route, config, input) => {
    console.warn(`${config.deprecatedName} will be deprecated, please use createRouter`);
    const [cmp, cb] = route;
    if (cmp instanceof RegExp && typeof cb === 'function') {
        if (config.deprecatedName === 'createRegexRouter') {
            return cb;
        }
        if (config.deprecatedName === 'createRegexFunctionRouter') {
            return cb(cmp.exec(input));
        }
    }
    return cb;
};
const createExactMatchRouter = routes => createRouter(routes,
    { deprecatedName: 'createExactMatchRouter' }
);

const createRegexRouter = routes => createRouter(routes,
    { deprecatedName: 'createRegexRouter' }
);

const createRegexFunctionRouter = routes => createRouter(routes,
    { deprecatedName: 'createRegexFunctionRouter' }
);

// ---

export {
    createRouter,
    createExactMatchRouter,
    createRegexRouter,
    createRegexFunctionRouter
};
