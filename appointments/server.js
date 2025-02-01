const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const nodemailer = require("nodemailer");
require("dotenv").config(); // Load environment variables

// Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
    process.exit(1);
  }
  console.log("Connected to the health database.");
});

// Configure Nodemailer for email functionality
const transporter = nodemailer.createTransport({
  service: "Gmail", // Or another email service
  auth: {
    user: process.env.EMAIL_USER || "mansidurbule@gmail.com", // Replace with your email
    pass: process.env.EMAIL_PASS || "ceuo ljjt zkrt optc", // Replace with your email password
  },
});

// Redirect `/appointments` to `/appointments/book-appointment`
router.get("/", (req, res) => {
  res.redirect("/appointments/book-appointment");
});

// Serve the Book Appointment Form
router.get("/book-appointment", (req, res) => {
  db.query("SELECT * FROM doctors", (err, doctors) => {
    if (err) {
      console.error("Error fetching doctors:", err.message);
      return res.status(500).send("Error fetching doctors.");
    }

    res.render("appointments/book-appointment", {
      doctors,
      name: "",
      email: "",
      phone: "",
      doctor: "",
      selectedDoctor: "",
      appointment_date: "",
      appointment_time: "",
      symptoms: "",
      error: null,
    });
  });
});

// Handle Appointment Booking
router.post("/book-appointment", (req, res) => {
  const { doctor, name, email, phone, appointment_date, appointment_time, symptoms } = req.body;

  // Validate required fields
  if (!doctor || !name || !email || !phone || !appointment_date || !appointment_time || !symptoms) {
    return db.query("SELECT * FROM doctors", (err, doctors) => {
      if (err) {
        console.error("Error fetching doctors:", err.message);
        return res.status(500).send("Error fetching doctors.");
      }

      res.render("appointments/book-appointment", {
        doctors,
        name,
        email,
        phone,
        doctor,
        selectedDoctor: doctor || "",
        appointment_date,
        appointment_time,
        symptoms,
        error: "All fields are required.",
      });
    });
  }

  // Save appointment to the database
  db.query(
    "INSERT INTO appointments (doctor, name, email, phone, appointment_date, appointment_time, symptoms) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [doctor, name, email, phone, appointment_date, appointment_time, symptoms],
    (err) => {
      if (err) {
        console.error("Error booking appointment:", err.message);
        return res.status(500).send("Error booking appointment.");
      }

      console.log("Appointment booked successfully.");

      // Send confirmation email
      const mailOptions = {
        from: process.env.EMAIL_USER || "mansidurbule@gmail.com", // Replace with your email
        to: email,
        subject: "Appointment Confirmation",
        html: `
          <h2>Appointment Confirmation</h2>
          <p>Dear ${name},</p>
          <p>Your appointment has been successfully booked with  ${doctor}.</p>
          <ul>
            <li><strong>Date:</strong> ${appointment_date}</li>
            <li><strong>Time:</strong> ${appointment_time}</li>
            <li><strong>Symptoms:</strong> ${symptoms}</li>
          </ul>
          <p>Thank you for choosing our service!</p>
        `,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error("Error sending email:", err.message);
        } else {
          console.log("Email sent:", info.response);
        }
      });

      res.redirect("/appointments/book-appointment-success");
    }
  );
});

// Serve Appointment Success Page
router.get("/book-appointment-success", (req, res) => {
  res.render("appointments/book-appointment-success");
});

// Export the router
module.exports = router;
