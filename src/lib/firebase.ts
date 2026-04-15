import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuration provided by the user
const firebaseConfig = {
  apiKey: "AIzaSyCw2bd5vekAHuai5sNb_JPTnhcyKJAhsPo",
  authDomain: "prueba-tecnica-9bfbc.firebaseapp.com",
  projectId: "prueba-tecnica-9bfbc",
  storageBucket: "prueba-tecnica-9bfbc.firebasestorage.app",
  messagingSenderId: "423552429739",
  appId: "1:423552429739:web:0d267e24e10f75bab8d1ee",
  measurementId: "G-ELQRL173FJ"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
