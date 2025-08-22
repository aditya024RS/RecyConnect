import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const OAuth2RedirectHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const role = searchParams.get('role');

    if (token && role) {
      // Store the token and role received from the backend
      localStorage.setItem('user_token', token);
      localStorage.setItem('user_role', role);

      toast.success('Successfully logged in with Google!');
      // Redirect to the dashboard
      navigate('/dashboard');
    } else {
      toast.error('Google login failed. Please try again.');
      // Redirect to the login page on failure
      navigate('/login');
    }
  }, [searchParams, navigate]);

  // This component will just show a loading message while it processes the redirect
  return (
    <div className="flex justify-center items-center h-screen">
      <p>Logging you in...</p>
    </div>
  );
};

export default OAuth2RedirectHandler;