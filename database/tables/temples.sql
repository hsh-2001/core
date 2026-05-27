CREATE TABLE IF NOT EXISTS temples (
    id SERIAL PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_km VARCHAR(255),
    description TEXT,
    image_url TEXT,
    province_id VARCHAR(2) REFERENCES geography_provinces(id) ON DELETE SET NULL,
    district_id VARCHAR(4) REFERENCES geography_districts(id) ON DELETE SET NULL,
    commune_id VARCHAR(6) REFERENCES geography_communes(id) ON DELETE SET NULL,
    village_id VARCHAR(8) REFERENCES geography_villages(id) ON DELETE SET NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_temples_province_id ON temples (province_id);
CREATE INDEX IF NOT EXISTS idx_temples_district_id ON temples (district_id);
CREATE INDEX IF NOT EXISTS idx_temples_commune_id ON temples (commune_id);
CREATE INDEX IF NOT EXISTS idx_temples_village_id ON temples (village_id);
CREATE INDEX IF NOT EXISTS idx_temples_name_en ON temples (name_en);
