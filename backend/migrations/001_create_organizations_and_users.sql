
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    type VARCHAR(20) NOT NULL
        CHECK (type IN ('donor', 'ngo')),
    donor_type VARCHAR(50),
    capacity_daily INTEGER CHECK (capacity_daily >= 0),
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    location GEOGRAPHY(POINT, 4326),
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    verification_date TIMESTAMPTZ,
    contact_person VARCHAR(150),
    phone VARCHAR(30),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT organization_verification_date_check
        CHECK (verified = FALSE OR verification_date IS NOT NULL)
);


CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id)
        ON DELETE RESTRICT,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(254) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL
        CHECK (role IN ('donor', 'ngo', 'volunteer', 'admin')),
    phone VARCHAR(30),
    title VARCHAR(100),
    vehicle_type VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT user_organization_role_check
        CHECK (
            (role IN ('donor', 'ngo') AND organization_id IS NOT NULL)
            OR
            (role IN ('volunteer', 'admin') AND organization_id IS NULL)
        )
);

CREATE INDEX idx_users_organization_id
    ON users(organization_id);
