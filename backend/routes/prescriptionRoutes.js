const express = require('express');
const router = express.Router();
const {
  createPrescription,
  getPrescription,
  forwardPrescription
} = require('../controllers/prescriptionController');
const auth = require('../middleware/auth');

router.post('/', auth, createPrescription);
router.get('/:prescriptionId', auth, getPrescription);
router.patch('/forward', auth, forwardPrescription);

module.exports = router;