const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();

// Initialize Express app
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Connect to Database
connectDB();

// Connect to Redis
connectRedis();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Base API route
app.get('/api', (req, res) => {
  res.json({
    message: 'Telemedicine API is running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      patients: '/api/patients',
      doctors: '/api/doctors',
      consultations: '/api/consultations',
      prescriptions: '/api/prescriptions',
      pharmacies: '/api/pharmacies',
      ai: '/api/ai'
    }
  });
});

// Health check endpoint
app.get('/health', async (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database: 'unknown',
      redis: 'unknown'
    }
  };

  // Check MongoDB connection
  try {
    await mongoose.connection.db.admin().ping();
    health.checks.database = 'OK';
  } catch (error) {
    health.checks.database = 'ERROR';
    health.status = 'ERROR';
  }

  // Check Redis connection
  try {
    const redis = require('./config/redis').redisClient;
    await redis.ping();
    health.checks.redis = 'OK';
  } catch (error) {
    health.checks.redis = 'ERROR';
    health.status = 'ERROR';
  }

  const statusCode = health.status === 'OK' ? 200 : 503;
  res.status(statusCode).json(health);
});

// Auth routes
app.get('/api/auth', (req, res) => {
  res.json({ message: 'Auth API is working' });
});

app.post('/api/auth/verify-firebase-token', async (req, res) => {
  try {
    const { idToken, role } = req.body;
    
    // Mock verification - in real implementation, verify with Firebase
    const user = {
      id: 'mock-user-id',
      email: 'user@example.com',
      name: 'John Doe',
      role: role
    };
    
    res.json({
      token: 'mock-jwt-token',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Patient routes
app.get('/api/patients', (req, res) => {
  res.json({ message: 'Patients API is working' });
});

app.get('/api/patients/me', (req, res) => {
  res.json({ 
    patientId: 'PAT-20250916-ABC123',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890'
  });
});

app.patch('/api/patients/location', (req, res) => {
  res.json({ message: 'Location updated successfully' });
});

app.get('/api/patients/me/qr', (req, res) => {
  res.json({ 
    qrToken: 'mock-qr-token',
    patientId: 'PAT-20250916-ABC123'
  });
});

app.post('/api/patients', (req, res) => {
  res.json({ 
    message: 'Patient created successfully',
    patientId: 'PAT-20250916-ABC123'
  });
});

// Doctor routes
app.get('/api/doctors', (req, res) => {
  res.json({ message: 'Doctors API is working' });
});

app.get('/api/doctors/profile', (req, res) => {
  res.json({ 
    name: 'Dr. Jane Smith',
    specialties: ['Cardiology', 'Internal Medicine'],
    status: 'available'
  });
});

app.patch('/api/doctors/status', (req, res) => {
  res.json({ message: 'Status updated successfully' });
});

app.patch('/api/doctors/location', (req, res) => {
  res.json({ message: 'Location updated successfully' });
});

app.get('/api/doctors/nearby', (req, res) => {
  res.json([
    {
      id: 'doc1',
      name: 'Dr. Jane Smith',
      specialties: ['Cardiology'],
      distance: 1200,
      rating: 4.8,
      status: 'available'
    },
    {
      id: 'doc2',
      name: 'Dr. John Doe',
      specialties: ['General Practice'],
      distance: 2500,
      rating: 4.5,
      status: 'busy'
    }
  ]);
});

// Consultation routes
app.get('/api/consultations', (req, res) => {
  res.json({ message: 'Consultations API is working' });
});

app.post('/api/consultations', (req, res) => {
  res.json({ 
    message: 'Consultation requested successfully',
    consultationId: 'CONS-20250916-XYZ789'
  });
});

app.patch('/api/consultations/:consultationId/accept', (req, res) => {
  res.json({ message: 'Consultation accepted successfully' });
});

app.patch('/api/consultations/:consultationId/end', (req, res) => {
  res.json({ message: 'Consultation ended successfully' });
});

app.get('/api/consultations/history', (req, res) => {
  res.json([
    {
      id: 'cons1',
      doctorName: 'Dr. Jane Smith',
      date: '2025-09-15',
      status: 'completed'
    },
    {
      id: 'cons2',
      doctorName: 'Dr. John Doe',
      date: '2025-09-10',
      status: 'completed'
    }
  ]);
});

// Prescription routes
app.get('/api/prescriptions', (req, res) => {
  res.json({ message: 'Prescriptions API is working' });
});

app.post('/api/prescriptions', (req, res) => {
  res.json({ 
    message: 'Prescription created successfully',
    prescriptionId: 'RX-20250916-ABC123'
  });
});

app.get('/api/prescriptions/:prescriptionId', (req, res) => {
  res.json({
    id: 'RX-20250916-ABC123',
    medications: [
      {
        name: 'Ibuprofen',
        dosage: '400mg',
        frequency: 'Every 6 hours',
        duration: '7 days'
      }
    ],
    doctorName: 'Dr. Jane Smith',
    date: '2025-09-16'
  });
});

app.patch('/api/prescriptions/forward', (req, res) => {
  res.json({ message: 'Prescription forwarded successfully' });
});

// Pharmacy routes
app.get('/api/pharmacies', (req, res) => {
  res.json({ message: 'Pharmacies API is working' });
});

app.get('/api/pharmacies/nearby', (req, res) => {
  res.json([
    {
      id: 'pharm1',
      name: 'HealthPlus Pharmacy',
      address: '123 Main St',
      distance: 800,
      rating: 4.7,
      phone: '+1234567890'
    },
    {
      id: 'pharm2',
      name: 'MediCare',
      address: '456 Oak Ave',
      distance: 1500,
      rating: 4.3,
      phone: '+0987654321'
    }
  ]);
});

app.get('/api/pharmacies/:pharmacyId', (req, res) => {
  res.json({
    id: 'pharm1',
    name: 'HealthPlus Pharmacy',
    address: '123 Main St',
    phone: '+1234567890',
    hours: '9:00 AM - 9:00 PM',
    rating: 4.7
  });
});

// AI routes
app.get('/api/ai', (req, res) => {
  res.json({ message: 'AI API is working' });
});

app.post('/api/ai/symptom-checker', (req, res) => {
  res.json({
    possibleConditions: ['Common Cold', 'Flu', 'Allergies'],
    recommendations: [
      'Rest and stay hydrated',
      'Take over-the-counter pain relievers',
      'Monitor your temperature'
    ],
    seekHelp: 'Seek immediate medical attention if you experience difficulty breathing, chest pain, or high fever that persists for more than 3 days.'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Error handling middleware
app.use(errorHandler);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle authentication
  socket.on('auth', (token) => {
    // In a real implementation, verify the token
    socket.userId = 'mock-user-id';
    socket.role = 'patient'; // or 'doctor'
    console.log('User authenticated:', socket.userId);
  });

  // Handle call requests
  socket.on('call:request', (data) => {
    console.log('Call request:', data);
    // Broadcast to the target user
    io.emit('call:request', {
      from: socket.userId,
      to: data.doctorId,
      reason: data.reason
    });
  });

  // Handle call acceptance
  socket.on('call:accept', (data) => {
    console.log('Call accepted:', data);
    io.emit('call:accepted', {
      consultationId: data.consultationId,
      room: `room-${data.consultationId}`
    });
  });

  // Handle call end
  socket.on('call:end', (data) => {
    console.log('Call ended:', data);
    io.emit('call:ended', {
      consultationId: data.consultationId
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Available endpoints:`);
  console.log(`  GET  /api`);
  console.log(`  GET  /health`);
  console.log(`  GET  /api/auth`);
  console.log(`  POST /api/auth/verify-firebase-token`);
  console.log(`  GET  /api/patients`);
  console.log(`  GET  /api/patients/me`);
  console.log(`  PATCH /api/patients/location`);
  console.log(`  GET  /api/patients/me/qr`);
  console.log(`  POST /api/patients`);
  console.log(`  GET  /api/doctors`);
  console.log(`  GET  /api/doctors/profile`);
  console.log(`  PATCH /api/doctors/status`);
  console.log(`  PATCH /api/doctors/location`);
  console.log(`  GET  /api/doctors/nearby`);
  console.log(`  GET  /api/consultations`);
  console.log(`  POST /api/consultations`);
  console.log(`  PATCH /api/consultations/:consultationId/accept`);
  console.log(`  PATCH /api/consultations/:consultationId/end`);
  console.log(`  GET  /api/consultations/history`);
  console.log(`  GET  /api/prescriptions`);
  console.log(`  POST /api/prescriptions`);
  console.log(`  GET  /api/prescriptions/:prescriptionId`);
  console.log(`  PATCH /api/prescriptions/forward`);
  console.log(`  GET  /api/pharmacies`);
  console.log(`  GET  /api/pharmacies/nearby`);
  console.log(`  GET  /api/pharmacies/:pharmacyId`);
  console.log(`  GET  /api/ai`);
  console.log(`  POST /api/ai/symptom-checker`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Graceful shutdown
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

function gracefulShutdown() {
  console.log('Received kill signal, shutting down gracefully');
  server.close(() => {
    console.log('Closed out remaining connections');
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('Forcing shutdown after 10 seconds');
    process.exit(1);
  }, 10000);
}