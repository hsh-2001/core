# API Reference

The Core service exposes Hono routes under `/api`.

## Base Endpoint

```http
GET /api
```

Returns basic service metadata.

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "service": "Core API"
  }
}
```

## Modules

| Module | Base path | Purpose |
| --- | --- | --- |
| Users | `/api/user` | Register, log in, and look up users. |
| Geography | `/api/geography` | Query Cambodia administrative geography. |
| Temples | `/api/temples` | Create and search temple records. |
| Common | `/api/common` | Shared utility endpoints, including email sending. |

## Response Envelope

Successful responses use:

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

Failed responses use:

```json
{
  "success": false,
  "message": "Error message"
}
```

## Status Codes

| Status | Meaning |
| --- | --- |
| `200` | Request succeeded. |
| `201` | Resource created. |
| `400` | Validation or request input failed. |
| `401` | Authentication credentials are invalid. |
| `404` | Resource or route was not found. |
| `500` | Unexpected server error. |

## Content Type

Send JSON request bodies with:

```http
Content-Type: application/json
```

## Authentication

`POST /api/user/login` returns a JWT token. The current routes do not require an `Authorization` header, but consumers should store the token for authenticated endpoints added later.
