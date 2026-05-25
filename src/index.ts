import { Hono } from 'hono'
import user from './modules/user/user.routes';
import commonRoute from './modules/common/common.routes';
import type { AppEnv } from './shared/types';
import { setDatabaseUrl } from './shared/db';
import { setJwtSecret } from './shared/auth';

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
