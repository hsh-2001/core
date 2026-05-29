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
const tablePublishOrder = [
  "geography_provinces.sql",
  "geography_districts.sql",
  "geography_communes.sql",
  "geography_villages.sql",
];

const splitSqlStatements = (sql) => {
  const statements = [];
  let current = "";
  let singleQuoted = false;
  let doubleQuoted = false;
  let lineComment = false;
  let blockComment = false;
  let dollarQuoteTag = null;

  for (let i = 0; i < sql.length; i += 1) {
    const char = sql[i];
    const next = sql[i + 1];

    if (lineComment) {
      current += char;
      if (char === "\n") {
        lineComment = false;
      }
      continue;
    }

    if (blockComment) {
      current += char;
      if (char === "*" && next === "/") {
        current += next;
        i += 1;
        blockComment = false;
      }
      continue;
    }

    if (dollarQuoteTag) {
      current += char;
      if (sql.startsWith(dollarQuoteTag, i)) {
        current += sql.slice(i + 1, i + dollarQuoteTag.length);
        i += dollarQuoteTag.length - 1;
        dollarQuoteTag = null;
      }
      continue;
    }

    if (!singleQuoted && !doubleQuoted && char === "-" && next === "-") {
      current += char + next;
      i += 1;
      lineComment = true;
      continue;
    }

    if (!singleQuoted && !doubleQuoted && char === "/" && next === "*") {
      current += char + next;
      i += 1;
      blockComment = true;
      continue;
    }

    if (!singleQuoted && !doubleQuoted && char === "$") {
      const match = sql.slice(i).match(/^\$[A-Za-z_][A-Za-z0-9_]*\$|^\$\$/);
      if (match) {
        dollarQuoteTag = match[0];
        current += dollarQuoteTag;
        i += dollarQuoteTag.length - 1;
        continue;
      }
    }

    if (!doubleQuoted && char === "'" && sql[i - 1] !== "\\") {
      singleQuoted = !singleQuoted;
    } else if (!singleQuoted && char === '"') {
      doubleQuoted = !doubleQuoted;
    }

    if (!singleQuoted && !doubleQuoted && char === ";") {
      const statement = current.trim();
      if (statement) {
        statements.push(statement);
      }
      current = "";
      continue;
    }

    current += char;
  }

  const statement = current.trim();
  if (statement) {
    statements.push(statement);
  }

  return statements;
};

const getSqlFiles = (dir) => {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".sql"))
    .sort();
};

const sortTableFiles = (files) => {
  const priority = new Map(tablePublishOrder.map((file, index) => [file, index]));

  return [...files].sort((left, right) => {
    const leftPriority = priority.get(left) ?? Number.MAX_SAFE_INTEGER;
    const rightPriority = priority.get(right) ?? Number.MAX_SAFE_INTEGER;

    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }

    return left.localeCompare(right);
  });
};

const publishFiles = async (dir, files, label) => {
  for (const file of files) {
    const sql = fs.readFileSync(path.join(dir, file), "utf-8");
    const statements = splitSqlStatements(sql);

    if (statements.length === 0) {
      console.log(`Skipped empty ${label}: ${file}`);
      continue;
    }

    for (const statement of statements) {
      await db.query(statement);
    }

    console.log(`Published ${label}: ${file} (${statements.length} statement${statements.length === 1 ? "" : "s"})`);
  }
};

export const publish = async () => {
  const tableFiles = sortTableFiles(getSqlFiles(tableDir));
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
