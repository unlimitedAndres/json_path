const resolve = require('path').resolve;

const TJS = require('typescript-json-schema');
//import * as TJS from "typescript-json-schema";

const settings = (TJS.PartialArgs = {
  required: true
});

const compilerOptions = (TJS.CompilerOptions = {
  strictNullChecks: true
});

const basePath = './src';

const program = TJS.getProgramFromFiles(
  [resolve('test.ts')],
  compilerOptions,
  basePath
);

const schema = TJS.generateSchema(program, '*', settings);

console.log(JSON.stringify(schema, null, " "));

module.exports = {
    schema
};