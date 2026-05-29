export type Bindings = {
  DATABASE_URL: string;
  JWT_SECRET: string;
  SMTP_HOST: string;
  SMTP_PORT?: string;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  SMTP_SECURE?: string;
  EMAIL_FROM: string;
};

export type AppEnv = {
  Bindings: Bindings;
};
