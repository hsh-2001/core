import query from "../../shared/db";
import type { Temple, TempleCreateInput, TempleQuery } from "./temple.types";

const SELECT_COLUMNS = `
  id,
  name_en AS "nameEn",
  name_km AS "nameKm",
  description,
  image_url AS "imageUrl",
  province_id AS "provinceId",
  district_id AS "districtId",
  commune_id AS "communeId",
  village_id AS "villageId",
  latitude,
  longitude,
  created_at AS "createdAt",
  updated_at AS "updatedAt"
`;

const normalizeString = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
};

const normalizeNumber = (value: unknown): number | null => {
  if (value === undefined || value === null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const create = async (input: TempleCreateInput): Promise<Temple> => {
  const response = await query(
    `INSERT INTO temples (
      name_en,
      name_km,
      description,
      image_url,
      province_id,
      district_id,
      commune_id,
      village_id,
      latitude,
      longitude
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING ${SELECT_COLUMNS}`,
    [
      normalizeString(input.nameEn),
      normalizeString(input.nameKm),
      normalizeString(input.description),
      normalizeString(input.imageUrl),
      normalizeString(input.provinceId),
      normalizeString(input.districtId),
      normalizeString(input.communeId),
      normalizeString(input.villageId),
      normalizeNumber(input.latitude),
      normalizeNumber(input.longitude),
    ],
  );

  const rows = response as unknown as Temple[];
  return rows[0];
};

const list = async (filters: TempleQuery = {}): Promise<Temple[]> => {
  const whereClauses: string[] = [];
  const params: unknown[] = [];

  const addFilter = (column: string, value: string | undefined) => {
    const normalized = normalizeString(value);
    if (!normalized) return;
    params.push(normalized);
    whereClauses.push(`${column} = $${params.length}`);
  };

  addFilter("province_id", filters.provinceId);
  addFilter("district_id", filters.districtId);
  addFilter("commune_id", filters.communeId);
  addFilter("village_id", filters.villageId);

  const q = normalizeString(filters.q);
  if (q) {
    params.push(`%${q.toLowerCase()}%`);
    whereClauses.push(`(LOWER(name_en) LIKE $${params.length} OR LOWER(name_km) LIKE $${params.length})`);
  }

  const limit = Math.min(Math.max(Number(filters.limit) || 50, 1), 100);
  const offset = Math.max(Number(filters.offset) || 0, 0);
  params.push(limit, offset);

  let sql = `SELECT ${SELECT_COLUMNS} FROM temples`;
  if (whereClauses.length > 0) {
    sql += ` WHERE ${whereClauses.join(" AND ")}`;
  }
  sql += ` ORDER BY id DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

  const response = await query(sql, params);
  return (response as unknown as Temple[]) ?? [];
};

const getById = async (id: number): Promise<Temple | null> => {
  const response = await query(
    `SELECT ${SELECT_COLUMNS} FROM temples WHERE id = $1 LIMIT 1`,
    [id],
  );
  const rows = response as unknown as Temple[];
  return rows[0] ?? null;
};

export default {
  create,
  list,
  getById,
};
