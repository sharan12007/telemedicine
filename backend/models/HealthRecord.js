const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const healthRecordSchema = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  recordType: { 
    type: String, 
    enum: ['diagnosis', 'prescription', 'lab_result', 'vaccination', 'allergy', 'surgery', 'other'],
    required: true 
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor' },
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String
  }],
  tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('HealthRecord', healthRecordSchema);