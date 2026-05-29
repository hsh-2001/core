-- Cambodia administrative geography: provinces
-- ID format: 2-digit province, e.g. '01', '12'

CREATE TABLE IF NOT EXISTS geography_provinces (
    id VARCHAR(2) PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_km VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
