CREATE TABLE IF NOT EXISTS otp_verification (
    id SERIAL PRIMARY KEY,
    web_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    identifier VARCHAR(50) NOT NULL, -- Phone or email
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_otp_verification_web_id ON otp_verification (web_id);
CREATE INDEX IF NOT EXISTS idx_otp_verification_user_id ON otp_verification (user_id);
CREATE INDEX IF NOT EXISTS idx_otp_verification_identifier ON otp_verification (identifier);
