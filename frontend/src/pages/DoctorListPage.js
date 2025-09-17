import React, { useState, useEffect } from 'react';
import { getCurrentPosition } from '../services/location';
import api from '../services/api';
import Header from '../components/common/Header';
import DoctorCard from '../components/patient/DoctorCard';
import Loading from '../components/common/Loading';
import Map from '../components/common/Map';

function DoctorListPage() {
  // Removed unused currentUser variable
  const [doctors, setDoctors] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

  useEffect(() => {
    const fetchLocationAndDoctors = async () => {
      try {
        const position = await getCurrentPosition();
        setLocation(position);

        const response = await api.get('/doctors/nearby', {
          params: {
            lng: position.longitude,
            lat: position.latitude,
            maxDistance: 20000 // 20km
          }
        });
        setDoctors(response.data);
      } catch (err) {
        setError('Failed to get location or doctors. Please enable location services.');
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
    return (
      <div className="page">
        <Header />
        <div className="page-content">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <Header />
      <div className="page-content">
        <div className="page-header">
          <h1>Find Doctors</h1>
          <div className="view-toggle">
            <button 
              className={`btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              List View
            </button>
            <button 
              className={`btn ${viewMode === 'map' ? 'active' : ''}`}
              onClick={() => setViewMode('map')}
            >
              Map View
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {viewMode === 'list' ? (
          <div className="doctor-list">
            {doctors.length > 0 ? (
              doctors.map(doctor => (
                <DoctorCard 
                  key={doctor._id} 
                  doctor={doctor} 
                  onCallNow={handleCallNow} 
                />
              ))
            ) : (
              <p>No doctors found nearby. Please check your location settings.</p>
            )}
          </div>
        ) : (
          <div className="map-view">
            {location && (
              <Map 
                center={[location.latitude, location.longitude]} 
                zoom={12}
                markers={[
                  {
                    lat: location.latitude,
                    lng: location.longitude,
                    name: 'Your Location'
                  },
                  ...doctors.map(doctor => ({
                    lat: doctor.location.coordinates[1],
                    lng: doctor.location.coordinates[0],
                    name: doctor.name
                  }))
                ]}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorListPage;