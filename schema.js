module.exports = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "definitions": {
        "Node": {
            "properties": {
                "completed2": {
                    "type": "boolean"
                },
                "id2": {
                    "type": "number"
                },
                "title2": {
                    "type": "string"
                },
                "userId2": {
                    "description": "The size of the shape.",
                    "minimum": 0,
                    "required": true,
                    "type": [
                        "integer",
                        "string"
                    ]
                }
            },
            "type": "object"
        }
    },
    "properties": {
        "completed": {
            "type": "boolean"
        },
        "id": {
            "type": "number"
        },
        "node": {
            "anyOf": [
                {
                    "$ref": "#/definitions/Node"
                },
                {
                    "required": true,
                    "type": [
                        "string",
                        "boolean"
                    ]
                }
            ]
        },
        "title": {
            "type": "string"
        },
        "userId": {
            "description": "The size of the shape.",
            "minimum": 0,
            "type": [
                "integer",
                "string"
            ]
        }
    },
    "type": "object"
}

 