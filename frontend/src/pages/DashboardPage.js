import React from 'react';
import Dashboard from '../components/patient/Dashboard';
import Header from '../components/common/Header';

function DashboardPage() {
  return (
    <div className="page">
      <Header />
      <div className="page-content">
        <Dashboard />
      </div>
    </div>
  );
}

export default DashboardPage;
