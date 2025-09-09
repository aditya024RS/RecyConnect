import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLeaf, FaTrophy, FaCheckCircle, FaStar } from 'react-icons/fa';
import api from '../services/api';

const StatCard = ({ icon, title, value, color }) => (
  <div className={`p-6 rounded-xl shadow-md flex items-center space-x-4 ${color}`}>
    <div className="text-3xl">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const UserDashboardPage = () => {
  const [userData, setUserData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, bookingsResponse] = await Promise.all([
          api.get('/users/me'),
          api.get('/bookings/my-bookings')
        ]);
        setUserData(userResponse.data);
        setBookings(bookingsResponse.data);
      } catch (err) {
        setError('Could not fetch user data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center p-10">Loading your dashboard...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Welcome back, {userData.name}!</h1>
        <p className="text-lg text-gray-500">Here's your eco-progress report.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={<FaLeaf className="text-green-500"/>} title="Total Eco-Points" value={userData.ecoPoints} color="bg-green-100" />
        <StatCard icon={<FaCheckCircle className="text-blue-500"/>} title="Pickups Completed" value={bookings.filter(b => b.status === 'COMPLETED').length} color="bg-blue-100" />
        <StatCard icon={<FaTrophy className="text-yellow-500"/>} title="Your Rank" value="#12" color="bg-yellow-100" />
      </div>

      {/* 👇 NEW SECTION 👇 */}
      {/* We will add logic later to hide this if the user is already an NGO */}
      <section className="my-8 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
          <h2 className="text-2xl font-bold text-gray-800">Join Our Network!</h2>
          <p className="text-gray-600 mt-2">Are you a recycler or an NGO? Join our platform to connect with the community and help us build a greener future.</p>
          <Link 
              to="/apply-ngo"
              className="mt-4 inline-block bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
          >
              Become a Service Provider
          </Link>
      </section>

      {/* My Bookings Section */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">My Bookings</h2>
        {bookings.length > 0 ? (
          <ul className="space-y-4">
            {bookings.map(booking => (
              <li key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                <div>
                  <p className="font-semibold text-gray-700">{booking.wasteType} Pickup</p>
                  <p className="text-sm text-gray-500">
                    Booked on: {new Date(booking.bookingDate).toLocaleDateString()}
                  </p>
                </div>
                <div className={`text-sm font-bold py-1 px-3 rounded-full text-white ${
                  booking.status === 'PENDING' ? 'bg-yellow-500' :
                  booking.status === 'ACCEPTED' ? 'bg-blue-500' :
                  booking.status === 'COMPLETED' ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {booking.status}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">You haven't made any bookings yet.</p>
        )}
      </div>
    </motion.div>
  );
};

export default UserDashboardPage;