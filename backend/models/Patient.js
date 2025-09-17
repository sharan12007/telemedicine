const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const patientSchema = new Schema({
  patientId: { 
    type: String, 
    unique: true, 
    required: true 
  },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  firebaseUid: { type: String, required: true, unique: true },
  qrJwt: { type: String },
  profile: {
    dob: Date,
    gender: { type: String, enum: ['male', 'female', 'other'] },
    address: String,
    allergies: [String],
    bloodGroup: String
  },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
  },
  healthRecords: [{ type: Schema.Types.ObjectId, ref: 'HealthRecord' }],
  activeSession: {
    socketId: String,
    lastSeen: Date
  },
  preferences: {
    notifyBy: [{ type: String, enum: ['push', 'email'] }],
    offlineSync: { type: Boolean, default: true }
  }
}, { timestamps: true });

patientSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Patient', patientSchema);