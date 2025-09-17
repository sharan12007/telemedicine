const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
  name: { type: String, required: true },
  specialties: [String],
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
  },
  status: { 
    type: String, 
    enum: ['available', 'busy', 'offline'], 
    default: 'offline' 
  },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  currentLoad: { type: Number, default: 0 },
  workingHours: [{
    day: { type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
    startTime: String,
    endTime: String
  }],
  contact: {
    email: String,
    phone: String
  }
}, { timestamps: true });

doctorSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Doctor', doctorSchema);