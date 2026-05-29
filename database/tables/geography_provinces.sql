-- Cambodia administrative geography: provinces
-- ID format: 2-digit province, e.g. '01', '12'

CREATE TABLE IF NOT EXISTS geography_provinces (
    id VARCHAR(2) PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_km VARCHAR(255) NOT NULL,
    capital_city VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE geography_provinces
    ADD COLUMN IF NOT EXISTS capital_city VARCHAR(255);
