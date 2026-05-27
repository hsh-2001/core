---
layout: home

hero:
  name: Core API
  text: API documentation guide
  tagline: Hono service endpoints for users, geography, temples, and common utilities.
  actions:
    - theme: brand
      text: View API Reference
      link: /api/
    - theme: alt
      text: Run Locally
      link: /#run-the-api

features:
  - title: Consistent Responses
    details: Every endpoint returns a `success`, `message`, and optional `data` payload.
  - title: Cloudflare Ready
    details: The app runs as a Worker through Wrangler and can also run locally with the Node server.
  - title: Domain Modules
    details: APIs are grouped by user, geography, temple, and common utility modules.
---

## Run the API

Install dependencies:

```sh
npm install
```

Start the Worker locally:

```sh
npm run dev
```

Run the Node local server:

```sh
npm run start
```

## Run the Docs

Start VitePress:

```sh
npm run docs:dev
```

Build the static docs:

```sh
npm run docs:build
```

Preview the built docs:

```sh
npm run docs:preview
```

## Base URL

All routes are mounted under `/api`.

```txt
GET /api
```

Response:

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "service": "Core API"
  }
}
```

## Response Format

Successful responses:

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

Error responses:

```json
{
  "success": false,
  "message": "Route not found"
}
```
