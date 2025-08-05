import React from 'react';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-6 text-center">
        <p>&copy; {new Date().getFullYear()} RecyConnect. All Rights Reserved.</p>
        <div className="flex justify-center space-x-6 mt-4">
          <a href="#" className="text-gray-400 hover:text-white transition-colors"><FaTwitter size={24} /></a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors"><FaGithub size={24} /></a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors"><FaLinkedin size={24} /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;