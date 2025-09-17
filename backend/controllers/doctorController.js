const Doctor = require('../models/Doctor');
const { findNearbyDoctors, scoreDoctors } = require('../services/locationService');

const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id);
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json(doctor);
  } catch (error) {
    console.error('Error fetching doctor profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateDoctorStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const doctor = await Doctor.findByIdAndUpdate(
      req.user.id,
      { status },
      { new: true }
    );
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json(doctor);
  } catch (error) {
    console.error('Error updating doctor status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateDoctorLocation = async (req, res) => {
  try {
    const { lng, lat } = req.body;
    
    const doctor = await Doctor.findByIdAndUpdate(
      req.user.id,
      {
        location: {
          type: 'Point',
          coordinates: [lng, lat]
        }
      },
      { new: true }
    );
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json(doctor);
  } catch (error) {
    console.error('Error updating doctor location:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getNearbyDoctors = async (req, res) => {
  try {
    const { lng, lat, maxDistance = 10000, specialty } = req.query;
    
    if (!lng || !lat) {
      return res.status(400).json({ message: 'Longitude and latitude are required' });
    }
    
    const doctors = await findNearbyDoctors(
      parseFloat(lng), 
      parseFloat(lat), 
      parseInt(maxDistance), 
      specialty
    );
    
    const scoredDoctors = scoreDoctors(doctors, [parseFloat(lng), parseFloat(lat)]);
    
    res.json(scoredDoctors);
  } catch (error) {
    console.error('Error fetching nearby doctors:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDoctorProfile,
  updateDoctorStatus,
  updateDoctorLocation,
  getNearbyDoctors
};