#! /usr/bin/env node
const program = require('commander');
const generate = require('./generate.js');

console.log('asset-generator; use --help for options');

program
  .version(process.env.npm_package_version)
  .usage('[options] <file ...>')
  .option('-a, --android [path]', 'android path')
  .option('-i, --ios [path]', 'iOS Path')
  .option('-x, --scale [3|4]', 'input scale is @3x (iOS), xxhdpi (Android). Default to @4x, xxxhdpi.')
  .parse(process.argv);

generate(program.args, program.android, program.ios, program.scale);