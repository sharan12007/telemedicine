// src/components/auth/Signup.js
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signupWithEmail, setupInvisibleRecaptcha, setupVisibleRecaptcha } from '../../services/auth';
import Loading from '../common/Loading';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [signupMethod, setSignupMethod] = useState('email');
  const [recaptchaType, setRecaptchaType] = useState('invisible'); // 'invisible' or 'visible'
  const recaptchaVerifierRef = useRef(null);
  const navigate = useNavigate();

  // Initialize reCAPTCHA when component mounts
  useEffect(() => {
    if (signupMethod === 'phone') {
      initializeRecaptcha();
    }
    
    return () => {
      // Clean up reCAPTCHA when component unmounts
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
      }
    };
  }, [signupMethod, recaptchaType]);

  const initializeRecaptcha = () => {
    try {
      if (recaptchaType === 'invisible') {
        recaptchaVerifierRef.current = setupInvisibleRecaptcha('phone-signup-button');
      } else {
        recaptchaVerifierRef.current = setupVisibleRecaptcha('recaptcha-container');
      }
    } catch (err) {
      console.error('Error initializing reCAPTCHA:', err);
      setError('Failed to initialize reCAPTCHA. Please try again.');
    }
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signupWithEmail(email, password);
      
      // Update user profile with name
      await userCredential.user.updateProfile({
        displayName: name
      });
      
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create an account. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      if (!recaptchaVerifierRef.current) {
        initializeRecaptcha();
        // Wait a bit for reCAPTCHA to initialize
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Format phone number if needed
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      
      // First, create the user with email and password
      const userCredential = await signupWithEmail(email, password);
      
      // Update user profile with name and phone
      await userCredential.user.updateProfile({
        displayName: name
      });
      
      // Now verify the phone number
      // Note: In a real app, you might want to handle phone verification separately
      // For now, we'll just navigate to the dashboard
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create an account. Please try again.');
      console.error(err);
      
      // Reset reCAPTCHA on error
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        initializeRecaptcha();
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleRecaptchaType = () => {
    setRecaptchaType(recaptchaType === 'invisible' ? 'visible' : 'invisible');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign Up for TeleMed</h2>
        
        {signupMethod === 'email' ? (
          <form onSubmit={handleEmailSignup}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" disabled={loading}>
              {loading ? <Loading /> : 'Sign Up'}
            </button>
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
            <p>
              <button type="button" onClick={() => setSignupMethod('phone')}>
                Sign Up with Phone
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handlePhoneSignup}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1234567890"
                required
              />
              <small>Include country code (e.g., +1 for US)</small>
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            {recaptchaType === 'visible' && (
              <div className="form-group">
                <label>Verify you're not a robot</label>
                <div id="recaptcha-container"></div>
              </div>
            )}
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="recaptcha-options">
              <button type="button" onClick={toggleRecaptchaType} className="btn-link">
                Use {recaptchaType === 'invisible' ? 'visible' : 'invisible'} reCAPTCHA
              </button>
            </div>
            
            <button 
              type="submit" 
              id="phone-signup-button"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? <Loading /> : 'Sign Up'}
            </button>
            
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
            <p>
              <button type="button" onClick={() => setSignupMethod('email')}>
                Sign Up with Email
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default Signup;