// App constants
export const APP_NAME = 'TeleMed Patient';
export const APP_VERSION = '1.0.0';

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    VERIFY_TOKEN: '/auth/verify-firebase-token'
  },
  PATIENTS: {
    PROFILE: '/patients/me',
    LOCATION: '/patients/location',
    QR: '/patients/me/qr',
    HEALTH_RECORDS: '/patients/me/health-records'
  },
  DOCTORS: {
    NEARBY: '/doctors/nearby',
    PROFILE: '/doctors/profile'
  },
  CONSULTATIONS: {
    REQUEST: '/consultations',
    ACCEPT: '/consultations/:id/accept',
    END: '/consultations/:id/end',
    HISTORY: '/consultations/history'
  },
  PRESCRIPTIONS: {
    CREATE: '/prescriptions',
    GET: '/prescriptions/:id',
    FORWARD: '/prescriptions/forward'
  },
  PHARMACIES: {
    NEARBY: '/pharmacies/nearby',
    DETAILS: '/pharmacies/:id'
  },
  AI: {
    SYMPTOM_CHECKER: '/ai/symptom-checker'
  }
};

// Socket events
export const SOCKET_EVENTS = {
  CONNECTION: 'connect',
  DISCONNECTION: 'disconnect',
  AUTH: 'auth',
  
  // Call events
  CALL_REQUEST: 'call:request',
  CALL_ACCEPT: 'call:accepted',
  CALL_REJECT: 'call:rejected',
  CALL_END: 'call:end',
  CALL_REQUEST_ACK: 'call:request:ack',
  
  // WebRTC signaling
  WEBRTC_OFFER: 'webrtc:offer',
  WEBRTC_ANSWER: 'webrtc:answer',
  WEBRTC_ICE_CANDIDATE: 'webrtc:iceCandidate',
  
  // Prescription events
  PRESCRIPTION_CREATED: 'prescription:created',
  
  // Presence events
  PRESENCE_UPDATE: 'presence:update',
  
  // Chat events
  CHAT_MESSAGE: 'message:chat'
};

// User roles
export const USER_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor'
};

// Consultation statuses
export const CONSULTATION_STATUSES = {
  REQUESTED: 'requested',
  ACCEPTED: 'accepted',
  IN_CALL: 'in_call',
  FINISHED: 'finished',
  CANCELLED: 'cancelled'
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  AUTH_ERROR: 'Authentication error. Please login again.',
  PERMISSION_DENIED: 'Permission denied. You do not have access to this resource.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.'
};

// Notification types
export const NOTIFICATION_TYPES = {
  CALL_REQUEST: 'call_request',
  CALL_ACCEPTED: 'call_accepted',
  PRESCRIPTION_CREATED: 'prescription_created',
  APPOINTMENT_REMINDER: 'appointment_reminder'
};