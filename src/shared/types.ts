export type Bindings = {
  DATABASE_URL: string;
  JWT_SECRET: string;
  RESEND_API_KEY: string;
  EMAIL_FROM: string;
};

export type AppEnv = {
  Bindings: Bindings;
};
