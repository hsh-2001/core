import { serve } from '@hono/node-server';
import { app } from './index';

const port = Number(process.env.PORT ?? 3000);

serve({
  fetch: app.fetch,
  port,
}, (info) => {
  console.log(`Server is running on http://0.0.0.0:${info.port}`);
});
