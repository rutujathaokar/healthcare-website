require("dotenv").config();
const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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
  // console.log("Connected to the health_reports database.");
});

// Create 'uploads/' directory if it doesn't exist
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Upload health report
router.post("/upload", upload.single("report"), (req, res) => {
  const { report_name, report_description } = req.body;

  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  const reportData = {
    report_name: req.file.filename,
    report_description,
    report_file: path.join("uploads", req.file.filename),
  };

  db.query(
    "INSERT INTO health_reports (report_name, report_description, report_file) VALUES (?, ?, ?)",
    [reportData.report_name, reportData.report_description, reportData.report_file],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error uploading report");
      }
      res.redirect("/healthreports/thankyou");
    }
  );
});

// List health reports
router.get("/", (req, res) => {
  db.query("SELECT * FROM health_reports ORDER BY created_at DESC", (err, reports) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error fetching reports");
    }
    res.render("healthreport/index", { reports });
  });
});

// Download health report
router.get("/download/:id", (req, res) => {
  const reportId = req.params.id;

  db.query("SELECT * FROM health_reports WHERE id = ?", [reportId], (err, results) => {
    if (err) {
      return res.status(500).send("Error fetching report");
    }

    if (results.length === 0) {
      return res.status(404).send("Report not found");
    }

    const report = results[0];
    const filePath = path.join(__dirname, "../", report.report_file);

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).send("File not found");
      }
      res.download(filePath, report.report_name, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error downloading file");
        }
      });
    });
  });
});

// Thank You Page
router.get("/thankyou", (req, res) => {
  res.render("healthreport/thankyou");
});

module.exports = router;
