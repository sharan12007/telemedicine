import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { storeHealthRecord, getHealthRecords } from '../../services/pouchdb';
import Loading from '../common/Loading';

function HealthRecords() {
  const { db, isOnline } = useApp();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecord, setNewRecord] = useState({
    type: 'note',
    title: '',
    description: ''
  });

  useEffect(() => {
    const fetchRecords = async () => {
      if (db) {
        try {
          const healthRecords = await getHealthRecords(db);
          setRecords(healthRecords);
        } catch (err) {
          setError('Failed to fetch health records. Please try again.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRecords();
  }, [db]);

  const handleAddRecord = async (e) => {
    e.preventDefault();
    
    try {
      await storeHealthRecord(db, newRecord);
      setNewRecord({ type: 'note', title: '', description: '' });
      setShowAddForm(false);
      
      // Refresh records
      const healthRecords = await getHealthRecords(db);
      setRecords(healthRecords);
    } catch (err) {
      setError('Failed to add health record. Please try again.');
      console.error(err);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="health-records">
      <div className="section-header">
        <h2>Your Health Records</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add Record'}
        </button>
      </div>
      
      <div className={`sync-status ${isOnline ? 'online' : 'offline'}`}>
        {isOnline ? 'Synced with server' : 'Offline - changes will sync when online'}
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {showAddForm && (
        <div className="add-record-form">
          <h3>Add New Health Record</h3>
          <form onSubmit={handleAddRecord}>
            <div className="form-group">
              <label>Type</label>
              <select
                value={newRecord.type}
                onChange={(e) => setNewRecord({...newRecord, type: e.target.value})}
              >
                <option value="note">Note</option>
                <option value="diagnosis">Diagnosis</option>
                <option value="medication">Medication</option>
                <option value="lab_result">Lab Result</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={newRecord.title}
                onChange={(e) => setNewRecord({...newRecord, title: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newRecord.description}
                onChange={(e) => setNewRecord({...newRecord, description: e.target.value})}
                rows={4}
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary">Save Record</button>
          </form>
        </div>
      )}
      
      {records.length === 0 ? (
        <p>No health records found.</p>
      ) : (
        <div className="records-list">
          {records.map(record => (
            <div key={record._id} className="record-card">
              <div className="record-header">
                <h3>{record.title}</h3>
                <span className={`type ${record.type}`}>{record.type}</span>
                <span className="date">
                  {new Date(record.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="record-content">
                <p>{record.description}</p>
              </div>
              
              {record.attachments && record.attachments.length > 0 && (
                <div className="record-attachments">
                  <h4>Attachments</h4>
                  <ul>
                    {record.attachments.map((attachment, index) => (
                      <li key={index}>
                        <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                          {attachment.filename}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HealthRecords;
