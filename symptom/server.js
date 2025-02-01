const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('symptom/symptom', { diseases: [] }); // Render the symptom checker with no results initially
});

router.post('/check', (req, res) => {
    let symptoms = req.body.symptoms || []; // Default to an empty array if undefined
    if (!Array.isArray(symptoms)) {
        symptoms = [symptoms]; // Convert a single string to an array
    }
    const diseases = matchDiseases(symptoms); // Get possible diseases based on symptoms
    res.render('symptom/symptom', { diseases }); // Render results to the same EJS
});

router.get('/appointment', (req, res) => {
    res.render('appointment/appointment'); // Render the "Consult a Doctor" page
});

// Disease matching logic
function matchDiseases(symptoms) {
    const conditions = {
        'Fever': ['Flu', 'COVID-19', 'Dengue'],
        'Cough': ['Bronchitis', 'Asthma', 'Common Cold'],
        'Headache': ['Migraine', 'Tension Headache'],
        'Fatigue': ['Anemia', 'Diabetes', 'Chronic Fatigue Syndrome'],
        'Sore Throat': ['Strep Throat', 'Common Cold', 'Flu'],
        'Shortness of Breath': ['Asthma', 'COVID-19', 'Pneumonia'],
        'Chest Pain': ['Heart Attack', 'Pneumonia', 'GERD'],
        'Nausea': ['Food Poisoning', 'Pregnancy', 'Gastritis'],
        'Vomiting': ['Food Poisoning', 'Gastritis', 'Appendicitis'],
        'Diarrhea': ['Food Poisoning', 'IBS', 'Infection'],
        'Constipation': ['IBS', 'Dehydration', 'Hypothyroidism'],
        'Joint Pain': ['Arthritis', 'Rheumatoid Arthritis', 'Osteoarthritis'],
        'Back Pain': ['Sciatica', 'Herniated Disc', 'Spondylosis'],
        'Dizziness': ['Vertigo', 'Low Blood Pressure', 'Dehydration'],
        'Swelling': ['Edema', 'Lymphedema', 'Injury'],
        'Blurred Vision': ['Diabetes', 'Migraines', 'Cataracts'],
        'Leg Pain': ['Varicose Veins', 'Sciatica', 'Peripheral Artery Disease'],
        'Hearing Loss': ['Ear Infection', 'Age-related Hearing Loss', 'Meniere’s Disease'],
        'Abdominal Pain': ['Gastritis', 'Appendicitis', 'Ulcer'],
        'Night Sweats': ['Tuberculosis', 'Cancer', 'Menopause'],
        'Loss of Appetite': ['Depression', 'Anorexia', 'Gastrointestinal Issues'],
        'Insomnia': ['Anxiety', 'Depression', 'Sleep Apnea'],
        // Add more conditions as needed
    };

    const suggestedDiseases = new Set();
    symptoms.forEach(symptom => {
        if (conditions[symptom]) {
            conditions[symptom].forEach(disease => suggestedDiseases.add(disease));
        }
    });

    return Array.from(suggestedDiseases); // Convert Set to Array
}

module.exports = router;
