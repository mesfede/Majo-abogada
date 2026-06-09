import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Detect if custom environmental variables are supplied on Vercel/hosting
const isEnvConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY;

const finalConfig = isEnvConfigured ? {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
} : firebaseConfig;

const databaseId = isEnvConfigured ? 
  (import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || '(default)') : 
  (firebaseConfig as any).firestoreDatabaseId || '(default)';

const app = initializeApp(finalConfig);
export const db = getFirestore(app, databaseId);
export const auth = getAuth();


