#!/usr/bin/env node
const sed = require('shelljs').sed;
const ver = require('../package.json').version;
sed('-i', 'Calamars</', `Calamars ${ver}</`, 'docs/index.html');
