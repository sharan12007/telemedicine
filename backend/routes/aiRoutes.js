const express = require('express');
const router = express.Router();
const { symptomChecker } = require('../controllers/aiController');

// Test route
router.get('/', (req, res) => {
  res.json({ message: 'AI API is working' });
});

// Public routes
router.post('/symptom-checker', symptomChecker);

module.exports = router;