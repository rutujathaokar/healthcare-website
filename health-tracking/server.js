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
  if (err) throw err;
  // console.log("Connected to the health tracking database.");
});

// Serve Health Tracking Form
router.get("/", (req, res) => {
  res.render("health-tracking/health-tracking"); // Ensure this points to the correct ejs file
});

// Handle Health Tracking Data Submission
router.post("/", (req, res) => {
  const { steps, water, calories, heart_rate } = req.body;
  const userId = req.session.user ? req.session.user.id : null; // Optional user association

  // Validate data
  if (!steps || steps <= 0 || !water || water <= 0 || !calories || calories <= 0 || !heart_rate || heart_rate <= 0) {
    return res.status(400).send("Invalid input values.");
  }

  // Save data to the database
  db.query(
    "INSERT INTO health_tracking (steps, water, calories, heart_rate, created_at) VALUES (?, ?, ?, ?, NOW())",
    [steps, water, calories, heart_rate],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error saving health tracking data.");
      }

      // Check for health alerts (Heart Rate Alert Example)
      let healthAlert = null;
      if (heart_rate < 60) {
        healthAlert = "Low heart rate detected. Please consult a doctor.";
      } else if (heart_rate > 100) {
        healthAlert = "High heart rate detected. Please consult a doctor.";
      }

      // Redirect to health-tracking-report page with the data and alert
      res.redirect(`/health-tracking/health-tracking-report?steps=${steps}&water=${water}&calories=${calories}&heart_rate=${heart_rate}&alert=${healthAlert}`);
    }
  );
});

// Serve Health Tracking Report
router.get("/health-tracking-report", (req, res) => {
  const { steps, water, calories, heart_rate, alert } = req.query;

  // Render the report page with the data
  res.render("health-tracking/health-tracking-report", {
    steps,
    water,
    calories,
    heart_rate,
    alert,
  });
});

module.exports = router;
