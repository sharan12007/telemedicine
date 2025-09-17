// Socket event definitions for both client and server

// Authentication events
export const AUTH_EVENTS = {
  AUTHENTICATE: 'auth',
  AUTHENTICATED: 'authenticated',
  AUTH_ERROR: 'auth_error'
};

// Call events
export const CALL_EVENTS = {
  REQUEST: 'call:request',
  ACCEPT: 'call:accepted',
  REJECT: 'call:rejected',
  END: 'call:end',
  REQUEST_ACK: 'call:request:ack',
  ERROR: 'call:error'
};

// WebRTC signaling events
export const WEBRTC_EVENTS = {
  OFFER: 'webrtc:offer',
  ANSWER: 'webrtc:answer',
  ICE_CANDIDATE: 'webrtc:iceCandidate'
};

// Presence events
export const PRESENCE_EVENTS = {
  UPDATE: 'presence:update',
  ONLINE: 'presence:online',
  OFFLINE: 'presence:offline'
};

// Chat events
export const CHAT_EVENTS = {
  MESSAGE: 'message:chat',
  TYPING: 'message:typing',
  READ: 'message:read'
};

// Prescription events
export const PRESCRIPTION_EVENTS = {
  CREATED: 'prescription:created',
  UPDATED: 'prescription:updated',
  FORWARDED: 'prescription:forwarded'
};

// Room events
export const ROOM_EVENTS = {
  JOIN: 'room:join',
  LEAVE: 'room:leave',
  JOINED: 'room:joined',
  LEFT: 'room:left'
};

// Error events
export const ERROR_EVENTS = {
  GENERAL: 'error',
  VALIDATION: 'validation:error',
  AUTHENTICATION: 'authentication:error'
};