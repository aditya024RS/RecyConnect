import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import LearnPage from './pages/LearnPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import FindServicesPage from './pages/FindServicesPage';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto p-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<FindServicesPage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          {/* We will add more routes for Learn, Dashboard etc. later */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;