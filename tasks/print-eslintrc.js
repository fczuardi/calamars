#!/usr/bin/env node
const eslintrc = require('eslint-config-calamar');
eslintrc.rules['import/no-unresolved'] = 0;
console.log(JSON.stringify(eslintrc, ' ', 2));
