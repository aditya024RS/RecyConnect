import React from 'react';

const SocialButton = ({ provider, icon: Icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
    >
      <Icon className="w-5 h-5 mr-2" />
      <span>Continue with {provider}</span>
    </button>
  );
};

export default SocialButton;