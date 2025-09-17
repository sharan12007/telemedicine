import React from 'react';
import SymptomChecker from '../components/patient/SymptomChecker';
import Header from '../components/common/Header';

function SymptomCheckerPage() {
  return (
    <div className="page">
      <Header />
      <div className="page-content">
        <SymptomChecker />
      </div>
    </div>
  );
}

export default SymptomCheckerPage;
