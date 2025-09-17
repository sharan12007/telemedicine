import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/common/Header';
import Loading from '../components/common/Loading';

function DoctorProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await api.get(`/doctors/${id}`);
        setDoctor(response.data);
      } catch (err) {
        setError('Failed to fetch doctor details. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  const handleCallNow = () => {
    navigate(`/call?doctorId=${id}`);
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
        {error && <div className="error-message">{error}</div>}
        
        {doctor && (
          <div className="doctor-profile">
            <div className="profile-header">
              <div className="doctor-name">
                <h1>{doctor.name}</h1>
                <div className={`status ${doctor.status}`}>
                  {doctor.status}
                </div>
              </div>
              <div className="rating">
                ⭐ {doctor.rating.toFixed(1)} ({doctor.ratingCount || 0} reviews)
              </div>
            </div>

            <div className="profile-section">
              <h2>Specialties</h2>
              <div className="specialties">
                {doctor.specialties.map((specialty, index) => (
                  <span key={index} className="specialty-tag">{specialty}</span>
                ))}
              </div>
            </div>

            <div className="profile-section">
              <h2>Contact Information</h2>
              <div className="contact-info">
                {doctor.contact.email && (
                  <div className="contact-item">
                    <label>Email</label>
                    <div>{doctor.contact.email}</div>
                  </div>
                )}
                {doctor.contact.phone && (
                  <div className="contact-item">
                    <label>Phone</label>
                    <div>{doctor.contact.phone}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="profile-section">
              <h2>Working Hours</h2>
              <div className="working-hours">
                {doctor.workingHours.length > 0 ? (
                  doctor.workingHours.map((schedule, index) => (
                    <div key={index} className="schedule-item">
                      <span className="day">{schedule.day}</span>
                      <span className="time">{schedule.startTime} - {schedule.endTime}</span>
                    </div>
                  ))
                ) : (
                  <p>No working hours specified</p>
                )}
              </div>
            </div>

            <div className="profile-actions">
              <button 
                className="btn btn-primary"
                onClick={handleCallNow}
                disabled={doctor.status !== 'available'}
              >
                Call Now
              </button>
              <button className="btn btn-outline">Schedule Appointment</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorProfilePage;
