const Consultation = require('../models/Consultation');
const Prescription = require('../models/Prescription');
const { getIO } = require('../services/socketService');

const requestConsultation = async (req, res) => {
  try {
    const { doctorId, reason, preferredMode } = req.body;
    const patientId = req.user.id;
    
    const consultation = new Consultation({
      patientId,
      doctorId,
      status: 'requested',
      notes: reason
    });
    
    await consultation.save();
    
    // Emit socket event to doctor
    const io = getIO();
    io.to(doctorId).emit('call:request', {
      consultationId: consultation._id,
      patientId,
      patientName: req.user.name,
      reason,
      preferredMode
    });
    
    res.status(201).json({
      message: 'Consultation requested successfully',
      consultation
    });
  } catch (error) {
    console.error('Error requesting consultation:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const acceptConsultation = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const doctorId = req.user.id;
    
    const consultation = await Consultation.findById(consultationId);
    
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }
    
    if (consultation.doctorId.toString() !== doctorId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    consultation.status = 'accepted';
    consultation.startedAt = new Date();
    consultation.signalingRoom = `room-${consultationId}`;
    
    await consultation.save();
    
    // Emit socket event to patient
    const io = getIO();
    io.to(consultation.patientId.toString()).emit('call:accepted', {
      consultationId,
      signalingRoom: consultation.signalingRoom
    });
    
    res.json({
      message: 'Consultation accepted',
      consultation
    });
  } catch (error) {
    console.error('Error accepting consultation:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const endConsultation = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const { notes } = req.body;
    const userId = req.user.id;
    
    const consultation = await Consultation.findById(consultationId);
    
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }
    
    if (consultation.doctorId.toString() !== userId && 
        consultation.patientId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    consultation.status = 'finished';
    consultation.endedAt = new Date();
    if (notes) consultation.notes = notes;
    
    await consultation.save();
    
    // Emit socket event to both parties
    const io = getIO();
    io.to(consultation.doctorId.toString()).emit('call:ended', {
      consultationId
    });
    io.to(consultation.patientId.toString()).emit('call:ended', {
      consultationId
    });
    
    res.json({
      message: 'Consultation ended',
      consultation
    });
  } catch (error) {
    console.error('Error ending consultation:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getConsultationHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    
    let query = {};
    if (role === 'patient') {
      query.patientId = userId;
    } else if (role === 'doctor') {
      query.doctorId = userId;
    }
    
    const consultations = await Consultation.find(query)
      .populate('patientId', 'name patientId')
      .populate('doctorId', 'name specialties')
      .populate('prescriptionId')
      .sort({ createdAt: -1 });
    
    res.json(consultations);
  } catch (error) {
    console.error('Error fetching consultation history:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  requestConsultation,
  acceptConsultation,
  endConsultation,
  getConsultationHistory
};