import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const { currentUser } = useAuth();
  const [socket, setSocket] = useState(null);

  // Fixed: Memoize the cleanup function
  const cleanupSocket = useCallback((currentSocket) => {
    if (currentSocket) {
      currentSocket.close();
    }
  }, []);

  useEffect(() => {
    let newSocket = null;
    
    if (currentUser) {
      const token = localStorage.getItem('token');
      newSocket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
        auth: {
          token: token
        }
      });
      setSocket(newSocket);
    }

    return () => {
      cleanupSocket(newSocket); // Fixed: Use the memoized cleanup function
    };
  }, [currentUser, cleanupSocket]); // Fixed: Added cleanupSocket to dependencies

  const value = {
    socket
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}