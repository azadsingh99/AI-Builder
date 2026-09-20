# mongodb-crud-builder

A Node.js generator that converts compact model definitions into ready-to-run Express + Mongoose REST APIs.

## Features

- Express + Mongoose CRUD generation
- Multiple models in one request
- Schema validation and common Mongoose field options
- Pagination, filtering, sorting and search
- Optional timestamps
- Optional soft delete and restore
- Complete generated project ZIP
- Health-check endpoint
- Node.js 18+ support

## Installation

```bash
npm install mongodb-crud-builder
```

## Quick Start

Start the generator:

```bash
npm start
```

Default URL:

```
http://localhost:3001
```

Health check:

```
GET /health
```

Generate an API:

```
POST /crud-builder
```

Example request:

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

Example cURL:

```bash
curl -X POST http://localhost:3001/crud-builder \
  -H "Content-Type: application/json" \
  -d '{"modelData":[{"name":"User","fields":[{"name":{"type":"string","required":true}},{"email":{"type":"string","unique":true}}]}]}'
```

Response:

```json
{
  "success": true,
  "message": "CRUD project generated successfully",
  "models": ["User"],
  "downloadUrl": "http://localhost:3001/public/zip/crudFolders.zip"
}
```

## Generated API

For a model named `User`:

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/User` | Create |
| GET | `/User` | List |
| GET | `/User/:id` | Get by ID |
| PATCH | `/User/:id` | Update |
| DELETE | `/User/:id` | Delete |

With `softDelete: true`:

| Method | Endpoint | Purpose |
|---|---|---|
| PATCH | `/User/:id/restore` | Restore deleted record |

## Query Features

Pagination:

```
GET /User?page=1&limit=20
```

Sorting:

```
GET /User?sort=-createdAt
```

Filtering:

```
GET /User?active=true&role=admin
```

Search:

```
GET /User?search=azad
```

Search is case-insensitive and uses the model's string fields.

## Supported Schema Types

- `string`
- `number`
- `boolean`
- `date`
- `objectid`
- `mixed`
- `array`

Supported field options:

- `required`
- `unique`
- `index`
- `default`
- `enum`
- `min`
- `max`
- `minLength`
- `maxLength`

Example:

```json
{
  "price": {
    "type": "number",
    "required": true,
    "min": 0
  }
}
```

## Multiple Models

Multiple models can be generated in a single request:

```json
{
  "modelData": [
    {
      "name": "User",
      "fields": [
        { "name": { "type": "string", "required": true } }
      ]
    },
    {
      "name": "Product",
      "fields": [
        { "title": { "type": "string", "required": true } },
        { "price": { "type": "number", "min": 0 } }
      ]
    }
  ]
}
```

## Timestamps

Timestamps are enabled by default:

```json
{
  "options": {
    "timestamps": true
  }
}
```

This adds `createdAt` and `updatedAt`.

Disable them with:

```json
{
  "options": {
    "timestamps": false
  }
}
```

## Soft Delete

Enable soft delete with:

```json
{
  "options": {
    "softDelete": true
  }
}
```

DELETE then sets `deletedAt` instead of permanently removing the record. A restore endpoint is generated automatically.

## Environment Variables

Generator server:

```env
PORT=3001
PUBLIC_BASE_URL=http://localhost:3001
```

Generated project:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/my_database
PORT=3000
```

## Generated Project Structure

```
crudFolders/
├── controller/
│   └── UserController.js
├── model/
│   └── User.js
├── route/
│   └── UserRoute.js
├── db.js
├── index.js
└── .env.example
```

## Development

```bash
git clone https://github.com/azadsingh99/AI-Builder.git
cd AI-Builder
npm install
npm start
```

Run tests:

```bash
npm test
```

## Requirements

- Node.js 18+
- MongoDB for running generated APIs

## Roadmap

- TypeScript generation
- Authentication middleware
- Role-based access control
- Request validation
- OpenAPI / Swagger generation
- PostgreSQL support
- Prisma support
- Custom templates
- CLI-based generation
- Docker configuration generation

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Run tests.
5. Open a pull request.

## License

MIT

## Author

**Azad Singh**

GitHub: https://github.com/azadsingh99
