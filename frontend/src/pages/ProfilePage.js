import React from 'react';
import Profile from '../components/patient/Profile';
import Header from '../components/common/Header';

function ProfilePage() {
  return (
    <div className="page">
      <Header />
      <div className="page-content">
        <Profile />
      </div>
    </div>
  );
}

export default ProfilePage;
