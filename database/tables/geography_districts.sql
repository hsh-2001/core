-- Cambodia administrative geography: districts
-- ID format: 4-digit district, e.g. '0102', '1201'

CREATE TABLE IF NOT EXISTS geography_districts (
    id VARCHAR(4) PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_km VARCHAR(255) NOT NULL,
    province_id VARCHAR(2) NOT NULL REFERENCES geography_provinces(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_geo_districts_province_id ON geography_districts (province_id);
