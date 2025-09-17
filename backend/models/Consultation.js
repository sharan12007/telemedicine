const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const consultationSchema = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  status: { 
    type: String, 
    enum: ['requested', 'accepted', 'in_call', 'finished', 'cancelled'], 
    default: 'requested' 
  },
  createdAt: { type: Date, default: Date.now },
  startedAt: Date,
  endedAt: Date,
  signalingRoom: String,
  prescriptionId: { type: Schema.Types.ObjectId, ref: 'Prescription' },
  notes: String,
  recordingUrl: String
});

module.exports = mongoose.model('Consultation', consultationSchema);