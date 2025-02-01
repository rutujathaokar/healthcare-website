require("dotenv").config(); // Load environment variables
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const session = require("express-session");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Use environment variable
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware to make user session available globally in views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
    process.exit(1); // Stop the server if the database connection fails
  }
  console.log("Connected to the main database.");
});

// Import modular routers
const medicinedelivery = require("./medicinedelivery/server");
const fcm = require("./fcm/server");
const labs = require("./labs/server");
const beds = require("./beds/server");
const healthreport = require("./healthreport/server");
const healthTracking = require("./health-tracking/server");
const appointments = require("./appointments/server");
const symptom = require("./symptom/server");
const medicines = require("./medicines/server");

// Use modular routes
app.use("/medicinedelivery", medicinedelivery);
app.use("/fcm", fcm);
app.use("/labs", labs);
app.use("/beds", beds);
app.use("/healthreports", healthreport);
app.use("/health-tracking", healthTracking);
app.use("/appointments", appointments);
app.use("/symptom", symptom);
app.use("/medicines", medicines);

// Main Home Route
app.get("/", (req, res) => {
  db.query("SELECT * FROM reviews ORDER BY created_at DESC", (err, reviews) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error fetching reviews");
    }
    res.render("index", { reviews });
  });
});

// Login Routes
app.get("/login", (req, res) => res.render("login"));
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Database error");
    }
    if (results.length === 0) {
      return res.status(401).send("Invalid email or password");
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(401).send("Invalid email or password");

    req.session.user = { id: user.id, name: user.name };
    res.redirect("/");
  });
});

// Signup Routes
app.get("/signup", (req, res) => res.render("signup"));
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error signing up");
      }
      res.redirect("/login");
    }
  );
});

// Logout Route
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

// Review Routes
app.post("/submit-review", (req, res) => {
  const { review } = req.body;
  const userId = req.session.user ? req.session.user.id : null;
  const userName = req.session.user ? req.session.user.name : "Anonymous";

  db.query(
    "INSERT INTO reviews (name, review_text, user_id, created_at) VALUES (?, ?, ?, NOW())",
    [userName, review, userId],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error submitting review");
      }
      res.redirect("/");
    }
  );
});

// Route Not Found (404) Middleware
app.use((req, res) => {
  res.status(404).send("404 - Page Not Found");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
