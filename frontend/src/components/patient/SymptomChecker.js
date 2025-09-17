// src/components/patient/SymptomChecker.js
import React, { useState } from 'react';
import api from '../../services/api';
import Loading from '../common/Loading';

function SymptomChecker() {
  const [symptoms, setSymptoms] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/ai/symptom-checker', { symptoms });
      setResults(response.data);
    } catch (err) {
      setError('Failed to analyze symptoms. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="symptom-checker">
      <h2>Symptom Checker</h2>
      <p>Describe your symptoms and get AI-powered insights</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Your Symptoms</label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={5}
            placeholder="Describe your symptoms in detail..."
            required
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button type="submit" disabled={loading}>
          {loading ? <Loading /> : 'Analyze Symptoms'}
        </button>
      </form>

      {results && (
        <div className="results">
          <h3>Analysis Results</h3>
          
          {results.possibleConditions && results.possibleConditions.length > 0 && (
            <div className="conditions">
              <h4>Possible Conditions</h4>
              <ul>
                {results.possibleConditions.map((condition, index) => (
                  <li key={index}>
                    <strong>{condition.name}</strong> - {condition.likelihood} likelihood
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {results.recommendations && (
            <div className="recommendations">
              <h4>Recommendations</h4>
              <p>{results.recommendations}</p>
            </div>
          )}
          
          {results.urgent && (
            <div className="urgent-notice">
              <h4>⚠️ Urgent Notice</h4>
              <p>{results.urgentMessage}</p>
            </div>
          )}
          
          <div className="next-steps">
            <h4>Next Steps</h4>
            <p>Based on your symptoms, we recommend:</p>
            <ol>
              <li>Consult with a healthcare professional for proper diagnosis</li>
              <li>Monitor your symptoms and seek immediate care if they worsen</li>
              <li>Consider scheduling an appointment with a nearby doctor</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

export default SymptomChecker;