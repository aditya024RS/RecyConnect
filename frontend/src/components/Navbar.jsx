import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Check login status whenever the component mounts or URL changes
  useEffect(() => {
    const token = localStorage.getItem('user_token');
    const role = localStorage.getItem('user_role');
    if (token) {
      setIsLoggedIn(true);
      if (role === 'ROLE_ADMIN') {
        setIsAdmin(true);
      }
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  }, [navigate]); // Rerun effect if navigation occurs

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate('/login');
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <nav className="bg-white shadow-md w-full sticky top-0 z-[1000]">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-green-600">
          RecyConnect ♻️
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-600 hover:text-green-600 transition-colors">Home</Link>
          <Link to="/services" className="text-gray-600 hover:text-green-600 transition-colors">Find Services</Link>
          <Link to="/learn" className="text-gray-600 hover:text-green-600 transition-colors">Learn</Link>
          
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="text-gray-600 hover:text-green-600 transition-colors">Dashboard</Link>
              {isAdmin && <Link to="/admin/dashboard" className="text-blue-600 font-bold hover:text-blue-800">Admin</Link>}
              <button onClick={handleLogout} className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">Login</Link>
              <Link to="/signup" className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Animated) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden bg-white pb-4"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            transition={{ duration: 0.3 }}
          >
            <Link to="/" className="block py-2 px-6 text-gray-600 hover:bg-gray-100" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/services" className="block py-2 px-6 text-gray-600 hover:bg-gray-100" onClick={() => setIsOpen(false)}>Find Services</Link>
            <Link to="/learn" className="block py-2 px-6 text-gray-600 hover:bg-gray-100" onClick={() => setIsOpen(false)}>Learn</Link>
            
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="block py-2 px-6 text-gray-600 hover:bg-gray-100" onClick={() => setIsOpen(false)}>Dashboard</Link>
                {isAdmin && <Link to="/admin/dashboard" className="block py-2 px-6 text-blue-600 font-bold hover:text-blue-800">Admin</Link>}
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-left block py-2 px-6 text-red-600 hover:bg-gray-100">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 px-6 text-gray-600 hover:bg-gray-100" onClick={() => setIsOpen(false)}>Login</Link>
                <Link to="/signup" className="block mx-4 my-2 bg-green-500 text-white text-center py-2 px-4 rounded-lg hover:bg-green-600" onClick={() => setIsOpen(false)}>Sign Up</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;