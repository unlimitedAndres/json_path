const { JSONPath } = require('jsonpath-plus');
const pointer = require('json-pointer');
const _ = require('underscore');

class JsonSchemaToOpenApi {
  constructor() {
    this.convObject = null;
    this.newTypeObject = null;
    this.allowedContructs = ['not', 'allOf', 'oneOf', 'anyOf'];
    this.validConstraintKeywords = [
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
    this.validObjectKeyword = [
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
    this.properties = {
      string: ['minLength', 'maxLength', 'required', 'format'],
      number: [
        'multipleOf',
        'exclusiveMaximum',
        'exclusiveMinimum',
        'maximum',
        'minimum',
        'required'
      ],
      integer: [
        'multipleOf',
        'exclusiveMaximum',
        'exclusiveMinimum',
        'maximum',
        'minimum',
        'required'
      ]
    };

    // // validar los atributos del objeto
    // this.purgeObject();

    // // validar los atributos de properties
    // this.validateProperties();
  }

  purgeObject() {
    const values = [];
    const all = JSONPath({
      path: `$..*`,
      json: schema,
      resultType: 'all'
    });

    validKeywords.forEach((e) => {
      const valid = JSONPath({
        path: `$..${e}.*`,
        json: schema,
        resultType: 'all'
      });
      if (valid.length) {
        valid.forEach((e) => {
          !values.includes(e.pointer) ? values.push(e.pointer) : false;
        });
      }
      values.reverse();

      console.log(values);
    });
    console.log(schema);
  }

  convert(jsonSchema) {
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
          // const construct = this.allowedContructs.includes(p.parent.parent.name) && _.isArray(p.parent.parent.get(schema));
          // if(!construct) {
          const movedProperties = [];
          const anyOf = value.map((t) => {
            const properties = {};
            (this.properties[t] || []).forEach((prop) => {
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
        this.allowedContructs.includes(p.parent.parent.name) &&
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
    return schema;
  }
}

class Pointer {
  constructor(parent, name) {
    this.parent = parent;
    this.name = name;
  }

  toString() {
    let s = '/' + this.name;
    if (this.parent) s = this.parent.toString() + s;
    return s;
  }

  get(obj) {
    // Looks up a JSON pointer in an object.
    return pointer.get(obj, this.toString());
  }

  set(obj, value) {
    // Sets a new value on object at the location described by pointer.
    console.log('this.string() -> ', this.toString());
    pointer.set(obj, this.toString(), value);
  }

  remove(obj) {
    pointer.remove(obj, this.toString());
  }

  static from(path) {
    const paths = path.split('/').filter((e) => e.length);
    const pointers = [];
    paths.forEach((e, i) =>
      pointers.push(new Pointer(i > 0 ? pointers[i - 1] : false, e))
    );
    return pointers.pop();
  }
}

const converter = new JsonSchemaToOpenApi();
const result = converter.convert(require('./test.json'));

console.log(JSON.stringify(result, null, ' '));
