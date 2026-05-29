-- Cambodia administrative geography: communes
-- ID format: 6-digit commune, e.g. '010201', '120101'

CREATE TABLE IF NOT EXISTS geography_communes (
    id VARCHAR(6) PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_km VARCHAR(255) NOT NULL,
    district_id VARCHAR(4) NOT NULL REFERENCES geography_districts(id) ON DELETE CASCADE,
    province_id VARCHAR(2) NOT NULL REFERENCES geography_provinces(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_geo_communes_district_id ON geography_communes (district_id);
CREATE INDEX IF NOT EXISTS idx_geo_communes_province_id ON geography_communes (province_id);
