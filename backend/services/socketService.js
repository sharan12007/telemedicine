const { Server } = require('socket.io');
const redisAdapter = require('socket.io-redis');
const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Consultation = require('../models/Consultation');
const logger = require('../utils/logger');

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  // Redis adapter for horizontal scaling
  io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      let user;
      if (decoded.role === 'patient') {
        user = await Patient.findById(decoded.id);
      } else if (decoded.role === 'doctor') {
        user = await Doctor.findById(decoded.id);
      }
      
      if (!user) {
        return next(new Error('User not found'));
      }
      
      socket.user = user;
      socket.role = decoded.role;
      next();
    } catch (err) {
      logger.error('Socket authentication error:', err);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.user._id} (${socket.role})`);
    
    // Join user to their room
    socket.join(socket.user._id.toString());
    
    // Update active session
    if (socket.role === 'patient') {
      Patient.findByIdAndUpdate(socket.user._id, {
        'activeSession.socketId': socket.id,
        'activeSession.lastSeen': new Date()
      }).exec();
    } else if (socket.role === 'doctor') {
      Doctor.findByIdAndUpdate(socket.user._id, { status: 'available' }).exec();
    }

    // Handle call request
    socket.on('call:request', async (data) => {
      try {
        const { doctorId, reason, preferredMode } = data;
        
        // Create consultation record
        const consultation = new Consultation({
          patientId: socket.user._id,
          doctorId,
          status: 'requested',
          notes: reason
        });
        await consultation.save();
        
        // Notify doctor
        io.to(doctorId).emit('call:request', {
          consultationId: consultation._id,
          patientId: socket.user._id,
          patientName: socket.user.name,
          reason,
          preferredMode
        });
        
        // Acknowledge to patient
        socket.emit('call:request:ack', {
          consultationId: consultation._id,
          status: 'requested'
        });
      } catch (error) {
        logger.error('Error handling call request:', error);
        socket.emit('call:request:error', { message: 'Failed to request call' });
      }
    });

    // Handle call acceptance
    socket.on('call:accept', async (data) => {
      try {
        const { consultationId } = data;
        
        const consultation = await Consultation.findById(consultationId);
        if (!consultation) {
          return socket.emit('call:error', { message: 'Consultation not found' });
        }
        
        // Update consultation status
        consultation.status = 'accepted';
        consultation.startedAt = new Date();
        consultation.signalingRoom = `room-${consultationId}`;
        await consultation.save();
        
        // Notify both parties
        io.to(consultation.patientId.toString()).emit('call:accepted', {
          consultationId,
          signalingRoom: consultation.signalingRoom
        });
        
        socket.emit('call:accepted', {
          consultationId,
          signalingRoom: consultation.signalingRoom
        });
        
        // Join both to signaling room
        socket.join(consultation.signalingRoom);
        io.to(consultation.patientId.toString()).socketsJoin(consultation.signalingRoom);
      } catch (error) {
        logger.error('Error accepting call:', error);
        socket.emit('call:error', { message: 'Failed to accept call' });
      }
    });

    // Handle WebRTC signaling
    socket.on('webrtc:offer', (data) => {
      socket.to(data.room).emit('webrtc:offer', data);
    });
    
    socket.on('webrtc:answer', (data) => {
      socket.to(data.room).emit('webrtc:answer', data);
    });
    
    socket.on('webrtc:iceCandidate', (data) => {
      socket.to(data.room).emit('webrtc:iceCandidate', data);
    });

    // Handle call end
    socket.on('call:end', async (data) => {
      try {
        const { consultationId } = data;
        
        const consultation = await Consultation.findById(consultationId);
        if (!consultation) return;
        
        consultation.status = 'finished';
        consultation.endedAt = new Date();
        await consultation.save();
        
        // Notify both parties
        io.to(consultation.patientId.toString()).emit('call:ended', {
          consultationId
        });
        
        socket.emit('call:ended', {
          consultationId
        });
        
        // Leave signaling room
        socket.leave(consultation.signalingRoom);
        io.in(consultation.signalingRoom).socketsLeave(consultation.signalingRoom);
      } catch (error) {
        logger.error('Error ending call:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.user._id} (${socket.role})`);
      
      if (socket.role === 'doctor') {
        Doctor.findByIdAndUpdate(socket.user._id, { status: 'offline' }).exec();
      }
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = { initializeSocket, getIO };