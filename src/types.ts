export type Bindings = {
  DATABASE_URL: string;
  JWT_SECRET: string;
};

export type AppEnv = {
  Bindings: Bindings;
};
