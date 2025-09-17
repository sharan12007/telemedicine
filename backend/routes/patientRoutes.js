const express = require('express');
const router = express.Router();
const {
  getPatientProfile,
  updatePatientLocation,
  getPatientQR,
  createPatient
} = require('../controllers/patientController');
const auth = require('../middleware/auth');

router.get('/me', auth, getPatientProfile);
router.patch('/location', auth, updatePatientLocation);
router.get('/me/qr', auth, getPatientQR);
router.post('/', createPatient);

module.exports = router;