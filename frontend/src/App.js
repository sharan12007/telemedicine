import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import DoctorListPage from './pages/DoctorListPage';
import DoctorProfilePage from './pages/DoctorProfilePage';
import CallPage from './pages/CallPage';
import SymptomCheckerPage from './pages/SymptomCheckerPage';
import PrescriptionPage from './pages/PrescriptionPage';
import HealthRecordsPage from './pages/HealthRecordsPage';
import ProfilePage from './pages/ProfilePage';
import Loading from './components/common/Loading';

function App() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!currentUser ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!currentUser ? <SignupPage /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={currentUser ? <DashboardPage /> : <Navigate to="/login" />} />
        <Route path="/doctors" element={currentUser ? <DoctorListPage /> : <Navigate to="/login" />} />
        <Route path="/doctors/:id" element={currentUser ? <DoctorProfilePage /> : <Navigate to="/login" />} />
        <Route path="/call" element={currentUser ? <CallPage /> : <Navigate to="/login" />} />
        <Route path="/symptom-checker" element={currentUser ? <SymptomCheckerPage /> : <Navigate to="/login" />} />
        <Route path="/prescriptions" element={currentUser ? <PrescriptionPage /> : <Navigate to="/login" />} />
        <Route path="/health-records" element={currentUser ? <HealthRecordsPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={currentUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={currentUser ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
