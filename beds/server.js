require("dotenv").config();
const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

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
    process.exit(1);
  }
//   console.log("Connected to the hospital beds database.");
});

// Render Beds page
router.get("/", (req, res) => {
  res.render("beds/index", { results: [], error: null });
});

// Handle Search for Bed Availability
router.post("/search", (req, res) => {
  const { location } = req.body;

  if (!location || location.trim() === "") {
    return res.render("beds/index", {
      results: [],
      error: "Please provide a location to search.",
    });
  }

  const query = `
    SELECT hospital_name, location, available_beds 
    FROM HospitalBeds 
    WHERE location = ? AND available_beds > 0
  `;

  db.query(query, [location], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.render("beds/index", {
        results: [],
        error: "An error occurred while fetching data. Please try again later.",
      });
    }

    if (results.length === 0) {
      return res.render("beds/index", {
        results: [],
        error: `No available beds found for the location "${location}".`,
      });
    }

    res.render("beds/index", { results, error: null });
  });
});

module.exports = router;
