const express = require('express');
const router = express.Router();
const {
  requestConsultation,
  acceptConsultation,
  endConsultation,
  getConsultationHistory
} = require('../controllers/consultationController');
const auth = require('../middleware/auth');

router.post('/', auth, requestConsultation);
router.patch('/:consultationId/accept', auth, acceptConsultation);
router.patch('/:consultationId/end', auth, endConsultation);
router.get('/history', auth, getConsultationHistory);

module.exports = router;