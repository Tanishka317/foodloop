
CREATE TABLE donation_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    donation_id UUID NOT NULL
        REFERENCES donations(id)
        ON DELETE RESTRICT,

    ngo_organization_id UUID NOT NULL
        REFERENCES organizations(id)
        ON DELETE RESTRICT,

    requested_quantity INTEGER NOT NULL
        CHECK (requested_quantity > 0),

    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (
            status IN ('pending', 'approved', 'rejected', 'completed')
        ),

    message TEXT,
    rejection_reason TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT donation_request_unique_ngo
        UNIQUE (donation_id, ngo_organization_id)
);

CREATE INDEX idx_donation_requests_donation_status
    ON donation_requests(donation_id, status);

CREATE INDEX idx_donation_requests_ngo_status
    ON donation_requests(ngo_organization_id, status);
