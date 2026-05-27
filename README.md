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
