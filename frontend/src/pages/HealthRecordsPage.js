import React from 'react';
import HealthRecords from '../components/patient/HealthRecords';
import Header from '../components/common/Header';

function HealthRecordsPage() {
  return (
    <div className="page">
      <Header />
      <div className="page-content">
        <HealthRecords />
      </div>
    </div>
  );
}

export default HealthRecordsPage;
