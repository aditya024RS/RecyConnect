import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';

import Input from '../components/Input';
import SocialButton from '../components/SocialButton';
import authService from '../services/authService';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.signup(
        formData.name,
        formData.email,
        formData.password
      );

      if (response.data.token) {
        // Automatically log the user in upon successful signup
        localStorage.setItem('user_token', response.data.token);
        localStorage.setItem('user_role', response.data.role);

        // Redirect to the dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      // Assuming the backend sends an error if the email is already in use
      setError('An account with this email already exists.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    // This would trigger the Google OAuth flow
    console.log('Signing up with Google');
    alert('Google Signup clicked! (Frontend only)');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-full py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
              sign in to your existing account
            </Link>
          </p>
          {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm flex flex-col gap-4">
            <Input id="name" type="text" placeholder="Full Name" icon={FiUser} value={formData.name} onChange={handleChange} />
            <Input id="email" type="email" placeholder="Email address" icon={FiMail} value={formData.email} onChange={handleChange} />
            <Input id="password" type="password" placeholder="Password" icon={FiLock} value={formData.password} onChange={handleChange} />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>
        </form>
        <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500">Or</span>
            <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <div className="space-y-4">
            <SocialButton provider="Google" icon={FcGoogle} onClick={handleGoogleSignup} />
        </div>
      </div>
    </motion.div>
  );
};

export default SignupPage;