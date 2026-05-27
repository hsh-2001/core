export type GeographyLevel = "provinces" | "districts" | "communes" | "villages";

export type GeographyQuery = {
  id?: string;
  name_en?: string;
  name_km?: string;
  province_id?: string;
  district_id?: string;
  commune_id?: string;
  /** camelCase aliases (mapped to snake_case in the repository) */
  provinceId?: string;
  districtId?: string;
  communeId?: string;
  villageId?: string;
  /** Full-text contains search across name_en and name_km */
  q?: string;
};

export type GeographyItem = {
  id: string;
  name_en: string;
  name_km: string;
  province_id?: string;
  district_id?: string;
  commune_id?: string;
};
