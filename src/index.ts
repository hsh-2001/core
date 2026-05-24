import { Hono } from 'hono'
import user from './routes/user';
import commonRoute from './routes/common';
import type { AppEnv } from './types';
import { setDatabaseUrl } from './utils/db';
import { setJwtSecret } from './utils/common';

const app = new Hono<AppEnv>()

app.use('*', async (c, next) => {
  const nodeEnv = typeof process === 'undefined' ? undefined : process.env;
  setDatabaseUrl(c.env?.DATABASE_URL ?? nodeEnv?.DATABASE_URL ?? '');
  setJwtSecret(c.env?.JWT_SECRET ?? nodeEnv?.JWT_SECRET ?? '');
  await next();
});

app.get('/api', (c) => {
  return c.text('Hello Hono!')
})

app.route('/api/user', user);
app.route('/api/common', commonRoute);

export default app
