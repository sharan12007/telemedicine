// backend/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
const redisAdapter = require('socket.io-redis');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const doctorRoutes = require('./routes/doctors');
const consultationRoutes = require('./routes/consultations');
const prescriptionRoutes = require('./routes/prescriptions');
const healthRecordRoutes = require('./routes/healthRecords');
const pharmacyRoutes = require('./routes/pharmacies');
const aiRoutes = require('./routes/ai'); // Add this line
const { initializeSocket } = require('./socket');
const { errorHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Fix: Set trust proxy to handle X-Forwarded-For header
app.set('trust proxy', true);

// Redis adapter for Socket.IO
io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

// Initialize Socket.IO
initializeSocket(io);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/healthRecords', healthRecordRoutes);
app.use('/api/pharmacies', pharmacyRoutes);
app.use('/api/ai', aiRoutes); // Add this line

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error handling middleware
app.use(errorHandler);

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => logger.info('Connected to MongoDB'))
.catch(err => logger.error('MongoDB connection error:', err));

module.exports = { app, server, io };