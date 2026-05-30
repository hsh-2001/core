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

### Environment

The endpoint sends mail through Nodemailer using SMTP bindings.

| Binding | Required | Notes |
| --- | --- | --- |
| `SMTP_HOST` | Yes | SMTP server host. |
| `SMTP_PORT` | No | Defaults to `587`. |
| `SMTP_USER` | No | Used for SMTP auth when paired with `SMTP_PASS`. |
| `SMTP_PASS` | No | Used for SMTP auth when paired with `SMTP_USER`. |
| `SMTP_SECURE` | No | Set to `true` for secure SMTP. Defaults to `true` when `SMTP_PORT` is `465`; otherwise `false`. |
| `EMAIL_FROM` | Yes | Sender address. |

### Response

```json
{
  "success": true,
  "message": "Email sent successfully",
  "data": {
    "messageId": "<message-id>",
    "accepted": [
      "recipient@example.com"
    ],
    "rejected": [],
    "response": "250 Message accepted"
  }
}
```

Missing SMTP configuration or provider failures return `500`.
