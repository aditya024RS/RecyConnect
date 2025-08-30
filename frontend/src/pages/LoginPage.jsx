import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FiMail, FiLock } from "react-icons/fi";
import { toast } from 'react-toastify';

import Input from "../components/Input";
import authService from "../services/authService";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const BACKEND_URL = 'http://localhost:8080';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authService.login(
        formData.email,
        formData.password
      );

      if (response.data.token) {
        // Store the token and role in localStorage
        localStorage.setItem("user_token", response.data.token);
        localStorage.setItem("user_role", response.data.role);
        toast.success('Login Successful!');
        // Redirect to the dashboard
        navigate("/dashboard");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        const errors = err.response.data;
        if (typeof errors === 'object') {
          Object.keys(errors).forEach((field) => {
            toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)}: ${errors[field]}`);
          });
        } else {
          toast.error(errors.message || 'An unexpected error occurred.');
        }
      } else {
        setError('Invalid email or password.');
        toast.error('Login failed. Please try again.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
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
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              to="/signup"
              className="font-medium text-green-600 hover:text-green-500"
            >
              create a new account
            </Link>
          </p>
          {/* Error Message Display */}
          {error && (
            <p className="mt-2 text-center text-sm text-red-600">{error}</p>
          )}
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm flex flex-col gap-4">
            <Input
              id="email"
              type="email"
              placeholder="Email address"
              icon={FiMail}
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              id="password"
              type="password"
              placeholder="Password"
              icon={FiLock}
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
            </div>
            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-green-600 hover:text-green-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500">Or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <div className="space-y-4">
          <a
            href={`${BACKEND_URL}/oauth2/authorization/google`}
            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <FcGoogle className="w-5 h-5 mr-2" />
            <span>Continue with Google</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;
