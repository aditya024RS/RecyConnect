import React, { useState, useEffect, useRef } from 'react';
import { FaBell } from 'react-icons/fa';
import { useNotifications } from '../context/NotificationContext'; // Use the hook

const NotificationBell = () => {
  // Get data from the single central source
  const { notifications, unreadCount, clearUnreadCount } = useNotifications();
  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle Outside Click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!isOpen && unreadCount > 0) {
      clearUnreadCount(); // Delegate logic to context
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={handleToggle} 
        className="relative p-2 text-gray-600 hover:text-green-600 transition-colors focus:outline-none"
      >
        <FaBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 origin-top-right animate-fade-in-down">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
          </div>
          
          <ul className="max-h-80 overflow-y-auto custom-scrollbar">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <li 
                    key={n.id} 
                    className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!n.isRead ? 'bg-blue-50/30' : ''}`}
                >
                  <p className="text-sm text-gray-800 leading-snug">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {n.createdAt && new Date(n.createdAt).toLocaleDateString() + " • " + new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </li>
              ))
            ) : (
              <li className="px-4 py-6 text-center text-gray-500 text-sm">
                No notifications yet.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;