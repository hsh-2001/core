-- Cambodia administrative geography: villages
-- ID format: 8-digit village, e.g. '01020101', '12010101'

CREATE TABLE IF NOT EXISTS geography_villages (
    id VARCHAR(8) PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_km VARCHAR(255) NOT NULL,
    commune_id VARCHAR(6) NOT NULL REFERENCES geography_communes(id) ON DELETE CASCADE,
    district_id VARCHAR(4) NOT NULL REFERENCES geography_districts(id) ON DELETE CASCADE,
    province_id VARCHAR(2) NOT NULL REFERENCES geography_provinces(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_geo_villages_commune_id ON geography_villages (commune_id);
CREATE INDEX IF NOT EXISTS idx_geo_villages_district_id ON geography_villages (district_id);
CREATE INDEX IF NOT EXISTS idx_geo_villages_province_id ON geography_villages (province_id);
