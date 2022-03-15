const resolve = require('path').resolve;
const ts2schema = require("../src/ts2schema");

const file = resolve('test.ts');
const schema = ts2schema([file]);
console.log(JSON.stringify(schema, null, 2));