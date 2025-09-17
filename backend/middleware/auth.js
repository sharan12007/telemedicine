const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    let user;
    if (decoded.role === 'patient') {
      user = await Patient.findById(decoded.id);
    } else if (decoded.role === 'doctor') {
      user = await Doctor.findById(decoded.id);
    }
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
    
    req.user = {
      id: user._id,
      role: decoded.role,
      ...user.toObject()
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;