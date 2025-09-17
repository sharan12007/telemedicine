import React from 'react';
import { Link } from 'react-router-dom';

function DoctorCard({ doctor, onCallNow }) {
  return (
    <div className="doctor-card">
      <div className="doctor-info">
        <h3>{doctor.name}</h3>
        <div className="specialties">
          {doctor.specialties.map((specialty, index) => (
            <span key={index} className="specialty-tag">{specialty}</span>
          ))}
        </div>
        <div className="doctor-details">
          <div className="rating">
            ⭐ {doctor.rating.toFixed(1)}
          </div>
          <div className="status">
            <span className={`status-indicator ${doctor.status}`}></span>
            {doctor.status}
          </div>
          <div className="distance">
            {doctor.distance ? `${(doctor.distance / 1000).toFixed(1)} km away` : 'Distance unknown'}
          </div>
        </div>
      </div>
      <div className="doctor-actions">
        <Link to={`/doctors/${doctor._id}`} className="btn btn-outline">View Profile</Link>
        <button 
          className="btn btn-primary" 
          onClick={() => onCallNow(doctor._id)}
          disabled={doctor.status !== 'available'}
        >
          Call Now
        </button>
      </div>
    </div>
  );
}

export default DoctorCard;
