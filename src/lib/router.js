// createRouter
// ------------
//
// A higher-order function that creates router function that maps inputs
// to outputs based on a set of routes.
//
// ### Syntax
// ```javascript
// createRouter(routes)
// ```
//
// #### Parameters
// **routes** - _Array_ - A list of routes. A route is a two-elements array
// representing a input/output mapping (see below).
//
// **route** - _Array_ - A pair of elements that represents a mapping
// between a compare function (or _string_ or _RegExp_) and an output function
// (or a value).
//
// ```[compare, output]```
//
// #### Return
// Returns a _function_. The returned function expects the first parameter
// to be the input object or string that is used for routing to the correct
// callback. All the parameters (the frist one, input, and any others) are
// forwarded to the callback. This can be useful for passing context to the
// callbacks or any extra data.
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
//
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
// const extraParam = 'hello.';
//
// const routes = [[
//     obj => obj.intentName === 'stop',
//     obj => `You say ${obj.query}, I say go go go, oh no.`
// ], [
//     obj => obj.intentName === 'None',
//     (obj, extra) => `I dont know why you say ${obj.query}, I say ${extra}`
// ]];
//
// const router = createRouter(routes);
//
// console.log(router(input1)); // You say Stop!, I say go go go, oh no.
// console.log(router(input2, extraParam)); // I dont know why you say Foobar, I say hello.
// ```
//
// See [test/router.js](https://github.com/fczuardi/calamars/blob/master/test/router.js) for more examples.
//
// ---
//
// ### Source
const createRouter = routes => (input, ...other) => {
    if (!routes) { return null; }

    // The ```compare``` side of a ```[compare(), callback()]``` route
    // is normally a function. But it can also be a string or a regular
    // expression, and on those cases it will be treated as a shortcut
    // for exact match or ```RegExp.test``` respectively.
    const matchingRoutes = routes.filter(route => {
        const cmp = route[0];
        if (typeof cmp === 'function') {
            return cmp(input, ...other);
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

    // When the callback is a function, return the call
    // to that callback passing the input as argument and any other arguments
    // used on the router() call
    if (typeof callback === 'function' && !(compare instanceof RegExp)) {
        return callback(input, ...other);
    }

    // Alternative usage. When the ```compare``` part of a route is a regular
    // expression, returns the call to the callback passing the matches as
    // first argument and any other extra arguments after that.
    if (compare instanceof RegExp && typeof callback === 'function') {
        const matches = compare.exec(input);
        return callback(matches, ...other);
    }

    // Alternative usage. When the ```callback``` part of a
    // ```[compare(), callback()]``` route is a value instead
    // of a function, return it
    return callback;
};

// ---

export {
    createRouter
};
