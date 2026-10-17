
CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    donor_organization_id UUID NOT NULL
        REFERENCES organizations(id)
        ON DELETE RESTRICT,

    title VARCHAR(150) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,

    quantity INTEGER NOT NULL CHECK (quantity > 0),
    allocated_quantity INTEGER NOT NULL DEFAULT 0
        CHECK (
            allocated_quantity >= 0
            AND allocated_quantity <= quantity
        ),

    unit VARCHAR(30) NOT NULL,
    estimated_servings INTEGER
        CHECK (estimated_servings IS NULL OR estimated_servings > 0),
    estimated_weight_kg NUMERIC(10, 2)
        CHECK (
            estimated_weight_kg IS NULL
            OR estimated_weight_kg > 0
        ),

    pickup_address TEXT NOT NULL,
    pickup_location GEOGRAPHY(POINT, 4326),

    available_from TIMESTAMPTZ NOT NULL,
    pickup_deadline TIMESTAMPTZ NOT NULL,

    storage_instructions TEXT,
    allergens TEXT[] NOT NULL DEFAULT '{}',
    dietary_tags TEXT[] NOT NULL DEFAULT '{}',
    image_url TEXT,

    status VARCHAR(20) NOT NULL DEFAULT 'published'
        CHECK (
            status IN ('published', 'allocated', 'completed', 'expired')
        ),

    workflow_type VARCHAR(30) NOT NULL
        CHECK (
            workflow_type IN ('request_approval', 'instant_claim')
        ),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT donation_pickup_deadline_check
        CHECK (pickup_deadline > available_from),

    CONSTRAINT donation_allocation_status_check
        CHECK (
            status <> 'allocated'
            OR allocated_quantity = quantity
        )
);

CREATE INDEX idx_donations_donor_organization_id
    ON donations(donor_organization_id);

CREATE INDEX idx_donations_status_deadline
    ON donations(status, pickup_deadline);

CREATE INDEX idx_donations_pickup_location
    ON donations USING GIST(pickup_location);
