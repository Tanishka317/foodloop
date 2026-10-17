const express = require("express");
const pool = require("../config/db");

const router = express.Router();

router.post("/", async (req, res) => {
  const {
    donor_organization_id,
    title,
    description,
    category,
    quantity,
    unit,
    estimated_servings,
    estimated_weight_kg,
    pickup_address,
    available_from,
    pickup_deadline,
    storage_instructions,
    allergens = [],
    dietary_tags = [],
    image_url,
    workflow_type,
  } = req.body;

  // 1. Validate required fields.
  if (
    !donor_organization_id ||
    !title?.trim() ||
    !category?.trim() ||
    quantity === undefined ||
    !unit?.trim() ||
    !pickup_address?.trim() ||
    !available_from ||
    !pickup_deadline ||
    !workflow_type
  ) {
    return res.status(400).json({
      success: false,
      message: "Missing required donation fields",
    });
  }

  // 2. Validate field lengths and numeric values.
  if (
    title.trim().length > 150 ||
    category.trim().length > 50 ||
    unit.trim().length > 30
  ) {
    return res.status(400).json({
      success: false,
      message: "Title, category, or unit exceeds the allowed length",
    });
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({
      success: false,
      message: "Quantity must be a positive integer",
    });
  }

  if (
    estimated_servings != null &&
    (!Number.isInteger(estimated_servings) || estimated_servings <= 0)
  ) {
    return res.status(400).json({
      success: false,
      message: "Estimated servings must be a positive integer",
    });
  }

  if (
    estimated_weight_kg != null &&
    (!Number.isFinite(estimated_weight_kg) || estimated_weight_kg <= 0)
  ) {
    return res.status(400).json({
      success: false,
      message: "Estimated weight must be a positive number",
    });
  }

  if (
    !Array.isArray(allergens) ||
    !allergens.every((item) => typeof item === "string") ||
    !Array.isArray(dietary_tags) ||
    !dietary_tags.every((item) => typeof item === "string")
  ) {
    return res.status(400).json({
      success: false,
      message: "Allergens and dietary tags must be arrays of strings",
    });
  }

  if (!["request_approval", "instant_claim"].includes(workflow_type)) {
    return res.status(400).json({
      success: false,
      message: "Invalid workflow type",
    });
  }

  // 3. Validate the dates.
  const availableDate = new Date(available_from);
  const deadlineDate = new Date(pickup_deadline);

  if (
    Number.isNaN(availableDate.getTime()) ||
    Number.isNaN(deadlineDate.getTime()) ||
    deadlineDate <= availableDate
  ) {
    return res.status(400).json({
      success: false,
      message: "Pickup deadline must be later than availability",
    });
  }

  try {
    // 4. Confirm the organization is a verified donor.
    const organizationResult = await pool.query(
      `SELECT id
       FROM organizations
       WHERE id = $1
         AND type = 'donor'
         AND verified = TRUE`,
      [donor_organization_id],
    );

    if (organizationResult.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "A verified donor organization is required",
      });
    }

    // 5. Insert the donation.
    const result = await pool.query(
      `INSERT INTO donations (
        donor_organization_id,
        title,
        description,
        category,
        quantity,
        unit,
        estimated_servings,
        estimated_weight_kg,
        pickup_address,
        available_from,
        pickup_deadline,
        storage_instructions,
        allergens,
        dietary_tags,
        image_url,
        status,
        workflow_type
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9,
        $10, $11, $12, $13, $14, $15,
        'published', $16
      )
      RETURNING *`,
      [
        donor_organization_id,
        title.trim(),
        description ?? null,
        category.trim(),
        quantity,
        unit.trim(),
        estimated_servings ?? null,
        estimated_weight_kg ?? null,
        pickup_address.trim(),
        availableDate,
        deadlineDate,
        storage_instructions ?? null,
        allergens,
        dietary_tags,
        image_url ?? null,
        workflow_type,
      ],
    );

    return res.status(201).json({
      success: true,
      message: "Donation created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Failed to create donation:", error.message);

    if (error.code === "22P02") {
      return res.status(400).json({
        success: false,
        message: "Invalid organization ID or field format",
      });
    }

    if (error.code === "23503") {
      return res.status(400).json({
        success: false,
        message: "The specified donor organization does not exist",
      });
    }

    if (error.code === "23514" || error.code === "22003") {
      return res.status(400).json({
        success: false,
        message: "Donation data violates a database constraint",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create donation",
    });
  }
});

// GET /api/donations?category=Prepared%20Meals&city=Mumbai
router.get("/", async (req, res) => {
  const { category, city } = req.query;

  try {
    const result = await pool.query(
      `SELECT
         d.id,
         d.title,
         d.description,
         d.category,
         d.quantity,
         d.allocated_quantity,
         (d.quantity - d.allocated_quantity) AS available_quantity,
         d.unit,
         d.estimated_servings,
         d.pickup_address,
         d.available_from,
         d.pickup_deadline,
         d.status,
         d.workflow_type,
         o.name AS donor_organization
       FROM donations d
       JOIN organizations o
         ON o.id = d.donor_organization_id
       WHERE d.status = 'published'
         AND d.pickup_deadline > NOW()
         AND d.quantity > d.allocated_quantity
         AND ($1::text IS NULL OR d.category ILIKE $1)
         AND ($2::text IS NULL OR o.city ILIKE $2)
       ORDER BY d.created_at DESC`,
      [category ? `%${category}%` : null, city ? `%${city}%` : null],
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    console.error("Failed to fetch donations. Full error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch donations",
      error: err?.message || String(err),
    });
  }
});

module.exports = router;
