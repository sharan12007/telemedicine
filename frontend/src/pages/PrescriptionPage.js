import React from 'react';
import PrescriptionView from '../components/patient/PrescriptionView';
import Header from '../components/common/Header';

function PrescriptionPage() {
  return (
    <div className="page">
      <Header />
      <div className="page-content">
        <PrescriptionView />
      </div>
    </div>
  );
}

export default PrescriptionPage;
