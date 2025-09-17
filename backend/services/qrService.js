const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');

const generateQRToken = (patientId) => {
  const payload = {
    sub: patientId,
    typ: 'patient_qr',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
  };
  return jwt.sign(payload, process.env.QR_SECRET, { algorithm: 'HS256' });
};

const generateQRCode = async (token) => {
  try {
    return await QRCode.toDataURL(token);
  } catch (err) {
    throw new Error('Failed to generate QR code');
  }
};

const verifyQRToken = (token) => {
  try {
    return jwt.verify(token, process.env.QR_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = { generateQRToken, generateQRCode, verifyQRToken };