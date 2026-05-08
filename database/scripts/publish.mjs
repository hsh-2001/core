import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../..");

const connectionString =
  process.env.DATABASE_URL ?? process.env.NEON_CONNECTION_STRING;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Add it to .env or export it.");
}

export const db = neon(connectionString);

const tableDir = path.join(repoRoot, "database", "tables");
const functionDir = path.join(repoRoot, "database", "functions");

const getSqlFiles = (dir) => {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".sql"))
    .sort();
};

const publishFiles = async (dir, files, label) => {
  for (const file of files) {
    const sql = fs.readFileSync(path.join(dir, file), "utf-8");
    await db.query(sql);
    console.log(`Published ${label}: ${file}`);
  }
};

export const publish = async () => {
  const tableFiles = getSqlFiles(tableDir);
  const functionFiles = getSqlFiles(functionDir);

  if (tableFiles.length === 0 && functionFiles.length === 0) {
    console.log("No SQL files found to publish.");
    return;
  }

  await publishFiles(tableDir, tableFiles, "table");
  await publishFiles(functionDir, functionFiles, "function");
};

if (process.argv[1] === __filename) {
  publish().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
