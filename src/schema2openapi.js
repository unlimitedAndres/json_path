const { JSONPath } = require('jsonpath-plus');
const pointer = require('json-pointer');
const { PROPERTIES } = require('./lib/Constants');
require('colors');

module.exports = function (schema) {
  const allPaths = [
    '$.definitions.*',
    '$.definitions[?(@.type)]..properties[?(@.anyOf)].anyOf',
    '$.definitions[?(@.type)]..properties[?(@.type || @.anyOf)]',
    '$.definitions[?(@.type)]..properties[?(@.type || @.anyOf)].*',
    '$.definitions[?(@.type)]..properties[?(@.type)]',
    '$.definitions[?(@.type)]..properties[?(@.anyOf)].anyOf[?(@.type)]',
    '$.definitions[?(@.type)]..properties[?(@.anyOf)].anyOf[?(@.type)].type',
    '$.definitions[?(@.type)]..properties[?(@.anyOf)].anyOf[?(@.type)].*'
  ];
  const validPaths = [
    '$.definitions[?(@.type)]',
    '$.definitions[?(@.type)]..properties[?(@.type || @.anyOf)]',
    '$.definitions[?(@.type)]..properties[?(@.type || @.anyOf)].title',
    '$.definitions[?(@.type)]..properties[?(@.type || @.anyOf)].description',
    '$.definitions[?(@.type)]..properties[?(@.type || @.anyOf)].description',
    "$.definitions[?(@.type)]..properties[?(['integer','number','boolean','string','object','array'].includes(@.type))]",
    "$.definitions[?(@.type)]..properties[?(['integer','number','boolean','string','object','array'].includes(@.type))].type",
    '$.definitions[?(@.type)]..properties[?(@.anyOf)].anyOf',
    "$.definitions[?(@.type)]..properties[?(@.anyOf)].anyOf[?(['integer','number','boolean','string','object','array'].includes(@.type))]",
    "$.definitions[?(@.type)]..properties[?(@.anyOf)].anyOf[?(['integer','number','boolean','string','object','array'].includes(@.type))].type"
    // "$.definitions[?(@.type)]..properties[?(['integer','number','boolean','string','object','array'].includes(@.type))].readOnly",
    // "$.definitions[?(@.type)]..properties[?(['integer','number','boolean','string','object','array'].includes(@.type))].format",
    // "$.definitions[?(@.type)]..properties[?(['integer','number','boolean','string','object','array'].includes(@.type))].writeOnly",
    // "$.definitions[?(@.type)]..properties[?(@.anyOf)].anyOf[?(['integer','number','boolean','string','object','array'].includes(@.type))].readOnly",
    // "$.definitions[?(@.type)]..properties[?(@.anyOf)].anyOf[?(['integer','number','boolean','string','object','array'].includes(@.type))].format",
    // "$.definitions[?(@.type)]..properties[?(@.anyOf)].anyOf[?(['integer','number','boolean','string','object','array'].includes(@.type))].writeOnly"
  ];
  for (const property in PROPERTIES) {
    PROPERTIES[property].forEach((e) => {
      validPaths.push(
        `$.definitions[?(@.type)]..properties[?(['${property}'].includes(@.type))].${e}`
      );
      validPaths.push(
        `$.definitions[?(@.type)]..properties[?(@.anyOf)].anyOf[?(['${property}'].includes(@.type))].${e}`
      );
    });
  }

  const values = [];
  validPaths.forEach((e) => {
    const valid = JSONPath({
      path: e,
      json: schema,
      resultType: 'pointer'
    });
    if (valid.length) {
      valid.forEach((p) => {
        !values.includes(p) ? values.push(p) : false;
      });
    }
  });

  const allValues = [];
  allPaths.forEach((e) => {
    const validPaths = JSONPath({
      path: e,
      json: schema,
      resultType: 'pointer'
    });
    if (validPaths.length) {
      validPaths.forEach((p) => {
        !allValues.includes(p) ? allValues.push(p) : false;
      });
    }
  });
  // console.error([...values], [...allValues]);
  // console.log(JSON.stringify(schema, null, 2));

  allValues.forEach((e) => {
    if (!values.includes(e)) {
      try {
        console.log(e.red);
        pointer.remove(schema, e);
      } catch (error) {
        console.log('Already deleted'.blue);
      }
    }
  });
  console.log('\n----------------------------------------\n');

  // console.log( schema['definitions']['Node']['properties']['userId2']['anyOf'][2] );
  return schema['definitions'];
};
