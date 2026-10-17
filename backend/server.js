require("dotenv").config();

const express = require("express");
const pool = require("./config/db");
const donationsRouter = require("./routes/donations");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/donations", donationsRouter);

app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS database_time");

    res.status(200).json({
      success: true,
      message: "FoodLoop backend and database are running!",
      databaseTime: result.rows[0].database_time,
    });
  } catch (error) {
    console.error("Database health check failed:", error.message);

    res.status(503).json({
      success: false,
      message: "Database is currently unavailable",
    });
  }
});

app.listen(PORT, () => {
  console.log(`FoodLoop backend running on http://localhost:${PORT}`);
});
