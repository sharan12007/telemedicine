import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CallModal from '../components/patient/CallModal';
import Header from '../components/common/Header';

function CallPage() {
  const location = useLocation();
  const navigate = useNavigate();
  // Removed unused socket variable
  const [doctorId, setDoctorId] = useState(null);
  const [showCallModal, setShowCallModal] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('doctorId');
    
    if (id) {
      setDoctorId(id);
      setShowCallModal(true);
    } else {
      navigate('/dashboard');
    }
  }, [location, navigate]);

  const handleCallEnd = () => {
    setShowCallModal(false);
    navigate('/dashboard');
  };

  return (
    <div className="page">
      <Header />
      <div className="page-content">
        {showCallModal && doctorId && (
          <CallModal 
            doctorId={doctorId} 
            onClose={handleCallEnd} 
            onCallEnd={handleCallEnd} 
          />
        )}
      </div>
    </div>
  );
}

export default CallPage;