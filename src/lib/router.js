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
// ### Example
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
        return [null, () => null];
    });

    // if no route is matched, return null
    if (!matchingRoutes.length) { return null; }

    // first matched route
    const [compare, callback] = matchingRoutes[0];

    // Expected usage, both elements of a route are functions. When that is the
    // case, returns the call to the callback passing the input as argument.
    if (typeof compare === 'function' && typeof callback === 'function') {
        return callback(input);
    }

    // Alternative usage, the ```compare``` part of a route can be a regular
    // expression. When that is the case, returns the call to the callback
    // passing the matches as argument.
    if (compare instanceof RegExp && typeof callback === 'function') {
        const matches = compare.exec(input);
        if (config === {}) {
            return callback(matches);
        }

        // Deprecated uses to be removed after 0.7.0
        if (config.deprecatedName === 'createRegexRouter') {
            console.warn('createRegexRouter will be deprecated, please use createRouter');
            return callback;
        }
        if (config.deprecatedName === 'createRegexFunctionRouter') {
            console.warn('createRegexFunctionRouter will be deprecated, please use createRouter');
            return callback(matches);
        }
    }

    // Alternative usage, the ```callback``` part of
    // ```[compare(), callback()]``` route can be a a value instead of a
    // function. When that is the case, returns it
    return callback;
};

// ---

// ### Deprecated on 0.6.x
// The functions below will be removed after 0.7.0
const createExactMatchRouter = routes => {
    console.warn('createExactMatchRouter will be deprecated, please use createRouter');
    return createRouter(routes);
};

const createRegexRouter = routes => createRouter(routes,
    { deprecatedName: 'createRegexRouter' }
);

const createRegexFunctionRouter = routes => createRouter(routes,
    { deprecatedName: 'createRegexFunctionRouter' }
);
// ---
export {
    createExactMatchRouter,
    createRegexRouter,
    createRegexFunctionRouter,
    createRouter
};
