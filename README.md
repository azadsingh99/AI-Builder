# mongodb-crud-builder

A Node.js generator that turns compact model definitions into ready-to-run Express + Mongoose CRUD APIs.

## Install
```bash
npm install mongodb-crud-builder
```

## Run
```bash
npm start
```

POST model definitions to `/crud-builder`. Example:
```json
{
  "options": {
    "timestamps": true,
    "softDelete": true
  },
  "modelData": [
    {
      "name": "User",
      "fields": [
        {
          "name": {
            "type": "string",
            "required": true,
            "index": true
          }
        },
        {
          "email": {
            "type": "string",
            "required": true,
            "unique": true
          }
        },
        {
          "age": {
            "type": "number",
            "min": 0
          }
        },
        {
          "active": {
            "type": "boolean",
            "default": true
          }
        },
        {
          "tags": {
            "type": "array",
            "itemType": "string"
          }
        }
      ]
    }
  ]
}
```

## Supported schema types
`string`, `number`, `boolean`, `date`, `objectid`, `mixed`, and `array`.

Field options include `required`, `unique`, `index`, `default`, `enum`, `min`, `max`, `minLength`, and `maxLength`.

## Generated API
POST `/User`
GET `/User?page=1&limit=20&sort=-createdAt`
GET `/User/:id`
PATCH `/User/:id`
DELETE `/User/:id`

GET supports pagination, filtering, sorting and case-insensitive search on string fields.
With `softDelete: true`, DELETE sets `deletedAt` and PATCH `/User/:id/restore` is generated.

## Configuration
`PORT` controls the generator API port (default 3001). `PUBLIC_BASE_URL` controls ZIP download URLs. Generated projects use `MONGODB_URI`.

## Development
```bash
npm test
```

## License
MIT
