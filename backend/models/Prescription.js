const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const prescriptionSchema = new Schema({
  consultationId: { type: Schema.Types.ObjectId, ref: 'Consultation', required: true },
  medicines: [{
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: String, required: true },
    instructions: String
  }],
  issuedByDoctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  issuedToPatientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  issuedAt: { type: Date, default: Date.now },
  pharmacyForwardedTo: { type: Schema.Types.ObjectId, ref: 'Pharmacy' },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);