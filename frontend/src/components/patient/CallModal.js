import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import { createPeer } from '../../services/webrtc';
import Loading from '../common/Loading';

function CallModal({ doctorId, onClose, onCallEnd }) {
  const { socket } = useSocket();
  const [callStatus, setCallStatus] = useState('requesting');
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peer, setPeer] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Fixed: Memoize endCall function to avoid dependency issues
  const endCall = useCallback(() => {
    if (peer) {
      peer.destroy();
    }
    
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    if (socket) {
      socket.emit('call:ended', { doctorId });
      socket.off('call:accepted');
      socket.off('call:rejected');
      socket.off('webrtc:answer');
      socket.off('webrtc:ice');
      socket.off('call:ended');
    }
    
    onCallEnd();
  }, [peer, localStream, socket, doctorId, onCallEnd]);

  useEffect(() => {
    const startCall = async () => {
      try {
        // Request media access
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        setLocalStream(stream);
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Create peer connection
        const newPeer = createPeer(true, stream);
        setPeer(newPeer);

        // Send call request
        socket.emit('call:request', { doctorId });

        // Set up peer event handlers
        newPeer.on('signal', (data) => {
          socket.emit('webrtc:offer', { 
            to: doctorId, 
            offer: data 
          });
        });

        newPeer.on('stream', (stream) => {
          setRemoteStream(stream);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream;
          }
        });

        newPeer.on('close', () => {
          endCall();
        });

        // Listen for call events
        socket.on('call:accepted', (data) => {
          setCallStatus('connected');
        });

        socket.on('call:rejected', () => {
          setCallStatus('rejected');
        });

        socket.on('webrtc:answer', (data) => {
          newPeer.signal(data.answer);
        });

        socket.on('webrtc:ice', (data) => {
          newPeer.signal(data.ice);
        });

        socket.on('call:ended', () => {
          endCall();
        });

      } catch (error) {
        console.error('Error starting call:', error);
        setCallStatus('error');
      }
    };

    if (socket) {
      startCall();
    }

    return () => {
      endCall();
    };
  }, [socket, doctorId, endCall]); // Fixed: Added endCall to dependencies

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOff(!videoTrack.enabled);
    }
  };

  return (
    <div className="call-modal">
      <div className="call-container">
        <div className="call-header">
          <div className="call-status">
            {callStatus === 'requesting' && 'Requesting call...'}
            {callStatus === 'connected' && 'Call Connected'}
            {callStatus === 'rejected' && 'Call Rejected'}
            {callStatus === 'error' && 'Call Error'}
          </div>
          <button className="btn btn-icon" onClick={onClose}>✕</button>
        </div>

        <div className="call-videos">
          <div className="video-container remote">
            {callStatus === 'connected' && remoteStream ? (
              <video 
                ref={remoteVideoRef} 
                autoPlay 
                playsInline 
                className="video-element"
              />
            ) : (
              <div className="video-placeholder">
                {callStatus === 'requesting' && 'Waiting for doctor to accept...'}
                {callStatus === 'rejected' && 'Doctor rejected the call'}
                {callStatus === 'error' && 'Error connecting call'}
              </div>
            )}
          </div>

          <div className="video-container local">
            {localStream ? (
              <video 
                ref={localVideoRef} 
                autoPlay 
                playsInline 
                muted 
                className="video-element"
              />
            ) : (
              <div className="video-placeholder">
                <Loading />
              </div>
            )}
          </div>
        </div>

        <div className="call-controls">
          <button 
            className={`btn btn-icon ${isMuted ? 'active' : ''}`} 
            onClick={toggleMute}
          >
            {isMuted ? '🔇' : '🎤'}
          </button>
          <button 
            className={`btn btn-icon ${isVideoOff ? 'active' : ''}`} 
            onClick={toggleVideo}
          >
            {isVideoOff ? '📷' : '📹'}
          </button>
          <button className="btn btn-icon end-call" onClick={endCall}>
            📞
          </button>
        </div>
      </div>
    </div>
  );
}

export default CallModal;