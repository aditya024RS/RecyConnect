import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Input from '../components/Input';
import authService from '../services/authService';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.forgotPassword(email);
      toast.success(response.data); // Show the success message from the backend
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center min-h-full py-12 px-4"
    >
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">Reset your password</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Input
            id="email"
            type="email"
            placeholder="Email address"
            icon={FiMail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-green-300"
            >
              {loading ? 'Sending link...' : 'Send Reset Link'}
            </button>
          </div>
        </form>
        <div className="text-center text-sm">
            <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                Back to login
            </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ForgotPasswordPage;