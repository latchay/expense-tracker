require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");

const app = express();

/* =========================
   Middleware
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   Database (Supabase Postgres)
========================= */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

/* ✅ Verify DB connection at startup */
(async () => {
  try {
    await pool.query("SELECT 1");
    console.log("Database connected ✅");
  } catch (err) {
    console.error("Database connection FAILED ❌");
    console.error(err.message);
    process.exit(1);
  }
})();

/* =========================
   Auth Middleware
========================= */
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: "Missing token" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

/* =========================
   ROUTES
========================= */

/* -------- REGISTER -------- */
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  try {
    const existing = await pool.query(
      "SELECT id FROM users WHERE email=$1",
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2)",
      [email, hashed]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* -------- LOGIN -------- */
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* -------- CURRENT USER -------- */
app.get("/api/me", auth, async (req, res) => {
  res.json({ id: req.user.id, email: req.user.email });
});

/* -------- ADD EXPENSE -------- */
app.post("/api/expenses", auth, async (req, res) => {
  const { amount, category } = req.body;

  if (!amount || !category) {
    return res.status(400).json({ message: "Amount and category required" });
  }

  try {
    await pool.query(
      "INSERT INTO expenses (user_id, amount, category) VALUES ($1, $2, $3)",
      [req.user.id, amount, category]
    );

    res.status(201).json({ message: "Expense added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* -------- GET EXPENSES -------- */
app.get("/api/expenses", auth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, amount, category, created_at FROM expenses WHERE user_id=$1 ORDER BY created_at DESC",
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* -------- DELETE EXPENSE -------- */
app.delete("/api/expenses/:id", auth, async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM expenses WHERE id=$1 AND user_id=$2",
      [req.params.id, req.user.id]
    );

    res.json({ message: "Expense deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
