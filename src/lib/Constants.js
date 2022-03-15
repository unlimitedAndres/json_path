const { Module } = require('module');

module.exports.ALLOWED_CONSTRUCTS = ['not', 'allOf', 'oneOf', 'anyOf'];

module.exports.PROPERTIES = {
  // 'required', 'properties', 'readOnly','format','writeOnly',
  string: ['minLength', 'maxLength', 'format'],
  number: [
    'multipleOf',
    'exclusiveMaximum',
    'exclusiveMinimum',
    'maximum',
    'minimum'
  ],
  integer: [
    'multipleOf',
    'exclusiveMaximum',
    'exclusiveMinimum',
    'maximum',
    'minimum'
  ],
  array: ['uniqueItems', 'maxItems', 'minItems', 'items'],
  object: ['maxProperties', 'minProperties', 'additionalProperties']
};

module.exports.VALID_CONSTRAINT_KEYWORDS = [
  'not',
  'enum',
  'type',
  'items',
  'allOf',
  'oneOf',
  'anyOf',
  'title',
  'format',
  'default',
  'minimum',
  'maximum',
  'pattern',
  'required',
  'minItems',
  'maxItems',
  'minLength',
  'maxLength',
  'properties',
  'multipleOf',
  'uniqueItems',
  'description',
  'minProperties',
  'maxProperties',
  'exclusiveMinimum',
  'exclusiveMaximum',
  'additionalProperties'
];

module.exports.VALID_OBJECT_KEYWORD = [
  'type',
  'items',
  'title',
  'format',
  'pattern',
  'required',
  'properties',
  'description',
  'additionalProperties',
  'minProperties',
  'maxProperties'
];
