
CREATE TABLE pickups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    donation_id UUID NOT NULL
        REFERENCES donations(id)
        ON DELETE RESTRICT,

    donation_request_id UUID
        REFERENCES donation_requests(id)
        ON DELETE RESTRICT,

    volunteer_id UUID
        REFERENCES users(id)
        ON DELETE RESTRICT,

    status VARCHAR(20) NOT NULL DEFAULT 'assigned'
        CHECK (
            status IN (
                'assigned',
                'accepted',
                'en_route',
                'collected',
                'delivered'
            )
        ),

    scheduled_pickup_at TIMESTAMPTZ,
    collected_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,

    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT pickup_delivery_timestamp_check
        CHECK (
            delivered_at IS NULL
            OR (
                collected_at IS NOT NULL
                AND delivered_at >= collected_at
            )
        )
);

CREATE INDEX idx_pickups_volunteer_status
    ON pickups(volunteer_id, status);

CREATE INDEX idx_pickups_donation_id
    ON pickups(donation_id);
