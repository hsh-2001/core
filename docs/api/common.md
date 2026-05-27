# Common APIs

Base path: `/api/common`

## Send Email

```http
POST /api/common/send-email
```

Sends an HTML email through the configured email service.

### Body

```json
{
  "to": "recipient@example.com",
  "subject": "Welcome",
  "html": "<p>Hello from Core API.</p>"
}
```

| Field | Type | Required |
| --- | --- | --- |
| `to` | string | Yes |
| `subject` | string | Yes |
| `html` | string | Yes |

Blank or missing fields return `400`.

### Response

```json
{
  "success": true,
  "message": "Email sent successfully",
  "data": {}
}
```
