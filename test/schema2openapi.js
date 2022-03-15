const resolve = require('path').resolve;
const ts2schema = require('../src/ts2schema');
const schema2openapi = require('../src/schema2openapi');
const { type } = require('os');

const validSchema = {
  Root: {
    type: 'object',
    properties: {
      userId: {
        description: 'The size of the shape.',
        anyOf: [
          {
            type: 'integer',
            minimum: 0
          },
          {
            type: 'string'
          }
        ]
      },
      id: {
        type: 'number'
      },
      title: {
        type: 'string'
      },
      completed: {
        type: 'boolean'
      },
      node: {
        anyOf: [
          {
            $ref: '#/definitions/Node'
          },
          {
            type: 'string'
          },
          {
            type: 'boolean'
          }
        ]
      },
      myarray: {
        anyOf: [
          {
            type: 'array',
            items: {
              type: 'string'
            }
          },
          {
            type: 'array',
            items: {
              type: 'boolean'
            }
          },
          {
            type: 'string'
          }
        ]
      }
    },
    required: ['completed', 'id', 'myarray', 'node', 'title', 'userId']
  },
  Node: {
    type: 'object',
    properties: {
      userId2: {
        description: 'The size of the shape.',
        anyOf: [
          {
            type: 'integer',
            minimum: 0
          },
          {
            type: 'string'
          }
        ]
      },
      id2: {
        type: 'number'
      },
      title2: {
        type: 'string'
      },
      completed2: {
        type: 'boolean'
      }
    },
    required: ['completed2', 'id2', 'title2', 'userId2']
  }
};

const schema1 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  definitions: {
    Root: {
      type: 'object',
      properties: {
        userId: {
          description: 'The size of the shape.',
          anyOf: [
            {
              type: 'integer',
              minimum: 0
            },
            {
              type: 'string'
            }
          ]
        },
        id: {
          type: 'number'
        },
        title: {
          type: 'string'
        },
        completed: {
          type: 'boolean',
          usage: 'Development'
        },
        node: {
          anyOf: [
            {
              $ref: '#/definitions/Node'
            },
            {
              type: 'string'
            },
            {
              type: 'boolean'
            }
          ]
        },
        myarray: {
          anyOf: [
            {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            {
              type: 'array',
              items: {
                type: 'boolean'
              }
            },
            {
              type: 'string'
            }
          ]
        }
      },
      required: ['completed', 'id', 'myarray', 'node', 'title', 'userId']
    },
    Node: {
      type: 'object',
      properties: {
        userId2: {
          description: 'The size of the shape.',
          anyOf: [
            {
              type: 'integer',
              minimum: 0
            },
            {
              type: 'string'
            },
            {
              type: 'yesyesyes'
            }
          ]
        },
        id2: {
          type: 'number'
        },
        title2: {
          type: 'string'
        },
        completed2: {
          type: 'boolean'
        }
      },
      required: ['completed2', 'id2', 'title2', 'userId2']
    }
  }
};

const schema2 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  definitions: {
    Root: {
      type: 'object',
      properties: {
        userId: {
          description: 'The size of the shape.',
          anyOf: [
            {
              type: 'integer',
              minimum: 0
            },
            {
              type: 'string'
            }
          ]
        },
        id: {
          type: 'number'
        },
        title: {
          type: 'string'
        },
        completed: {
          type: 'boolean',
        },
        node: {
          anyOf: [
            {
              $ref: '#/definitions/Node'
            },
            {
              type: 'string'
            },
            {
              type: 'boolean'
            }
          ]
        },
        myarray: {
          anyOf: [
            {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            {
              type: 'array',
              items: {
                type: 'boolean'
              }
            },
            {
              type: 'string'
            }
          ]
        }
      },
      required: ['completed', 'id', 'myarray', 'node', 'title', 'userId']
    },
    Node: {
      type: 'object',
      properties: {
        userId2: {
          description: 'The size of the shape.',
          anyOf: [
            {
              type: 'integer',
              minimum: 0
            },
            {
              type: 'string'
            },
          ]
        },
        id2: {
          type: 'number'
        },
        title2: {
          type: 'string'
        },
        completed2: {
          type: 'boolean'
        }
      },
      required: ['completed2', 'id2', 'title2', 'userId2']
    },
    Andres: {
      Nombre: 'Andres',
      Direccion: 'Cra 123',
      telefono: '321'
    }
  }
};

const file = resolve('test.ts');
let schema = ts2schema([file]);

proccessedSchema1 = schema2openapi(schema1);
proccessedSchema2 = schema2openapi(schema2);
// schema = schema2openapi( schema1 );

// console.log(JSON.stringify(schema1, null, 2));
console.log(
  JSON.stringify(validSchema, null, 2) === JSON.stringify(proccessedSchema1, null, 2)
);

// console.log(JSON.stringify(schema2, null, 2));
console.log(
  JSON.stringify(validSchema, null, 2) === JSON.stringify(proccessedSchema2, null, 2)
);
