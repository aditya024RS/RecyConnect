import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaTrophy, FaCheckCircle, FaStar } from 'react-icons/fa';
import api from '../services/api'; // 👈 Import our new authenticated api service

// We can keep the StatCard component as it is
const StatCard = ({ icon, title, value, color }) => (
  <div className={`p-6 rounded-xl shadow-md flex items-center space-x-4 ${color}`}>
    <div className="text-3xl">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const DashboardPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock data for UI elements that aren't dynamic yet
  const recentBookings = [
    { id: 1, date: '2025-07-22', type: 'E-Waste', status: 'Completed', points: 150 },
    { id: 2, date: '2025-07-18', type: 'Plastics', status: 'Completed', points: 75 },
  ];
  const leaderboard = [
    { rank: 1, name: 'Rohan Verma', points: 2500 },
    { rank: 2, name: 'Aarav Singh', points: 2310 },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/users/me');
        setUserData(response.data);
      } catch (err) {
        setError('Could not fetch user data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // The empty array ensures this runs only once when the component mounts

  if (loading) {
    return <div className="text-center p-10">Loading your dashboard...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Welcome back, {userData.name}!</h1>
        <p className="text-lg text-gray-500">Here's your eco-progress report.</p>
      </div>

      {/* Stats Grid - Using mock data for now */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={<FaLeaf className="text-green-500"/>} title="Total Eco-Points" value="1250" color="bg-green-100" />
        <StatCard icon={<FaCheckCircle className="text-blue-500"/>} title="Pickups Completed" value="15" color="bg-blue-100" />
        <StatCard icon={<FaTrophy className="text-yellow-500"/>} title="Your Rank" value="#12" color="bg-yellow-100" />
      </div>

      {/* Recent Activity & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <ul className="space-y-4">
            {recentBookings.map(booking => (
              <li key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-700">{booking.type} Pickup</p>
                  <p className="text-sm text-gray-500">{booking.date}</p>
                </div>
                <div className="text-right">
                   <p className="font-bold text-green-600">+{booking.points} XP</p>
                   <p className="text-sm text-green-500">{booking.status}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Leaderboard Section */}
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Leaderboard</h2>
            <ul className="space-y-4">
              {leaderboard.map(user => (
                <li key={user.rank} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="font-bold text-lg text-gray-500 mr-4">{user.rank}</span>
                    <div>
                      <p className="font-semibold text-gray-700">{user.name}</p>
                      <p className="text-sm text-green-600">{user.points} XP</p>
                    </div>
                  </div>
                  {user.rank === 1 && <FaStar className="text-yellow-400" />}
                </li>
              ))}
            </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;