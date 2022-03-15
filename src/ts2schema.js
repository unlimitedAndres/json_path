const TJS = require('typescript-json-schema');
const Pointer = require('./lib/Pointer');
const { JSONPath } = require('jsonpath-plus');
const _ = require('underscore');
const { PROPERTIES, ALLOWED_CONSTRUCTS } = require("./lib/Constants");

module.exports = function (files) {
  const settings = (TJS.PartialArgs = {
    required: true
  });

  const compilerOptions = (TJS.CompilerOptions = {
    strictNullChecks: true
  });

  const program = TJS.getProgramFromFiles(files, compilerOptions);

  const schema = TJS.generateSchema(program, '*', settings);

  return convert(schema);
};

function convert(jsonSchema) {
  const schema = JSON.parse(JSON.stringify(jsonSchema));

  const result = JSONPath({
    path: "$..*[?(@property=='type')]@array()",
    json: schema,
    resultType: 'all'
  }).map((e) => Pointer.from(e.pointer));

  result.forEach((p) =>
    p.set(
      schema,
      ((p) => {
        const value = p.get(schema);
        const parentValue = p.parent.get(schema);
        // const construct = ALLOWED_CONSTRUCTS.includes(p.parent.parent.name) && _.isArray(p.parent.parent.get(schema));
        // if(!construct) {
        const movedProperties = [];
        const anyOf = value.map((t) => {
          const properties = {};
          (PROPERTIES[t] || []).forEach((prop) => {
            if (parentValue[prop] !== undefined) {
              properties[prop] = parentValue[prop];
              movedProperties.push(prop);
            }
          });
          return {
            type: t,
            ...properties
          };
        });
        movedProperties.forEach((k) => delete parentValue[k]);
        return anyOf;
        // } else {

        // }
      })(p)
    )
  );
  result.forEach((p) => {
    const construct =
      ALLOWED_CONSTRUCTS.includes(p.parent.parent.name) &&
      _.isArray(p.parent.parent.get(schema));
    const value = p.get(schema);
    if (!construct || p.parent.parent.name != 'anyOf') {
      const parentValue = p.parent.get(schema);
      delete parentValue[p.name];
      parentValue['anyOf'] = value;
    } else {
      const parentValue = p.parent.parent.get(schema);
      value.forEach((v) => parentValue.push(v));
      p.parent.remove(schema);
    }
  });
  // console.log(JSON.stringify(schema, null, ' '));
  return schema;
}
