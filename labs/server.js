const express = require("express");
const mysql = require("mysql2");
const router = express.Router();

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Route to fetch labs based on city
router.get("/", (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).render("labs/index", {
      error: "City is required", // Render with error message
      labs: [], // Empty labs array
    });
  }

  db.query(
    "SELECT * FROM labs WHERE city = ?",
    [city],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).render("labs/index", {
          error: "Error fetching labs", // Render with error message
          labs: [], // Empty labs array
        });
      }
      if (results.length === 0) {
        return res.status(404).render("labs/index", {
          error: "No labs found for the entered city", // Render with no labs found message
          labs: [], // Empty labs array
        });
      }
      
      // Render the labs page with fetched labs
      res.render("labs/index", {
        error: null, // No error
        labs: results, // Pass fetched labs to the view
      });
    }
  );
});

module.exports = router; // Export router
