// src/components/auth/Login.js
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginWithEmail, setupInvisibleRecaptcha, setupVisibleRecaptcha, loginWithPhone } from '../../services/auth';
import Loading from '../common/Loading';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginMethod, setLoginMethod] = useState('email');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [recaptchaType, setRecaptchaType] = useState('invisible'); // 'invisible' or 'visible'
  const recaptchaVerifierRef = useRef(null);
  const navigate = useNavigate();

  // Initialize reCAPTCHA when component mounts
  useEffect(() => {
    if (loginMethod === 'phone') {
      initializeRecaptcha();
    }
    
    return () => {
      // Clean up reCAPTCHA when component unmounts
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
      }
    };
  }, [loginMethod, recaptchaType]);

  const initializeRecaptcha = () => {
    try {
      if (recaptchaType === 'invisible') {
        recaptchaVerifierRef.current = setupInvisibleRecaptcha('phone-login-button');
      } else {
        recaptchaVerifierRef.current = setupVisibleRecaptcha('recaptcha-container');
      }
    } catch (err) {
      console.error('Error initializing reCAPTCHA:', err);
      setError('Failed to initialize reCAPTCHA. Please try again.');
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await loginWithEmail(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!recaptchaVerifierRef.current) {
        initializeRecaptcha();
        // Wait a bit for reCAPTCHA to initialize
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Format phone number if needed
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      
      const result = await loginWithPhone(formattedPhone, recaptchaVerifierRef.current);
      setConfirmationResult(result);
      setLoginMethod('otp');
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
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

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await confirmationResult.confirm(otp);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid OTP. Please try again.');
      console.error(err);
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
        <h2>Login to TeleMed</h2>
        
        {loginMethod === 'email' ? (
          <form onSubmit={handleEmailLogin}>
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
            {error && <div className="error-message">{error}</div>}
            <button type="submit" disabled={loading}>
              {loading ? <Loading /> : 'Login'}
            </button>
            <p>
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
            <p>
              <button type="button" onClick={() => setLoginMethod('phone')}>
                Login with Phone
              </button>
            </p>
          </form>
        ) : loginMethod === 'phone' ? (
          <form onSubmit={handlePhoneLogin}>
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
              id="phone-login-button"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? <Loading /> : 'Send OTP'}
            </button>
            
            <p>
              <button type="button" onClick={() => setLoginMethod('email')}>
                Login with Email
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div className="form-group">
              <label>Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" disabled={loading}>
              {loading ? <Loading /> : 'Verify OTP'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;