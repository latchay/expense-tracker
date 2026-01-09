require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

// =======================
// Supabase setup
// =======================
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// =======================
// Auth middleware
// =======================
const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "No token" });

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// =======================
// Register
// =======================
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email & password required" });

  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (existing)
    return res.status(400).json({ message: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);

  const { error } = await supabase.from("users").insert({
    email,
    password: hashed,
  });

  if (error) return res.status(500).json({ message: error.message });

  res.json({ message: "User registered successfully" });
});

// =======================
// Login
// =======================
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (!user)
    return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token });
});

// =======================
// Current user
// =======================
app.get("/api/me", auth, async (req, res) => {
  res.json({ id: req.user.id, email: req.user.email });
});

// =======================
// Get expenses
// =======================
app.get("/api/expenses", auth, async (req, res) => {
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", req.user.id)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

// =======================
// Add expense
// =======================
app.post("/api/expenses", auth, async (req, res) => {
  const { amount, category } = req.body;

  const { error } = await supabase.from("expenses").insert({
    amount,
    category,
    user_id: req.user.id,
  });

  if (error) return res.status(500).json({ message: error.message });
  res.json({ message: "Expense added" });
});

// =======================
// Delete expense
// =======================
app.delete("/api/expenses/:id", auth, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id)
    .eq("user_id", req.user.id);

  if (error) return res.status(500).json({ message: error.message });
  res.json({ message: "Expense deleted" });
});

// =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
