// This service provides WebRTC-related utility functions

// Generate ICE server configuration
const getIceServers = () => {
  return [
    { urls: 'stun:stun.l.google.com:19302' },
    { 
      urls: process.env.TURN_SERVER_URL,
      username: process.env.TURN_SERVER_USERNAME,
      credential: process.env.TURN_SERVER_CREDENTIAL
    }
  ];
};

// Create a unique room ID for signaling
const generateRoomId = () => {
  return `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Validate WebRTC offer/answer format
const validateSdp = (sdp) => {
  if (!sdp || typeof sdp !== 'string') {
    return false;
  }
  
  // Basic validation - in production, you would do more thorough validation
  return sdp.includes('v=0') && sdp.includes('a=ice-ufrag');
};

module.exports = {
  getIceServers,
  generateRoomId,
  validateSdp
};