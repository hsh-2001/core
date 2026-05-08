import { Hono } from 'hono'
import user from './routes/user';
import type { AppEnv } from './types';
import { setDatabaseUrl } from './utils/db';
import { setJwtSecret } from './utils/common';

const app = new Hono<AppEnv>()

app.use('*', async (c, next) => {
  setDatabaseUrl(c.env.DATABASE_URL);
  setJwtSecret(c.env.JWT_SECRET);
  await next();
});

app.get('/api', (c) => {
  return c.text('Hello Hono!')
})

app.route('/api/user', user);
  
export default app
