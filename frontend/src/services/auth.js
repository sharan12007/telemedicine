// src/services/auth.js
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Set language code for reCAPTCHA (optional)
// auth.languageCode = 'en';

// Use device language for reCAPTCHA
auth.useDeviceLanguage();

export function loginWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function signupWithEmail(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function loginWithPhone(phoneNumber, appVerifier) {
  return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
}

// Function to set up invisible reCAPTCHA
export function setupInvisibleRecaptcha(buttonId) {
  return new RecaptchaVerifier(auth, buttonId, {
    'size': 'invisible',
    'callback': (response) => {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
      console.log('reCAPTCHA solved');
    },
    'expired-callback': () => {
      // Response expired. Ask user to solve reCAPTCHA again.
      console.log('reCAPTCHA expired');
    }
  });
}

// Function to set up visible reCAPTCHA
export function setupVisibleRecaptcha(containerId) {
  return new RecaptchaVerifier(auth, containerId, {
    'size': 'normal',
    'callback': (response) => {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
      console.log('reCAPTCHA solved');
    },
    'expired-callback': () => {
      // Response expired. Ask user to solve reCAPTCHA again.
      console.log('reCAPTCHA expired');
    }
  });
}