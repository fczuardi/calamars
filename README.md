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

## Overview

Calamars is a toolset of different libs that helps on common tasks of
a conversational application development, such as:
- bot daemon setup
- question/answer routing
- interaction with cloud-based natural language
message parsers (LUIS, wit.ai).

Below are some usage examples of the different pieces of the calamars framework.
For more use cases check the [documentation][documentation] or the
[test folder][testfolder].

### Facebook Messenger Bot Wrapper

#### basic echo bot
```javascript
const FacebookMessengerBot = require('calamars').FacebookMessengerBot;

const myPageToken = 'EAASxZBKlWU...SwZDZD';
const myVerifyToken = 'RMHFOBtOd...X91LBu';
const myCallbackPath = '/webhook';
const myPort = 9091;

const myMessageListener = function(updateEvent){
    console.log('received message:', updateEvent.update.message.text);
    // reply with the same received message
    updateEvent.bot.sendMessage({
        userId: updateEvent.update.sender.id,
        text: updateEvent.update.message.text
    })
};

const mybot = new FacebookMessengerBot({
    port: myPort,
    callbackPath: myCallbackPath,
    verifyToken: myVerifyToken,
    pageTokens: [myPageToken],
    listeners: {
        onMessage: myMessageListener
    }
});

mybot.launchPromise.then(function(){
    console.log(`server is running on port ${myPort}`);
})
```

Check the [Tutorial][echobottutorial] for a detailed guide of how to set up
a Facebook App, a Facebook Page and how to install and run the example above.

For details on the available methods and implementation please refer to the [FacebookMessengerBot][fbbotclass] class.

### Chat replies Routing

#### string → string

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

#### string → callback → string

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

#### echo any string input

```javascript
import { createRouter } from 'calamars';

const routes = [
    [/.*/, matches => matches[0]]
];
const router = createRouter(routes);

console.log(router('goodbye')); // goodbye
```

#### string → LUIS → intentName → callback → string

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


#### More usage examples

  - [string → regex → string][regexString] - Using createRegexRouter
  - [string → regex → callback → string][regexCallbackString] - With matches and default answer using createRegexFunctionRouter
  - [object → comparisonFunction → callback → string][createPayloadFunctionRouter] - Using createPayloadFunctionRouter
  - [more][routertests]

## Patches are welcome

If you want to help us improve this library with a fix, a feature, better
documentation or any other thing, please refer to the
[contributing guide][contributing].

## Showcase

Who is using calamars in the real world:

- [Calamarcopollo][pollo]: an open-source Telegram/Facebook Messenger bot that searches
for brazilian intercity bus schedules and tickets using natural language
(powered by wit.ai and clickbus api).

If you are using it or know of someone else using it please let us know, open a
pull request expanding this list, or file an issue :)

[badges]: https://github.com/fczuardi/calamars/blob/master/badges.md
[documentation]: http://fczuardi.github.io/calamars/
[testfolder]: https://github.com/fczuardi/calamars/tree/master/test
[echobottutorial]: https://github.com/fczuardi/fbbotexample
[fbbotclass]: http://fczuardi.github.io/calamars/facebook.html
[routertests]: https://github.com/fczuardi/calamars/blob/master/test/router.js
[regexString]: https://github.com/fczuardi/calamars/blob/master/test/router.js#L37-L48
[regexCallbackString]: https://github.com/fczuardi/calamars/blob/master/test/router.js#L70-L81
[createPayloadFunctionRouter]: https://github.com/fczuardi/calamars/blob/master/test/router.js#L107-L134
[contributing]: https://github.com/fczuardi/calamars/blob/master/CONTRIBUTING.md
[pollo]: https://github.com/fczuardi/calamarcopollo
