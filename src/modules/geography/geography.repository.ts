import query from "../../shared/db";
import type { GeographyLevel, GeographyItem, GeographyQuery } from "./geography.types";

/** Maps our short level names to the actual database table names */
const TABLE_MAP: Record<GeographyLevel, string> = {
  provinces: "geography_provinces",
  districts: "geography_districts",
  communes: "geography_communes",
  villages: "geography_villages",
};

/** Columns we select (all geography tables share these 3 core columns + FK columns) */
const BASE_COLUMNS = ["id", "name_en", "name_km"];

/** Additional FK columns per level */
const FK_COLUMNS: Record<GeographyLevel, string[]> = {
  provinces: ["capital_city"],
  districts: ["province_id"],
  communes: ["district_id", "province_id"],
  villages: ["commune_id", "district_id", "province_id"],
};

/** Maps camelCase query params from the controller to snake_case DB columns */
const FILTER_ALIAS: Record<string, string> = {
  provinceId: "province_id",
  districtId: "district_id",
  communeId: "commune_id",
  villageId: "id",
};

/** Filters we allow per level */
const ALLOWED_FILTERS: Record<GeographyLevel, Set<string>> = {
  provinces: new Set(["id", "name_en", "name_km", "capital_city"]),
  districts: new Set(["id", "name_en", "name_km", "province_id"]),
  communes: new Set(["id", "name_en", "name_km", "province_id", "district_id"]),
  villages: new Set(["id", "name_en", "name_km", "province_id", "district_id", "commune_id"]),
};

const sanitizeValue = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
};

/**
 * Build WHERE clauses from the query parameters.
 * Returns [whereClauses: string[], params: unknown[]]
 */
const buildWhereClauses = (
  level: GeographyLevel,
  query: GeographyQuery,
): [string[], unknown[]] => {
  const whereClauses: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 0;

  const allowed = ALLOWED_FILTERS[level];

  for (const [rawKey, rawValue] of Object.entries(query)) {
    const value = sanitizeValue(rawValue);
    if (!value) continue;

    const column = FILTER_ALIAS[rawKey] ?? rawKey;
    if (!allowed.has(column)) continue;

    paramIndex++;
    whereClauses.push(`${column} = $${paramIndex}`);
    params.push(value);
  }

  return [whereClauses, params];
};

const buildQClause = (
  level: GeographyLevel,
  q: string | undefined,
  paramIndex: number,
): [string, unknown[]] => {
  if (!q) return ["", []];
  const needle = sanitizeValue(q);
  if (!needle) return ["", []];

  const like = `%${needle.toLowerCase()}%`;
  const columns = level === "provinces" ? ["name_en", "name_km", "capital_city"] : ["name_en", "name_km"];
  const searchClause = columns
    .map((column) => `LOWER(COALESCE(${column}, '')) LIKE $${paramIndex}`)
    .join(" OR ");

  return [
    `(${searchClause})`,
    [like],
  ];
};

const list = async (level: GeographyLevel, filters: GeographyQuery = {}): Promise<GeographyItem[]> => {
  const table = TABLE_MAP[level];
  const columns = [...BASE_COLUMNS, ...FK_COLUMNS[level]];
  const selectColumns = columns.join(', ');

  const [whereClauses, whereParams] = buildWhereClauses(level, filters);
  const [qClause, qParams] = buildQClause(level, filters.q, whereParams.length + 1);

  if (qClause) {
    whereClauses.push(qClause);
  }

  let sql = `SELECT ${selectColumns} FROM ${table}`;
  if (whereClauses.length > 0) {
    sql += ` WHERE ${whereClauses.join(" AND ")}`;
  }
  sql += " ORDER BY id ASC";

  const response = await query(sql, [...whereParams, ...qParams]);
  return (response as unknown as GeographyItem[]) ?? [];
};

const getOne = async (
  level: GeographyLevel,
  id: string | number | undefined,
): Promise<GeographyItem | null> => {
  if (id === undefined || id === null || String(id).trim() === "") {
    return null;
  }

  const table = TABLE_MAP[level];
  const columns = [...BASE_COLUMNS, ...FK_COLUMNS[level]].join(", ");
  const sql = `SELECT ${columns} FROM ${table} WHERE id = $1 LIMIT 1`;

  const response = await query(sql, [String(id)]);
  const rows = response as unknown as GeographyItem[];
  return rows[0] ?? null;
};

export default {
  list,
  getOne,
};
