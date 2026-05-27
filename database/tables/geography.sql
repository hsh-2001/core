-- Cambodia Administrative Geography Tables
-- Hierarchy: Province -> District -> Commune -> Village
-- ID format: 2-digit province, 4-digit district, 6-digit commune, 8-digit village

CREATE TABLE IF NOT EXISTS geography_provinces (
    id VARCHAR(2) PRIMARY KEY,          -- e.g. '01', '12'
    name_en VARCHAR(255) NOT NULL,
    name_km VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS geography_districts (
    id VARCHAR(4) PRIMARY KEY,          -- e.g. '0102', '1201'
    name_en VARCHAR(255) NOT NULL,
    name_km VARCHAR(255) NOT NULL,
    province_id VARCHAR(2) NOT NULL REFERENCES geography_provinces(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_geo_districts_province_id ON geography_districts (province_id);

CREATE TABLE IF NOT EXISTS geography_communes (
    id VARCHAR(6) PRIMARY KEY,          -- e.g. '010201', '120101'
    name_en VARCHAR(255) NOT NULL,
    name_km VARCHAR(255) NOT NULL,
    district_id VARCHAR(4) NOT NULL REFERENCES geography_districts(id) ON DELETE CASCADE,
    province_id VARCHAR(2) NOT NULL REFERENCES geography_provinces(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_geo_communes_district_id ON geography_communes (district_id);
CREATE INDEX IF NOT EXISTS idx_geo_communes_province_id ON geography_communes (province_id);

CREATE TABLE IF NOT EXISTS geography_villages (
    id VARCHAR(8) PRIMARY KEY,          -- e.g. '01020101', '12010101'
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
