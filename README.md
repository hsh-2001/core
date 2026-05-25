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
