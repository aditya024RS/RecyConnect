import React from 'react';
import UserDashboardPage from './UserDashboardPage';
import NgoDashboardPage from './NgoDashboardPage';

const DashboardPage = () => {
  const userRole = localStorage.getItem('user_role');

  // Conditionally render the correct dashboard based on the user's role
  if (userRole === 'ROLE_NGO') {
    return <NgoDashboardPage />;
  } else if (userRole === 'ROLE_USER') {
    return <UserDashboardPage />;
  } else {
    // Fallback or loading state if needed, though ProtectedRoute should prevent this
    return <div>Loading dashboard...</div>;
  }
};

export default DashboardPage;