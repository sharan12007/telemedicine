const auth = require('../config/firebase');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const jwt = require('jsonwebtoken');
const { generatePatientId } = require('../utils/generateId');
const { generateQRToken } = require('../services/qrService');

const verifyFirebaseToken = async (req, res) => {
  try {
    const { idToken, role } = req.body;
    
    // Verify the Firebase ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    
    let user;
    let tokenPayload;
    
    if (role === 'patient') {
      // Check if patient exists
      user = await Patient.findOne({ firebaseUid: uid });
      
      if (!user) {
        // Create new patient
        const patientId = generatePatientId();
        const qrToken = generateQRToken(patientId);
        
        user = new Patient({
          patientId,
          firebaseUid: uid,
          name: decodedToken.name || '',
          email: decodedToken.email || '',
          phone: decodedToken.phone_number || '',
          qrJwt: qrToken,
          location: {
            type: 'Point',
            coordinates: [0, 0]
          }
        });
        
        await user.save();
      }
      
      tokenPayload = {
        id: user._id,
        role: 'patient',
        patientId: user.patientId
      };
    } else if (role === 'doctor') {
      // Check if doctor exists
      user = await Doctor.findOne({ firebaseUid: uid });
      
      if (!user) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
      
      tokenPayload = {
        id: user._id,
        role: 'doctor'
      };
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    // Create JWT token
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.json({
      token,
      user
    });
  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { verifyFirebaseToken };