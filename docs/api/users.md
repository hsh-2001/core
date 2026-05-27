# User APIs

Base path: `/api/user`

## Register

```http
POST /api/user/register
```

Creates a user for an existing website.

### Body

```json
{
  "webId": "1",
  "username": "demo",
  "password": "secret-password",
  "email": "demo@example.com"
}
```

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `webId` | string | Yes | Website identifier. The website must already exist. |
| `username` | string | Yes | Must be unique. |
| `password` | string | Yes | Stored as a password hash. |
| `email` | string | Yes | Must be unique. |

### Response

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "message": "User registered successfully"
  }
}
```

## Login

```http
POST /api/user/login
```

Logs in with a username or email address.

### Body

```json
{
  "identifier": "demo@example.com",
  "password": "secret-password"
}
```

### Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt-token",
    "id": 1,
    "webId": 1,
    "username": "demo",
    "email": "demo@example.com"
  }
}
```

Invalid users or passwords return `401`.

## Find One User

```http
GET /api/user/find/:identifier
```

Finds a single user by username or email.

### Parameters

| Name | In | Type | Required |
| --- | --- | --- | --- |
| `identifier` | path | string | Yes |

## List Users By Website

```http
GET /api/user/web/:webId
```

Returns all users attached to one website.

### Parameters

| Name | In | Type | Required |
| --- | --- | --- | --- |
| `webId` | path | number | Yes |
