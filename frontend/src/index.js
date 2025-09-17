import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { AppProvider } from './contexts/AppContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <SocketProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </SocketProvider>
    </AuthProvider>
  </React.StrictMode>
);
