import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLeaf, FaTrophy, FaCheckCircle, FaStar, FaUser, FaBuilding } from 'react-icons/fa';
import api from '../services/api';
import Modal from '../components/Modal';
import ReviewForm from '../components/ReviewForm';
import { toast } from 'react-toastify';

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
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // NEW: State for Leaderboard Toggle ('USER' or 'NGO')
  const [leaderboardType, setLeaderboardType] = useState('USER');

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [userResponse, bookingsResponse] = await Promise.all([
        api.get('/users/me'),
        api.get('/bookings/my-bookings')
      ]);
      setUserData(userResponse.data);
      setBookings(bookingsResponse.data);
    } catch (err) {
      setError('Could not fetch dashboard data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Specialized Fetch for Leaderboard (Triggered on Toggle)
  useEffect(() => {
      const fetchLeaderboard = async () => {
          try {
              const response = await api.get(`/leaderboard?type=${leaderboardType}`);
              setLeaderboard(response.data);
          } catch (error) {
              console.error("Failed to fetch leaderboard", error);
          }
      };
      fetchLeaderboard();
  }, [leaderboardType]); // Re-run when toggle changes

  useEffect(() => {
      fetchData();
  }, [fetchData]);

  const handleReviewClick = (booking) => {
    setSelectedBooking(booking);
    setIsReviewModalOpen(true);
  };

  const onReviewSuccess = () => {
    setIsReviewModalOpen(false);
    setSelectedBooking(null);
    fetchData(); // Refresh data to hide the review button
  };

  if (loading) {
    return <div className="text-center p-10">Loading your dashboard...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Welcome back, {userData.name}!
          </h1>
          <p className="text-lg text-gray-500">
            Here's your eco-progress report.
          </p>
        </div>

        {/* Stats Grid - Section 1: Gamification */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatCard
            icon={<FaLeaf className="text-green-500" />}
            title="Total Eco-Points"
            value={userData.ecoPoints}
            color="bg-green-100"
          />
          <StatCard
            icon={<FaCheckCircle className="text-blue-500" />}
            title="Pickups Completed"
            value={bookings.filter((b) => b.status === "COMPLETED").length}
            color="bg-blue-100"
          />
          <StatCard
            icon={<FaTrophy className="text-yellow-500" />}
            title="Your Rank"
            value={`#${userData?.rank}`}
            color="bg-yellow-100"
          />
        </div>

        {/* NEW: Stats Grid - Section 2: Real World Impact */}
        <h3 className="text-xl font-bold text-gray-700 mb-4 ml-1">Your Environmental Impact 🌍</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <div className="p-6 rounded-xl shadow-sm bg-blue-50 border border-emerald-100 flex flex-col items-center text-center">
              <span className="text-4xl mb-2">☁️</span>
              <p className="text-sm text-gray-600 font-medium">CO2 Prevented</p>
              <p className="text-2xl font-bold text-emerald-700">
                {(userData.ecoPoints * 0.1).toFixed(1)} kg
              </p>
           </div>

           <div className="p-6 rounded-xl shadow-sm bg-teal-50 border border-teal-100 flex flex-col items-center text-center">
              <span className="text-4xl mb-2">⚡</span>
              <p className="text-sm text-gray-600 font-medium">Energy Saved</p>
              <p className="text-2xl font-bold text-teal-700">
                {(userData.ecoPoints * 0.05).toFixed(1)} kWh
              </p>
           </div>

           <div className="p-6 rounded-xl shadow-sm bg-lime-50 border border-lime-100 flex flex-col items-center text-center">
              <span className="text-4xl mb-2">🌳</span>
              <p className="text-sm text-gray-600 font-medium">Trees Equivalent</p>
              <p className="text-2xl font-bold text-lime-700">
                {(userData.ecoPoints / 500).toFixed(2)}
              </p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">

            {/* Become a Service Provider */}
            <section className="my-8 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <h2 className="text-2xl font-bold text-gray-800">
                Join Our Network!
              </h2>
              <p className="text-gray-600 mt-2">
                Are you a recycler or an NGO? Join our platform to connect with
                the community and help us build a greener future.
              </p>
              <Link
                to="/apply-ngo"
                className="mt-4 inline-block bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Become a Service Provider
              </Link>
            </section>

            {/* My Bookings Section */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                My Bookings
              </h2>
              {bookings.length > 0 ? (
                <ul className="space-y-4">
                  {bookings.map((booking) => (
                    <li key={booking.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-700">
                            {booking.wasteType} Pickup ({booking.ngoName})
                          </p>
                          <p className="text-sm text-gray-500">
                            Booked on:{" "}
                            {new Date(booking.bookingDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          {/* New logic for the button */}
                          {booking.status === "COMPLETED" &&
                            !booking.reviewed && (
                              <button
                                onClick={() => handleReviewClick(booking)}
                                className="bg-yellow-500 text-white text-xs font-bold py-1 px-3 rounded hover:bg-yellow-600"
                              >
                                Leave a Review
                              </button>
                            )}

                          {/* Cancel Button */}
                          {booking.status === 'PENDING' && (
                              <button
                                  onClick={async () => {
                                      if(!window.confirm("Cancel this booking?")) return;
                                      try {
                                          await api.post(`/bookings/${booking.id}/cancel`);
                                          toast.info("Booking cancelled successfully.");
                                      } catch (e) { toast.error("Failed to cance booking."); 
                                      } finally {
                                        fetchData();
                                      }
                                  }}
                                  className="bg-red-100 text-red-600  px-3 py-1 rounded-full hover:bg-red-200 transition-colors"
                              >
                                  Cancel
                              </button>
                            )}

                          {/* Status Badge */}
                          <div
                            className={`text-sm font-bold py-1 px-3 rounded-full text-white ${
                              booking.status === "PENDING"
                                ? "bg-yellow-500"
                                : booking.status === "ACCEPTED"
                                ? "bg-blue-500"
                                : booking.status === "COMPLETED"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          >
                            {booking.status}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">
                  You haven't made any bookings yet.
                </p>
              )}
            </div>
          </div>

          {/* Leaderboard Section (With Toggle) */}
          <div className="bg-white p-6 rounded-xl shadow-md h-fit">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Leaderboard</h2>
            </div>
            
            {/* 👇 NEW: Toggle Buttons */}
            <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
                <button 
                    onClick={() => setLeaderboardType('USER')}
                    className={`flex-1 flex items-center justify-center py-2 text-sm font-bold rounded-md transition-all ${
                        leaderboardType === 'USER' 
                        ? 'bg-white text-green-600 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <FaUser className="mr-2"/> Users
                </button>
                <button 
                    onClick={() => setLeaderboardType('NGO')}
                    className={`flex-1 flex items-center justify-center py-2 text-sm font-bold rounded-md transition-all ${
                        leaderboardType === 'NGO' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <FaBuilding className="mr-2"/> NGOs
                </button>
            </div>

            <ul className="space-y-4">
              {leaderboard.length > 0 ? leaderboard.map((user) => (
                <li
                  key={user.rank}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <span
                      className={`font-bold text-lg mr-4 w-6 text-center ${
                        user.rank === 1
                          ? "text-yellow-500"
                          : user.rank === 2
                          ? "text-gray-500"
                          : user.rank === 3
                          ? "text-orange-700"
                          : "text-gray-400"
                      }`}
                    >
                      {user.rank}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-700">{user.name}</p>
                      <p className="text-sm text-green-600">
                        {user.ecoPoints} XP
                      </p>
                    </div>
                  </div>
                  {user.rank === 1 && <FaStar className="text-yellow-400" />}
                </li>
              )) : (
                  <p className="text-center text-gray-500 py-4">No data available.</p>
              )}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* The Modal for Submitting a Review */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title={`Review your pickup with ${selectedBooking?.ngoName}`}
      >
        <ReviewForm
          bookingId={selectedBooking?.id}
          onSuccess={onReviewSuccess}
        />
      </Modal>
    </>
  );
};

export default UserDashboardPage;