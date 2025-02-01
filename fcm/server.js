const express = require('express');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2'); // Import the mysql2 library

const router = express.Router();

// Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Path to the "fcm" file inside the "fcm" folder (If you're working with a file that needs reading/writing)
const filePath = path.join(__dirname, 'fcm');

// Route to read the "fcm" file
router.get('/', (req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.status(404).send('FCM file not found');
      } else {
        console.error('Error reading the fcm file:', err);
        return res.status(500).send('Error reading the fcm file');
      }
    }
    res.render('fcm/index', { content: data }); // Render the index.ejs page
  });
});

// Route to handle the search form and render results from the database
router.post('/search', (req, res) => {
  const { location } = req.body; // User input: location

  if (!location) {
    return res.status(400).send('Location is required');
  }

  // Query to fetch clinics that match the location, including latitude and longitude
  const query = 'SELECT id, name, address, phone, services, free_checkup_date, free_checkup_timings, latitude, longitude FROM clinics WHERE address LIKE ?';

  db.execute(query, [`%${location}%`], (err, results) => {
    if (err) {
      console.error('Error fetching clinics from database:', err);
      return res.status(500).send('Error fetching clinics from database');
    }

    // If no clinics are found, pass an empty array or a message
    const clinics = results.length > 0 ? results : [];
    const searchResults = clinics.length === 0 ? 'No clinics found for the given location' : null;

    res.render('fcm/results', { clinics, searchResults });
  });
});

// Route to display the booking form
router.get('/book', (req, res) => {
  const { clinicId } = req.query;

  if (!clinicId) {
    return res.status(400).send('Clinic ID is required');
  }

  // Fetch clinic details for booking form
  const query = 'SELECT * FROM clinics WHERE id = ?';

  db.execute(query, [clinicId], (err, results) => {
    if (err) {
      console.error('Error fetching clinic details:', err);
      return res.status(500).send('Error fetching clinic details');
    }

    if (results.length > 0) {
      res.render('fcm/booking', { clinic: results[0] });
    } else {
      res.status(404).send('Clinic not found');
    }
  });
});

// Route to handle appointment booking
router.post('/book', (req, res) => {
  const { clinicId, name, contact, preferredDate, preferredTime } = req.body;

  if (!clinicId || !name || !contact || !preferredDate || !preferredTime) {
    return res.status(400).send('All fields are required');
  }

  const query = 'INSERT INTO appointments (clinic_id, name, contact, preferred_date, preferred_time) VALUES (?, ?, ?, ?, ?)';

  db.execute(query, [clinicId, name, contact, preferredDate, preferredTime], (err) => {
    if (err) {
      console.error('Error booking appointment:', err);
      return res.status(500).send('Error booking appointment');
    }
    res.send('Appointment booked successfully!');
  });
});

module.exports = router;
