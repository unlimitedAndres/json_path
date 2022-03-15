const { JSONPath } = require('jsonpath-plus');
const pointer = require('json-pointer');
const _ = require('underscore');
const fs = require('fs');
const { json } = require('stream/consumers');
const { object } = require('underscore');
const resolve = require('path').resolve;

class JsonSchemaToOpenApi {
  constructor() {
    this.convObject = null;
    this.newTypeObject = null;
    this.schema = null;
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

    // Generar archivo .json
    // this.createFile();

    // // validar los atributos de properties
    // this.validateProperties();

    // 
    const result = this.convert(require('./json.json'));
    console.log(JSON.stringify(result, null, ' '));
    // 
    this.purgeObject(result);
  }

  createFile() {
    const TJS = require('typescript-json-schema');
    //import * as TJS from "typescript-json-schema";

    const settings = (TJS.PartialArgs = {
      required: true
    });

    const compilerOptions = (TJS.CompilerOptions = {
      strictNullChecks: true
    });

    const program = TJS.getProgramFromFiles(
      [resolve('test.ts')],
      compilerOptions
    );

    const schema = TJS.generateSchema(program, '*', settings);

    fs.writeFileSync('./json.json', JSON.stringify(schema, null, ' '));
  }

  purgeObject(schema) {
    const allPaths = [
      // '$.definitions[?(@.type)]',
      '$.definitions[?(@.type)]..properties[?(@.anyOf)].anyOf',
      '$.definitions[?(@.type)]..properties[?(@.type || @.anyOf)]',
      "$.definitions[?(@.type)]..properties[?(['integer','number','boolean','string','object','array'].includes(@.type))]",
      "$.definitions[?(@.type)]..properties[?(@.anyOf)].anyOf[?(['integer','number','boolean','string','object','array'].includes(@.type))]",
      "$.definitions[?(@.type)]..properties[?(@.anyOf)].anyOf[?(['integer','number','boolean','string','object','array'].includes(@.type))].type"
    ];
    const validPaths = [];
    validPaths.push(
      '$.definitions[?(@.type)]..properties[?(@.type || @.anyOf)]',
      '$.definitions[?(@.type)]..properties[?(@.type || @.anyOf)].title',
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
    );
    for (const property in this.properties) {
      this.properties[property].forEach((e) => {
        validPaths.push(
          `$.definitions[?(@.type)]..properties[?(['${property}'].includes(@.type))].${e}`
        );
        validPaths.push(
          `$.definitions[?(@.type)]..properties[?(@.anyOf)].anyOf[?(['${property}'].includes(@.type))].${e}`
        );
      });
    }
    
    // console.log(JSON.stringify(schema, null, ' '));
    // console.log(validPaths);
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
    console.log(values);
    console.log(allValues);

    allValues.forEach((e) => {
      if (!values.includes(e)) {
        pointer.remove(schema, e);
      }
    });
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
    // console.log(JSON.stringify(schema, null, ' '));
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
    // console.log('this.string() -> ', this.toString());
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

// const converter = new JsonSchemaToOpenApi();
// const result = converter.convert(require('./json.json'));
// const result2 = converter.purgeObject(result);

// console.log(JSON.stringify(result, null, ' '));
