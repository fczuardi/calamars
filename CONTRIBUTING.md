# Contributing

The development environment of **calamars** is based on node, npm and
npm-scripts. We also rely on some environment variables for configuration.

After cloning the repository, install the dev dependencies with:

```sh
npm install
```

Then create a ```.env``` executable file on the root of the project based on
the sample:

```sh
cp .env-sample .env
```

And edit it to fill in the gaps.

## npm scripts

To get an overview of the configured npm scripts run:

```sh
npm run info
```

## code style

We use a javascript style guide based on the popular
[airbnb style guide][airbnb-style], with some minor changes, and this style
is enforced with an eslint config called [eslint-config-calamar][eslint-config-calamar],
to check your fork's code against this styles use:

```sh
npm run lint
```

## Test your contributions

If you are working on a patch, please test it with the existing tests by running

```sh
npm run test:dev
```

Or use the watch feature to keep them running while you work:

```sh
npm run test:watch
```

## Write new tests

If you feel like it, please write new tests to cover the functionalities
of your patch. We use [ava][ava] for testing, and [nyc][nyc] to check the
coverage.

You can build the coverage report and print it on screen with:

```sh
npm run coverage
```

Or if you want to have an html version to navigate it with your browser use:

```sh
npm run coverage:html
```


[airbnb-style]: https://github.com/airbnb/javascript
[eslint]: http://eslint.org/
[eslint-config-calamar]: https://www.npmjs.com/package/eslint-config-calamar
[ava]: https://github.com/sindresorhus/ava
[nyc]: https://github.com/bcoe/nyc
