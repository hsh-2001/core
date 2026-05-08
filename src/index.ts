import { Hono } from 'hono'
import user from './routes/user';
import type { AppEnv } from './types';
import { setDatabaseUrl } from './utils/db';

const app = new Hono<AppEnv>()

app.use('*', async (c, next) => {
  setDatabaseUrl(c.env.DATABASE_URL);
  await next();
});

app.get('/api', (c) => {
  return c.text('Hello Hono!')
})

app.route('/api/user', user);
  
export default app
