const express = require("express");
const router = express.Router();

// Extended data for medicines with more details
const medicines = [
  {
    id: 1,
    name: "Paracetamol",
    price: 50,
    description: "A commonly used medicine to reduce pain and fever. Suitable for mild to moderate headaches, muscle pain, or colds.",
    dosage: "500 mg every 4-6 hours as needed. Maximum 4g per day.",
    side_effects: "Nausea, liver damage (if overdosed), allergic reactions."
  },
  {
    id: 2,
    name: "Amoxicillin",
    price: 120,
    description: "An antibiotic used to treat various bacterial infections, including pneumonia and throat infections.",
    dosage: "250 mg to 500 mg every 8 hours.",
    side_effects: "Rash, nausea, vomiting, diarrhea."
  },
  {
    id: 3,
    name: "Ibuprofen",
    price: 70,
    description: "A non-steroidal anti-inflammatory drug (NSAID) used for pain relief, fever reduction, and anti-inflammatory effects.",
    dosage: "200 mg to 400 mg every 4-6 hours. Maximum 1,200 mg per day.",
    side_effects: "Stomach upset, dizziness, gastrointestinal bleeding, kidney problems."
  },
  {
    id: 4,
    name: "Cetirizine",
    price: 40,
    description: "An antihistamine commonly used to treat allergies, hay fever, and itching.",
    dosage: "10 mg once a day, usually in the evening.",
    side_effects: "Drowsiness, dry mouth, headache."
  },
  {
    id: 5,
    name: "Aspirin",
    price: 80,
    description: "Used as a pain reliever and to reduce the risk of heart attacks by thinning the blood.",
    dosage: "300 mg to 600 mg every 4-6 hours for pain relief. For heart attack prevention, typically 81 mg daily.",
    side_effects: "Stomach ulcers, gastrointestinal bleeding, nausea, ringing in the ears."
  },
  {
    id: 6,
    name: "Metformin",
    price: 150,
    description: "A first-line medication for managing type 2 diabetes by controlling blood sugar levels.",
    dosage: "500 mg to 2,000 mg per day in divided doses.",
    side_effects: "Nausea, diarrhea, lactic acidosis (rare)."
  },
  {
    id: 7,
    name: "Losartan",
    price: 200,
    description: "A medication used to treat high blood pressure and help prevent strokes.",
    dosage: "50 mg to 100 mg once daily.",
    side_effects: "Dizziness, fatigue, low blood pressure, high potassium levels."
  },
  {
    id: 8,
    name: "Omeprazole",
    price: 90,
    description: "A proton pump inhibitor that reduces stomach acid production to treat acid reflux and ulcers.",
    dosage: "20 mg once daily before a meal.",
    side_effects: "Headache, abdominal pain, nausea, risk of bone fractures (long-term use)."
  },
  {
    id: 9,
    name: "Cough Syrup",
    price: 60,
    description: "A general syrup used to soothe irritation and reduce coughing symptoms, especially during colds.",
    dosage: "10 ml every 4-6 hours as needed.",
    side_effects: "Drowsiness, dizziness, nausea."
  },
  {
    id: 10,
    name: "Azithromycin",
    price: 250,
    description: "An antibiotic used for treating a wide range of bacterial infections, including respiratory and skin infections.",
    dosage: "500 mg on the first day, followed by 250 mg once daily for 4 more days.",
    side_effects: "Nausea, diarrhea, abdominal pain, dizziness."
  },
  {
    id: 11,
    name: "Doxycycline",
    price: 180,
    description: "An antibiotic used to treat infections such as pneumonia, acne, and Lyme disease.",
    dosage: "100 mg to 200 mg daily.",
    side_effects: "Photosensitivity (sensitivity to sunlight), nausea, vomiting, diarrhea."
  },
  {
    id: 12,
    name: "Hydroxychloroquine",
    price: 300,
    description: "Primarily used for preventing and treating malaria and autoimmune conditions like lupus.",
    dosage: "400 mg once daily for malaria, usually in combination with other medications.",
    side_effects: "Headache, nausea, blurred vision, risk of heart issues with prolonged use."
  },
  {
    id: 13,
    name: "Clotrimazole",
    price: 70,
    description: "An antifungal cream used to treat fungal infections like athlete's foot and ringworm.",
    dosage: "Apply to the affected area 2-3 times daily for 2-4 weeks.",
    side_effects: "Burning, irritation, or redness at the application site."
  },
  {
    id: 14,
    name: "Salbutamol",
    price: 150,
    description: "A bronchodilator inhaler used for quick relief of asthma symptoms and breathing issues.",
    dosage: "1 to 2 puffs every 4-6 hours as needed for relief.",
    side_effects: "Tremors, headache, fast heart rate."
  },
  {
    id: 15,
    name: "Vitamin C Tablets",
    price: 50,
    description: "Used as a dietary supplement to boost immunity and prevent scurvy.",
    dosage: "500 mg to 1,000 mg daily.",
    side_effects: "Stomach upset, kidney stones (in high doses)."
  },
  {
    id: 16,
    name: "Levothyroxine",
    price: 100,
    description: "Prescribed for treating hypothyroidism to replace the thyroid hormone deficiency.",
    dosage: "25 mcg to 200 mcg once daily.",
    side_effects: "Increased heart rate, sweating, weight loss, insomnia."
  },
  {
    id: 17,
    name: "Warfarin",
    price: 250,
    description: "An anticoagulant used to prevent and treat blood clots.",
    dosage: "Typically 5 mg daily, adjusted based on blood clotting tests.",
    side_effects: "Bleeding, easy bruising, stomach upset."
  },
  {
    id: 18,
    name: "Insulin",
    price: 500,
    description: "A hormone injected to manage blood sugar levels in people with diabetes.",
    dosage: "Dosage varies based on blood sugar levels, typically administered multiple times per day.",
    side_effects: "Low blood sugar, weight gain, allergic reactions."
  },
  {
    id: 19,
    name: "Antacid Syrup",
    price: 60,
    description: "Provides relief from acidity, indigestion, and heartburn.",
    dosage: "10 ml 3-4 times a day after meals.",
    side_effects: "Constipation, diarrhea, stomach cramps."
  },
  {
    id: 20,
    name: "Loratadine",
    price: 45,
    description: "An antihistamine used to treat allergies, runny nose, and itchy skin.",
    dosage: "10 mg once daily.",
    side_effects: "Headache, drowsiness (in some people)."
  },
];

// Route to display the medicines
router.get("/", (req, res) => {
  res.render("medicines/medicine", { medicines });
});

// Export the router to be used in the main application
module.exports = router;
