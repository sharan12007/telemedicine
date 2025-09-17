const Pharmacy = require('../models/Pharmacy');

const getNearbyPharmacies = async (req, res) => {
  try {
    const { lng, lat, maxDistance = 5000 } = req.query;
    
    if (!lng || !lat) {
      return res.status(400).json({ message: 'Longitude and latitude are required' });
    }
    
    const pharmacies = await Pharmacy.find({
      location: {
        $nearSphere: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(maxDistance)
        }
      }
    }).limit(10);
    
    res.json(pharmacies);
  } catch (error) {
    console.error('Error fetching nearby pharmacies:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getPharmacyDetails = async (req, res) => {
  try {
    const { pharmacyId } = req.params;
    
    const pharmacy = await Pharmacy.findById(pharmacyId);
    
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' });
    }
    
    res.json(pharmacy);
  } catch (error) {
    console.error('Error fetching pharmacy details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getNearbyPharmacies,
  getPharmacyDetails
};