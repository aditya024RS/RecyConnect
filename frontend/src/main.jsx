import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css'
import App from './App.jsx'
import 'leaflet/dist/leaflet.css'
import { NotificationProvider } from './context/NotificationContext';

const GOOGLE_CLIENT_ID = "740453854159-cfjuidtqnkkrqh235v55u3ej1cig3mum.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <BrowserRouter>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
)
