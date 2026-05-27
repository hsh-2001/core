import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString =
  process.env.DATABASE_URL ?? process.env.NEON_CONNECTION_STRING;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Add it to .env or export it.");
}

const db = neon(connectionString);

const DATA_DIR = path.join(__dirname, "data");

/**
 * Read JSON data from a file and return parsed array.
 */
const readData = (filename) => {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠️  File not found: ${filename} — skipping`);
    return [];
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
};

const clearTables = async () => {
  // Clear in reverse dependency order to avoid relying on CASCADE
  const tables = [
    "geography_villages",
    "geography_communes",
    "geography_districts",
    "geography_provinces",
  ];
  for (const table of tables) {
    await db.query(`DELETE FROM ${table}`);
    console.log(`  🧹 Cleared table: ${table}`);
  }
};

const seedTable = async (table, filename, columns, mapper) => {
  const data = readData(filename);
  if (data.length === 0) {
    console.log(`  ⏭️  Skipping ${table} (no data)`);
    return;
  }
  const rows = data.map(mapper);
  for (let i = 0; i < rows.length; i += 500) {
    const batch = rows.slice(i, i + 500);
    const colList = columns.join(", ");
    let paramIdx = 0;
    const valueGroups = batch.map((row) => {
      const placeholders = row.map(() => `$${++paramIdx}`).join(", ");
      return `(${placeholders})`;
    });
    const values = batch.flat();
    const sql = `INSERT INTO ${table} (${colList}) VALUES ${valueGroups.join(", ")} ON CONFLICT (id) DO UPDATE SET
      name_en = EXCLUDED.name_en,
      name_km = EXCLUDED.name_km,
      updated_at = NOW()`;
    await db.query(sql, values);
    console.log(`  ✅ Inserted ${Math.min(i + 500, rows.length)} / ${rows.length} into ${table}`);
  }
};

const seed = async () => {
  console.log("🌍 Seeding Cambodia geography data...\n");

  await clearTables();

  // Insert in dependency order: provinces → districts → communes → villages
  await seedTable(
    "geography_provinces",
    "provinces.json",
    ["id", "name_en", "name_km"],
    (d) => [d.id, d.name_en, d.name_km],
  );
  await seedTable(
    "geography_districts",
    "districts.json",
    ["id", "name_en", "name_km", "province_id"],
    (d) => [d.id, d.name_en, d.name_km, d.province_id],
  );
  await seedTable(
    "geography_communes",
    "communes.json",
    ["id", "name_en", "name_km", "district_id", "province_id"],
    (d) => [d.id, d.name_en, d.name_km, d.district_id, d.province_id],
  );
  await seedTable(
    "geography_villages",
    "villages.json",
    ["id", "name_en", "name_km", "commune_id", "district_id", "province_id"],
    (d) => [d.id, d.name_en, d.name_km, d.commune_id, d.district_id, d.province_id],
  );

  console.log("\n✅ Geography seeding complete!");
};

// --- CLI entry point ---
if (process.argv[1] === __filename) {
  seed().catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  });
}

export default seed;
