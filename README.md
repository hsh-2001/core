# Core API

Hono API service for users, Cambodia geography, temple records, and shared utilities.

## Run locally

```txt
npm install
npm run dev
```

The Worker dev server runs with Wrangler. For the Node server entrypoint, run:

```txt
npm run start
```

## API docs

```txt
npm run docs:dev
```

The VitePress docs live in `docs/`. The API reference starts at `docs/api/index.md`.

Deployed API base URL:

```txt
https://core.shkh1601.workers.dev
```

## Scheduled email

The Worker has a cron trigger configured in `wrangler.jsonc`:

```txt
*/5 * * * *
```

For local testing, Wrangler reads Worker bindings from `.dev.vars`, not `.env`.

```txt
cp .dev.vars.example .dev.vars
npm run dev
```

Then trigger the scheduled handler manually:

```txt
curl http://localhost:8787/__scheduled
```

Required local and deployed bindings:

```txt
DATABASE_URL
JWT_SECRET
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASS
SMTP_SECURE
EMAIL_FROM
```

Before deploying, set the private values as Worker secrets:

```txt
npx wrangler secret put DATABASE_URL
npx wrangler secret put JWT_SECRET
npx wrangler secret put SMTP_HOST
npx wrangler secret put SMTP_PORT
npx wrangler secret put SMTP_USER
npx wrangler secret put SMTP_PASS
npx wrangler secret put SMTP_SECURE
npx wrangler secret put EMAIL_FROM
```

## Source layout

```txt
src/
  index.ts            # Cloudflare Worker entrypoint
  server.ts           # Node local server entrypoint
  modules/
    common/           # Common API routes, controller, service
    geography/        # Cambodia administrative geography APIs
    temple/           # Temple API routes, controller, service, repository, types
    user/             # User API routes, controller, service, repository, types
  shared/             # Cross-cutting app types, auth helpers, database client
```

## Cambodia geography APIs

Cambodia administrative geography is exposed under `/api/geography`.

```txt
GET /api/geography/provinces
GET /api/geography/districts?provinceId=12
GET /api/geography/communes?districtId=1201
GET /api/geography/villages?communeId=120101
GET /api/geography/detail?provinceId=12
GET /api/geography/detail?districtId=1201
GET /api/geography/detail?communeId=120101
GET /api/geography/detail?villageId=12010101
```

## Temple APIs

Temple records are exposed under `/api/temples`.

```http
POST /api/temples
GET /api/temples
GET /api/temples/:id
```

`POST /api/temples` accepts:

```json
{
  "nameEn": "Angkor Wat",
  "nameKm": "អង្គរវត្ត",
  "description": "Temple description",
  "imageUrl": "https://example.com/angkor.jpg",
  "provinceId": "17",
  "districtId": "1702",
  "communeId": "170201",
  "villageId": "17020101",
  "latitude": 13.4125,
  "longitude": 103.867
}
```

`GET /api/temples` supports `q`, `provinceId`, `districtId`, `communeId`, `villageId`, `limit`, and `offset` query params.

Temple API responses include `mapUrl` when `latitude` and `longitude` are available.

`GET /api/temples` defaults to `limit=50`, caps `limit` at `100`, and defaults `offset` to `0`.

## Deploy

```txt
npm run deploy
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
npm run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiating `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```
