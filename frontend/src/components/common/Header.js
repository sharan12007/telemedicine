import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Header() {
  const { currentUser } = useAuth();

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">TeleMed</Link>
      </div>
      <nav>
        {currentUser ? (
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/doctors">Find Doctors</Link></li>
            <li><Link to="/symptom-checker">Symptom Checker</Link></li>
            <li><Link to="/health-records">Health Records</Link></li>
            <li><Link to="/profile">Profile</Link></li>
          </ul>
        ) : (
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
          </ul>
        )}
      </nav>
    </header>
  );
}

export default Header;
