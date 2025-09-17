const Patient = require('../models/Patient');
const { generateQRToken, generateQRCode } = require('../services/qrService');
const { generatePatientId } = require('../utils/generateId');

const getPatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id)
      .populate('healthRecords');
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updatePatientLocation = async (req, res) => {
  try {
    const { lng, lat } = req.body;
    
    const patient = await Patient.findByIdAndUpdate(
      req.user.id,
      {
        location: {
          type: 'Point',
          coordinates: [lng, lat]
        }
      },
      { new: true }
    );
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getPatientQR = async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Generate new QR token if expired or missing
    let qrToken = patient.qrJwt;
    if (!qrToken) {
      qrToken = generateQRToken(patient.patientId);
      patient.qrJwt = qrToken;
      await patient.save();
    }
    
    const qrCode = await generateQRCode(qrToken);
    
    res.json({
      qrToken,
      qrCode
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createPatient = async (req, res) => {
  try {
    const { name, email, phone, firebaseUid, dob, gender } = req.body;
    
    // Check if patient already exists
    const existingPatient = await Patient.findOne({ firebaseUid });
    if (existingPatient) {
      return res.status(400).json({ message: 'Patient already exists' });
    }
    
    const patientId = generatePatientId();
    const qrToken = generateQRToken(patientId);
    
    const patient = new Patient({
      patientId,
      name,
      email,
      phone,
      firebaseUid,
      qrJwt: qrToken,
      profile: {
        dob,
        gender
      },
      location: {
        type: 'Point',
        coordinates: [0, 0] // Default location
      }
    });
    
    await patient.save();
    
    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getPatientProfile,
  updatePatientLocation,
  getPatientQR,
  createPatient
};