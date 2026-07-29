import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.jsx';
import './App.css';

// Pass your actual key as a fallback if the env variable isn't injected
const PUBLISHABLE_KEY = 
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 
  "pk_test_dXNhYmxlLW11dHQtNy5jbGVyay5hY2NvdW50cy5kZXYk"; // 👈 Paste your pk_test_ key here

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);