import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi'; // Icons for menu
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <nav className="bg-white shadow-md w-full sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-green-600">
          RecyConnect ♻️
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-600 hover:text-green-600 transition-colors">Home</Link>
          <Link to="/services" className="text-ray-600 hover:text-green-600 transition-colors">Find Services</Link>
          <Link to="/learn" className="text-gray-600 hover:text-green-600 transition-colors">Learn</Link>
          <Link to="/dashboard" className="text-gray-600 hover:text-green-600 transition-colors">Dashboard</Link>
          <Link to="/login" className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">Login</Link>
          <Link to="/signup" className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">Sign Up</Link>
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
            <Link to="/" className="block py-2 px-6 text-gray-600 hover:bg-gray-100">Home</Link>
            <Link to="/services" className="block py-2 px-6 text-gray-600 hover:bg-gray-100">Find Services</Link>
            <Link to="/learn" className="block py-2 px-6 text-gray-600 hover:bg-gray-100">Learn</Link>
            <Link to="/dashboard" className="block py-2 px-6 text-gray-600 hover:bg-gray-100">Dashboard</Link>
            <Link to="/login" className="block py-2 px-6 text-gray-600 hover:bg-gray-100">Login</Link>
            <Link to="/signup" className="block mx-4 my-2 bg-green-500 text-white text-center py-2 px-4 rounded-lg hover:bg-green-600">Sign Up</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;