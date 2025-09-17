const express = require('express');
const router = express.Router();
const { verifyFirebaseToken } = require('../controllers/authController');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/verify-firebase-token', authLimiter, verifyFirebaseToken);

module.exports = router;