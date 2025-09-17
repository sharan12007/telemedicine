import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/auth';
import api from '../services/api'; // Fixed: Use default import

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken();
          const response = await api.post('/auth/verify-firebase-token', { 
            idToken, 
            role: 'patient' 
          });
          setCurrentUser(response.data.user);
          localStorage.setItem('token', response.data.token);
        } catch (error) {
          console.error('Error verifying token:', error);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}