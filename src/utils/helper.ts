export const getEnv = <TEnv extends Record<string, string | undefined>>(
  env: TEnv,
  key: string,
  defaultValue?: string,
): string => {
  const value = env[key] ?? defaultValue;

  if (value === undefined) {
    throw new Error(`Environment variable "${key}" is not set`);
  }

  return value;
};
