# calamars

<a href="https://openclipart.org/detail/230920/remix-of-cartoon-red-planet"><img src="https://openclipart.org/download/230920/planet-remix.svg" width="100"/></a>

[![npm version](https://badge.fury.io/js/calamars.svg)](https://badge.fury.io/js/calamars)
[![Build Status](https://travis-ci.org/fczuardi/calamars.svg?branch=master)](https://travis-ci.org/fczuardi/calamars)
[![Dependency Status](https://david-dm.org/fczuardi/calamars.svg)](https://david-dm.org/fczuardi/calamars)
[![coveralls](https://coveralls.io/repos/github/fczuardi/calamars/badge.svg?branch=master)](https://coveralls.io/github/fczuardi/calamars?branch=master)
[see all badges…][badges]

An alpha quality, under heavy development, proto-frramework for building
chat applications.

## Install

```sh
npm install --save calamars
```

## Documentation

See the [Library Reference][documentation] for full documentation.

## Quickstart

### string → string

```javascript
import { createRouter } from 'calamars';
const routes = [
    ['yes', 'no'],
    ['stop', 'go go go'],
    ['goodbye', 'hello'],
    ['high', 'low'],
    ['why', 'I don’t know']
];
const router = createRouter(routes);

console.log(router('goodbye')); // hello
```

### string → callback → string

```javascript
import { createRouter } from 'calamars';
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

console.log(router('goodbye')); // hello
```

### echo any string input

```javascript
import { createRouter } from 'calamars';

const routes = [
    [/.*/, matches => matches[0]]
];
const router = createRouter(routes);

console.log(router('goodbye')); // goodbye
```

### string → LUIS → intentName → callback → string

```javascript
import { LuisDriver, createRouter } from 'calamars';

const luis = new LuisDriver(options);
const callback = () => 'go go go';
const routes = [
    ['goodbye', callback]
];
const router = createRouter(routes);

luis.query('Good Bye!')
    .then(({ topScoringIntent }) => {
        const intentName = topScoringIntent.intent;

        console.log(router(intentName)); // 'go go go'
    });
```


### More usage examples

  - [string → regex → string][regexString] - Using createRegexRouter
  - [string → regex → callback → string][regexCallbackString] - With matches and default answer using createRegexFunctionRouter
  - [object → comparisonFunction → callback → string][createPayloadFunctionRouter] - Using createPayloadFunctionRouter
  - [more][testfolder]

## Patches are welcome

If you want to help us improve this library with a fix, a feature, better
documentation or any other thing, please refer to the
[contributing guide][contributing].

[badges]: https://github.com/fczuardi/calamars/blob/master/badges.md
[regexString]: https://github.com/fczuardi/calamars/blob/master/test/router.js#L37-L48
[regexCallbackString]: https://github.com/fczuardi/calamars/blob/master/test/router.js#L70-L81
[createPayloadFunctionRouter]: https://github.com/fczuardi/calamars/blob/master/test/router.js#L107-L134
[testfolder]: https://github.com/fczuardi/calamars/blob/master/test/router.js
[documentation]: http://fczuardi.github.io/calamars/
[contributing]: https://github.com/fczuardi/calamars/blob/master/CONTRIBUTING.md
