# calamars

[![npm version](https://badge.fury.io/js/calamars.svg)](https://badge.fury.io/js/calamars)
[![Build Status](https://travis-ci.org/fczuardi/calamars.svg?branch=master)](https://travis-ci.org/fczuardi/calamars)
[![Dependency Status](https://david-dm.org/fczuardi/calamars.svg)](https://david-dm.org/fczuardi/calamars)
[![coveralls](https://coveralls.io/repos/github/fczuardi/calamars/badge.svg?branch=master)](https://coveralls.io/github/fczuardi/calamars?branch=master)
[see all badges…][badges]

An alpha quality, under heavy development, proto-frramework for building
chat applications.

## Usage

```sh
npm install --save calamars
```

### createExactMatchRouter to create a string -> string map

```javascript
import { createExactMatchRouter } from 'calamars';
const pairs = [
    ['yes', 'no'],
    ['stop', 'go go go'],
    ['goodbye', 'hello'],
    ['high', 'low'],
    ['why', 'I don’t know']
];
const router = createExactMatchRouter(pairs);

console.log(router('goodbye')); // hello
```

### createExactMatchRouter to create a string -> callback -> string map

```javascript
import { createExactMatchRouter } from 'calamars';
const callbacks = {
    yes() { return 'no'; },
    halt() { return 'go go go'; },
    goodbye() { return 'hello'; },
    high() { return 'low'; },
    why() { return 'I don’t know'; }
};
const pairs = [
    ['yes', callbacks.yes],
    ['stop', callbacks.halt],
    ['goodbye', callbacks.goodbye],
    ['high', callbacks.high],
    ['why', callbacks.why]
];
const router = createExactMatchRouter(pairs);

console.log(router('goodbye')()); // hello
```

### createRegexFunctionRouter to echo all messages:

```javascript
import { createRegexFunctionRouter } from 'calamars';

const regexMap = [
    [/(.*)/, matches => matches[0]]
];
const router = createRegexFunctionRouter(regexMap);

console.log(router('goodbye')()); // goodbye
```

### More usage examples

  - [string -> regex -> string][regexString] - Using createRegexRouter
  - [string -> regex -> callback -> string][regexCallbackString] - With matches and default answer using createRegexFunctionRouter
  - [more][testfolder]

string -> LUIS -> intentName -> callback

```javascript
// TBD
```

chatSession -> string -> LUIS -> intentName -> callback -> chatSession

```javascript
// TBD
```

## Patches are welcome

If you want to help us improve this library with a fix, a feature, better
documentation or any other thing, please refer to the
[contributing guide][contributing].

[badges]: https://github.com/fczuardi/calamars/blob/master/badges.md
[regexString]: https://github.com/fczuardi/calamars/blob/master/test/answers.js#L21-L32
[regexCallbackString]: https://github.com/fczuardi/calamars/blob/master/test/answers.js#L75-L89
[testfolder]: https://github.com/fczuardi/calamars/blob/master/test/answers.js
[contributing]: https://github.com/fczuardi/calamars/blob/master/CONTRIBUTING.md
