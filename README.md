# my-crud-builder

A dynamic CRUD model generator using Mongoose.

## Installation

```bash
npm install my-crud-builder

Created by Azad Singh


//Pass the payload in this way to the crud-builder 
[
  {
    "name": "User",
    "fields": [
      { "name": { "type": "String", "required": true } },
      { "email": { "type": "String", "required": true, "unique": true } },
      { "age": { "type": "Number" } },
      { "createdAt": { "type": "Date", "default": "Date.now" } }
    ]
  },
  {
    "name": "Product",
    "fields": [
      { "title": { "type": "String", "required": true } },
      { "price": { "type": "Number", "required": true } },
      { "description": { "type": "String" } },
      { "inStock": { "type": "Boolean", "default": true } }
    ]
  }
]
