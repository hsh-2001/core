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
    "temples",
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
    const updateColumns = columns
      .filter((column) => column !== "id")
      .map((column) => `${column} = EXCLUDED.${column}`);
    const sql = `INSERT INTO ${table} (${colList}) VALUES ${valueGroups.join(", ")} ON CONFLICT (id) DO UPDATE SET
      ${updateColumns.join(",\n      ")},
      updated_at = NOW()`;
    await db.query(sql, values);
    console.log(`  ✅ Inserted ${Math.min(i + 500, rows.length)} / ${rows.length} into ${table}`);
  }
};

const seedTemples = async () => {
  const data = readData("temples.json");
  if (data.length === 0) {
    console.log("  ⏭️  Skipping temples (no data)");
    return;
  }

  const columns = [
    "id",
    "name_en",
    "name_km",
    "description",
    "image_url",
    "province_id",
    "district_id",
    "commune_id",
    "village_id",
    "latitude",
    "longitude",
  ];
  const rows = data.map((d) => [
    d.id,
    d.name_en,
    d.name_km,
    d.description,
    d.image_url,
    d.province_id,
    d.district_id,
    d.commune_id,
    d.village_id,
    d.latitude,
    d.longitude,
  ]);

  const colList = columns.join(", ");
  let paramIdx = 0;
  const valueGroups = rows.map((row) => {
    const placeholders = row.map(() => `$${++paramIdx}`).join(", ");
    return `(${placeholders})`;
  });
  const values = rows.flat();
  const sql = `INSERT INTO temples (${colList}) VALUES ${valueGroups.join(", ")} ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_km = EXCLUDED.name_km,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    province_id = EXCLUDED.province_id,
    district_id = EXCLUDED.district_id,
    commune_id = EXCLUDED.commune_id,
    village_id = EXCLUDED.village_id,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    updated_at = NOW()`;

  await db.query(sql, values);
  await db.query("SELECT setval(pg_get_serial_sequence('temples', 'id'), COALESCE((SELECT MAX(id) FROM temples), 1), true)");
  console.log(`  ✅ Inserted ${rows.length} / ${rows.length} into temples`);
};

const seed = async () => {
  console.log("🌍 Seeding Cambodia geography and temple data...\n");

  await clearTables();

  // Insert in dependency order: provinces → districts → communes → villages
  await seedTable(
    "geography_provinces",
    "provinces.json",
    ["id", "name_en", "name_km", "capital_city"],
    (d) => [d.id, d.name_en, d.name_km, d.capital_city],
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
  await seedTemples();

  console.log("\n✅ Cambodia geography and temple seeding complete!");
};

// --- CLI entry point ---
if (process.argv[1] === __filename) {
  seed().catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  });
}

export default seed;
