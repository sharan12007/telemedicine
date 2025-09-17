import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { getCurrentPosition } from '../../services/location';
import api from '../../services/api';
import Loading from '../common/Loading';
import Map from '../common/Map';
import DoctorCard from './DoctorCard';

function Dashboard() {
  const { currentUser } = useAuth();
  const { isOnline } = useApp();
  const [location, setLocation] = useState(null);
  const [nearbyDoctors, setNearbyDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLocationAndDoctors = async () => {
      try {
        const position = await getCurrentPosition();
        setLocation(position);

        const response = await api.get('/doctors/nearby', {
          params: {
            lng: position.longitude,
            lat: position.latitude,
            maxDistance: 10000
          }
        });
        setNearbyDoctors(response.data);
      } catch (err) {
        setError('Failed to get location or nearby doctors. Please enable location services.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocationAndDoctors();
  }, []);

  const handleCallNow = (doctorId) => {
    window.location.href = `/call?doctorId=${doctorId}`;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {currentUser?.name}</h1>
        <div className="status-indicators">
          <div className={`status ${isOnline ? 'online' : 'offline'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions">
          <Link to="/symptom-checker" className="action-card">
            <div className="action-icon">🩺</div>
            <h3>Symptom Checker</h3>
            <p>Check your symptoms with AI</p>
          </Link>
          <Link to="/doctors" className="action-card">
            <div className="action-icon">👨‍⚕️</div>
            <h3>Find Doctors</h3>
            <p>Search for nearby doctors</p>
          </Link>
          <Link to="/health-records" className="action-card">
            <div className="action-icon">📋</div>
            <h3>Health Records</h3>
            <p>View your medical history</p>
          </Link>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Nearby Doctors</h2>
        {nearbyDoctors.length > 0 ? (
          <div className="doctor-list">
            {nearbyDoctors.slice(0, 3).map(doctor => (
              <DoctorCard 
                key={doctor._id} 
                doctor={doctor} 
                onCallNow={handleCallNow} 
              />
            ))}
            <div className="view-all">
              <Link to="/doctors">View All Doctors</Link>
            </div>
          </div>
        ) : (
          <p>No doctors found nearby. Please check your location settings.</p>
        )}
      </div>

      {location && (
        <div className="dashboard-section">
          <h2>Your Location</h2>
          <Map 
            center={[location.latitude, location.longitude]} 
            zoom={15}
            markers={[{
              lat: location.latitude,
              lng: location.longitude,
              name: 'Your Location'
            }]}
          />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
