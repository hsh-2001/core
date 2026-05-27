```txt
npm install
npm run dev
```

## Source layout

```txt
src/
  index.ts            # Cloudflare Worker entrypoint
  server.ts           # Node local server entrypoint
  modules/
    common/           # Common API routes, controller, service
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

Supported filters include `id`, `name_en`, `name_km`, `provinceId`, `districtId`, `communeId`, and `q` for a local name contains search on the returned records.

```txt
npm run deploy
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
npm run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiation `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```
