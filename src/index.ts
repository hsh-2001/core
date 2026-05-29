import { Hono } from 'hono'
import user from './modules/user/user.routes';
import commonRoute from './modules/common/common.routes';
import geography from './modules/geography/geography.routes';
import temple from './modules/temple/temple.routes';
import type { AppEnv } from './shared/types';
import { setDatabaseUrl } from './shared/db';
import { setJwtSecret } from './shared/auth';
import { sendError, sendSuccess } from './shared/response';
import { sendCronEmail } from './cron';
import { cors } from 'hono/cors';

export const app = new Hono<AppEnv>()

app.use('*', async (c, next) => {
  const nodeEnv = typeof process === 'undefined' ? undefined : process.env;
  setDatabaseUrl(c.env?.DATABASE_URL ?? nodeEnv?.DATABASE_URL ?? '');
  setJwtSecret(c.env?.JWT_SECRET ?? nodeEnv?.JWT_SECRET ?? '');
  await next();
});

app.use(
  '*',
  cors({
    origin: "*",
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
)


app.get('/api', (c) => {
  return sendSuccess(c, { service: 'Core API' });
})

app.route('/api/user', user);
app.route('/api/common', commonRoute);
app.route('/api/geography', geography);
app.route('/api/temples', temple);

app.notFound((c) => {
  return sendError(c, new Error('Route not found'), 404);
});

app.onError((error, c) => {
  return sendError(c, error);
});

export default {
  fetch: (request: Request, env: AppEnv['Bindings'], ctx: any) => {
    return app.fetch(request, env, ctx);
  },
  scheduled: (controller: any, env: AppEnv['Bindings'], ctx: any) => {
    ctx.waitUntil(sendCronEmail(env, controller));
  },
}
