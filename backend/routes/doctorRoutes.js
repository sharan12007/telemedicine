const express = require('express');
const router = express.Router();
const {
  getDoctorProfile,
  updateDoctorStatus,
  updateDoctorLocation,
  getNearbyDoctors
} = require('../controllers/doctorController');
const auth = require('../middleware/auth');

router.get('/profile', auth, getDoctorProfile);
router.patch('/status', auth, updateDoctorStatus);
router.patch('/location', auth, updateDoctorLocation);
router.get('/nearby', getNearbyDoctors);

module.exports = router;