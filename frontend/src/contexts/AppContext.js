import React, { createContext, useContext, useState, useEffect } from 'react';
import PouchDB from 'pouchdb-browser';
import { useAuth } from './AuthContext';

const AppContext = createContext();

export function useApp() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  const { currentUser } = useAuth();
  const [db, setDb] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    if (currentUser) {
      const patientDb = new PouchDB(`patient_${currentUser.patientId}`);
      setDb(patientDb);

      const sync = () => {
        if (isOnline) {
          patientDb.sync('http://localhost:5000/sync', {
            live: true,
            retry: true
          }).on('error', (err) => {
            console.error('Sync error:', err);
          });
        }
      };

      sync();

      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        patientDb.close();
      };
    }
  }, [currentUser, isOnline]);

  const value = {
    db,
    isOnline
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
