const Doctor = require('../models/Doctor');

const findNearbyDoctors = async (lng, lat, maxDistance = 10000, specialty = null) => {
  const query = {
    location: {
      $nearSphere: {
        $geometry: { type: 'Point', coordinates: [lng, lat] },
        $maxDistance: maxDistance
      }
    },
    status: 'available'
  };

  if (specialty) {
    query.specialties = { $in: [specialty] };
  }

  return await Doctor.find(query).limit(10);
};

const calculateDistance = (coord1, coord2) => {
  // Simplified distance calculation (in meters)
  const R = 6371e3; // Earth radius in meters
  const φ1 = coord1[1] * Math.PI/180;
  const φ2 = coord2[1] * Math.PI/180;
  const Δφ = (coord2[1]-coord1[1]) * Math.PI/180;
  const Δλ = (coord2[0]-coord1[0]) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
};

const scoreDoctors = (doctors, patientLocation) => {
  return doctors.map(doctor => {
    const distance = calculateDistance(
      patientLocation, 
      doctor.location.coordinates
    );
    
    // Scoring algorithm
    const distanceScore = 1 / (distance / 1000); // Higher for closer doctors
    const ratingScore = doctor.rating;
    const loadScore = 1 / (doctor.currentLoad + 1); // Higher for less loaded doctors
    
    const totalScore = distanceScore * 0.5 + ratingScore * 0.3 + loadScore * 0.2;
    
    return {
      ...doctor.toObject(),
      distance: Math.round(distance),
      score: totalScore
    };
  }).sort((a, b) => b.score - a.score);
};

module.exports = { findNearbyDoctors, scoreDoctors };