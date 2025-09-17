import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { generateQRCode } from '../../services/qr';
import Loading from '../common/Loading';

function Profile() {
  const { currentUser } = useAuth();
  const [patientData, setPatientData] = useState(null);
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await api.get(`/patients/${currentUser.patientId}`);
        setPatientData(response.data);
        
        // Generate QR code
        const qr = await generateQRCode(response.data.qrJwt);
        setQrCode(qr);
      } catch (err) {
        setError('Failed to fetch profile data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchPatientData();
    }
  }, [currentUser]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="profile">
      <h2>Your Profile</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {patientData && (
        <div className="profile-content">
          <div className="profile-section">
            <h3>Personal Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Patient ID</label>
                <div className="info-value">{patientData.patientId}</div>
              </div>
              <div className="info-item">
                <label>Name</label>
                <div className="info-value">{patientData.name}</div>
              </div>
              <div className="info-item">
                <label>Email</label>
                <div className="info-value">{patientData.email}</div>
              </div>
              <div className="info-item">
                <label>Phone</label>
                <div className="info-value">{patientData.phone}</div>
              </div>
              {patientData.profile.dob && (
                <div className="info-item">
                  <label>Date of Birth</label>
                  <div className="info-value">
                    {new Date(patientData.profile.dob).toLocaleDateString()}
                  </div>
                </div>
              )}
              {patientData.profile.gender && (
                <div className="info-item">
                  <label>Gender</label>
                  <div className="info-value">{patientData.profile.gender}</div>
                </div>
              )}
              {patientData.profile.bloodGroup && (
                <div className="info-item">
                  <label>Blood Group</label>
                  <div className="info-value">{patientData.profile.bloodGroup}</div>
                </div>
              )}
            </div>
          </div>
          
          {patientData.profile.allergies && patientData.profile.allergies.length > 0 && (
            <div className="profile-section">
              <h3>Allergies</h3>
              <div className="allergies-list">
                {patientData.profile.allergies.map((allergy, index) => (
                  <span key={index} className="allergy-tag">{allergy}</span>
                ))}
              </div>
            </div>
          )}
          
          <div className="profile-section">
            <h3>Your QR Code</h3>
            <p>Show this QR code to healthcare providers for quick access to your profile</p>
            <div className="qr-code-container">
              {qrCode && <img src={qrCode} alt="Patient QR Code" />}
            </div>
          </div>
          
          <div className="profile-section">
            <h3>Preferences</h3>
            <div className="preferences">
              <div className="preference-item">
                <label>Notification Method</label>
                <div className="preference-value">
                  {patientData.preferences.notifyBy.join(', ')}
                </div>
              </div>
              <div className="preference-item">
                <label>Offline Sync</label>
                <div className="preference-value">
                  {patientData.preferences.offlineSync ? 'Enabled' : 'Disabled'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
