const Prescription = require('../models/Prescription');
const Consultation = require('../models/Consultation');
const { getIO } = require('../services/socketService');

const createPrescription = async (req, res) => {
  try {
    const { consultationId, medicines } = req.body;
    const doctorId = req.user.id;
    
    // Verify consultation exists and belongs to this doctor
    const consultation = await Consultation.findById(consultationId);
    
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }
    
    if (consultation.doctorId.toString() !== doctorId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const prescription = new Prescription({
      consultationId,
      medicines,
      issuedByDoctorId: doctorId,
      issuedToPatientId: consultation.patientId
    });
    
    await prescription.save();
    
    // Update consultation with prescription ID
    consultation.prescriptionId = prescription._id;
    await consultation.save();
    
    // Emit socket event to patient
    const io = getIO();
    io.to(consultation.patientId.toString()).emit('prescription:created', {
      prescriptionId: prescription._id,
      consultationId
    });
    
    res.status(201).json({
      message: 'Prescription created successfully',
      prescription
    });
  } catch (error) {
    console.error('Error creating prescription:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getPrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const userId = req.user.id;
    
    const prescription = await Prescription.findById(prescriptionId)
      .populate('issuedByDoctorId', 'name')
      .populate('issuedToPatientId', 'name patientId');
    
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    
    // Check if user is authorized to view this prescription
    if (prescription.issuedToPatientId._id.toString() !== userId && 
        prescription.issuedByDoctorId._id.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(prescription);
  } catch (error) {
    console.error('Error fetching prescription:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const forwardPrescription = async (req, res) => {
  try {
    const { prescriptionId, pharmacyId } = req.body;
    const userId = req.user.id;
    
    const prescription = await Prescription.findById(prescriptionId);
    
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    
    // Only patient can forward prescription
    if (prescription.issuedToPatientId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    prescription.pharmacyForwardedTo = pharmacyId;
    await prescription.save();
    
    res.json({
      message: 'Prescription forwarded to pharmacy',
      prescription
    });
  } catch (error) {
    console.error('Error forwarding prescription:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createPrescription,
  getPrescription,
  forwardPrescription
};