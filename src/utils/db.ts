import { neon } from '@neondatabase/serverless';

const clients = new Map<string, ReturnType<typeof neon>>();
let databaseUrl: string | undefined;

export const setDatabaseUrl = (connectionString: string) => {
  databaseUrl = connectionString;
};

const getDatabaseUrl = () => {
  if (!databaseUrl) {
    throw new Error('Database connection string is not defined');
  }

  return databaseUrl;
};

const query = async (sql: string, params?: unknown[]) => {
  const connectionString = getDatabaseUrl();

  let client = clients.get(connectionString);
  if (!client) {
    client = neon(connectionString);
    clients.set(connectionString, client);
  }

  const response = await client.query(sql, params);
  return response;
};

export default query;
