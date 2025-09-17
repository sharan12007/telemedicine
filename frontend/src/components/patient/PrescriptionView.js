import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Loading from '../common/Loading';

function PrescriptionView() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await api.get('/prescriptions');
        setPrescriptions(response.data);
      } catch (err) {
        setError('Failed to fetch prescriptions. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  const handleForwardToPharmacy = async (prescriptionId, pharmacyId) => {
    try {
      await api.post(`/prescriptions/${prescriptionId}/forward`, { pharmacyId });
      alert('Prescription forwarded to pharmacy successfully!');
      // Refresh prescriptions
      const response = await api.get('/prescriptions');
      setPrescriptions(response.data);
    } catch (err) {
      setError('Failed to forward prescription. Please try again.');
      console.error(err);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="prescription-view">
      <h2>Your Prescriptions</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {prescriptions.length === 0 ? (
        <p>No prescriptions found.</p>
      ) : (
        <div className="prescription-list">
          {prescriptions.map(prescription => (
            <div key={prescription._id} className="prescription-card">
              <div className="prescription-header">
                <h3>Prescription #{prescription._id.slice(-6)}</h3>
                <span className="date">
                  {new Date(prescription.issuedAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="medicines">
                <h4>Medicines</h4>
                <ul>
                  {prescription.medicines.map((medicine, index) => (
                    <li key={index}>
                      <strong>{medicine.name}</strong> - {medicine.qty} units
                      {medicine.dose && <span>, Dose: {medicine.dose}</span>}
                      {medicine.instructions && <span>, Instructions: {medicine.instructions}</span>}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="prescription-footer">
                <div className="status">
                  {prescription.pharmacyForwardedTo ? (
                    <span className="forwarded">Forwarded to pharmacy</span>
                  ) : (
                    <span className="not-forwarded">Not forwarded</span>
                  )}
                </div>
                
                {!prescription.pharmacyForwardedTo && (
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      const pharmacyId = prompt('Enter pharmacy ID:');
                      if (pharmacyId) {
                        handleForwardToPharmacy(prescription._id, pharmacyId);
                      }
                    }}
                  >
                    Forward to Pharmacy
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PrescriptionView;
