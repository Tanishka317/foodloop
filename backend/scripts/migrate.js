require("dotenv").config();

const fs = require("fs");
const path = require("path");
const pool = require("../config/db");

const migrationsDirectory = path.join(__dirname, "..", "migrations");

async function migrate() {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        filename TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    // Record an existing migration without executing it again.
    const baselineFile = process.argv[2];

    if (baselineFile) {
      const filePath = path.join(migrationsDirectory, baselineFile);

      if (
        path.basename(baselineFile) !== baselineFile ||
        !fs.existsSync(filePath) ||
        !baselineFile.endsWith(".sql")
      ) {
        throw new Error("Invalid migration filename.");
      }

      await client.query(
        `INSERT INTO schema_migrations (filename)
         VALUES ($1)
         ON CONFLICT (filename) DO NOTHING`,
        [baselineFile],
      );

      console.log(`Baseline recorded: ${baselineFile}`);
      return;
    }

    const files = fs
      .readdirSync(migrationsDirectory)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    for (const file of files) {
      const existing = await client.query(
        "SELECT filename FROM schema_migrations WHERE filename = $1",
        [file],
      );

      if (existing.rowCount > 0) {
        console.log(`Already applied: ${file}`);
        continue;
      }

      const sql = fs.readFileSync(path.join(migrationsDirectory, file), "utf8");

      await client.query("BEGIN");

      try {
        await client.query(sql);

        await client.query(
          "INSERT INTO schema_migrations (filename) VALUES ($1)",
          [file],
        );

        await client.query("COMMIT");
        console.log(`Applied: ${file}`);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }

    console.log("Migration process completed.");
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((error) => {
  console.error("Migration failed:", error.message);
  process.exitCode = 1;
});
