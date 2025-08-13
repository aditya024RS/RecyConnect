import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const token = localStorage.getItem('user_token');
  const role = localStorage.getItem('user_role');

  // Check if user is logged in AND has the ADMIN role
  if (token && role === 'ROLE_ADMIN') {
    return <Outlet />; // Render the admin page
  } else {
    return <Navigate to="/login" replace />; // Redirect if not admin
  }
};

export default AdminRoute;