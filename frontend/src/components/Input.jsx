import React from 'react';

const Input = ({ id, type, placeholder, icon: Icon, value, onChange }) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="text-gray-400" />
      </div>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-2 border rounded-lg text-gray-700 focus:ring-green-500 focus:border-green-500"
        required
      />
    </div>
  );
};

export default Input;