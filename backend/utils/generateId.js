const crypto = require('crypto');

// Generate unique patient ID
const generatePatientId = () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(2, 10).replace(/-/g, ''); // YYMMDD
  const randomBytes = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `PAT-${dateStr}-${randomBytes}`;
};

// Generate unique consultation ID
const generateConsultationId = () => {
  return `CONS-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`.toUpperCase();
};

module.exports = {
  generatePatientId,
  generateConsultationId
};