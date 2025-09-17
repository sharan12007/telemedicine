# Telemedicine Patient App

A secure, offline-capable, location-aware patient application for telemedicine consultations.

## Features

- Secure authentication with Firebase
- Unique patient ID and QR code generation
- Location tracking with consent
- Find and connect to nearest available doctors
- Real-time audio/video consultations with WebRTC
- Symptom checker with AI
- Health records storage with offline sync
- Prescription management
- Pharmacy finder

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Socket.IO for real-time communication
- Redis for pub/sub and sessions
- Firebase Authentication
- WebRTC for video calls
- AWS S3 for file storage

### Frontend
- React with Create React App
- PWA capabilities with Service Worker
- PouchDB for offline storage
- Socket.IO client
- Firebase SDK
- Leaflet for maps
- React QR Code

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Redis
- Firebase project
- AWS account (for S3)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/telemedicine-patient-app.git
cd telemedicine-patient-app# telemedicine
