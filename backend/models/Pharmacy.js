const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pharmacySchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
  },
  hours: [{
    day: { type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
    open: String,
    close: String
  }],
  services: [String],
  rating: { type: Number, min: 0, max: 5, default: 0 },
  website: String,
  acceptsInsurance: { type: Boolean, default: true }
}, { timestamps: true });

pharmacySchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Pharmacy', pharmacySchema);