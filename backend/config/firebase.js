// backend/config/firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

const auth = admin.auth();
const firestore = admin.firestore();
const storage = admin.storage();

module.exports = { admin, auth, firestore, storage };