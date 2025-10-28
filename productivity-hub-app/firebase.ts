// FIX: Corrected Firebase import to use named `initializeApp` for v9+ modular SDK.
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// This configuration now securely reads from Environment Variables
// You must set these variables in your deployment environment (e.g., Vercel)
// This uses import.meta.env, which is the standard for Vite projects.
// FIX: Cast `import.meta` to `any` to suppress TypeScript errors in environments
// where Vite's types are not correctly configured. This preserves the intended runtime behavior.
const firebaseConfig = {
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY,
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID
};

// Check if all required environment variables are set
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error("Firebase configuration is missing. Make sure you have set up your VITE_FIREBASE_* environment variables in Vercel or a .env file.");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// In a real production app, you would also set up an admin user
// This is typically done via a secure backend script or cloud function
// For now, you can manually change a user's role to 'admin' in your Firestore console.

export { app, auth, db };