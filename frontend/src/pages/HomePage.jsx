import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { motion } from "framer-motion";
import {
  FaRecycle,
  FaHandsHelping,
  FaUsers,
  FaMapMarkerAlt,
  FaCalendarCheck,
  FaStar,
} from "react-icons/fa";

const HomePage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalNgos: 0,
    pickupsCompleted: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch site stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative text-center py-24 bg-gradient-to-r from-green-100 via-white to-green-50 rounded-2xl shadow-lg overflow-hidden">
        <motion.h1
          className="text-5xl font-extrabold text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Turn Your Waste into a Resource
        </motion.h1>
        <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">
          Connect with local recyclers and NGOs to easily manage your waste and
          earn rewards for your eco-friendly actions.
        </p>
        <motion.div
          className="mt-8"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/services"
            className="inline-block bg-green-600 text-white font-bold text-lg py-3 px-8 rounded-full shadow-md hover:bg-green-700 transition-all"
          >
            Find a Recycler Near You
          </Link>
        </motion.div>

        {/* Decorative background shapes */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-green-200 rounded-full blur-2xl opacity-40"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-yellow-200 rounded-full blur-2xl opacity-30"></div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-8 bg-white rounded-xl shadow-lg"
          >
            <FaRecycle className="text-green-600 text-5xl mx-auto mb-4" />
            <p className="text-5xl font-bold text-green-600">
              {stats.pickupsCompleted}
            </p>
            <h3 className="text-xl font-semibold text-gray-700 mt-2">
              Pickups Completed
            </h3>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-8 bg-white rounded-xl shadow-lg"
          >
            <FaHandsHelping className="text-blue-600 text-5xl mx-auto mb-4" />
            <p className="text-5xl font-bold text-blue-600">{stats.totalNgos}</p>
            <h3 className="text-xl font-semibold text-gray-700 mt-2">
              Active NGOs
            </h3>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-8 bg-white rounded-xl shadow-lg"
          >
            <FaUsers className="text-yellow-600 text-5xl mx-auto mb-4" />
            <p className="text-5xl font-bold text-yellow-600">
              {stats.totalUsers}
            </p>
            <h3 className="text-xl font-semibold text-gray-700 mt-2">
              Community Members
            </h3>
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="text-center py-20">
        <h2 className="text-4xl font-bold text-gray-800 mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Step 1 */}
          <motion.div
            whileHover={{ rotateY: 10, scale: 1.02 }}
            className="p-8 bg-white border-2 border-green-200 rounded-xl shadow-md relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-green-100 opacity-0 group-hover:opacity-20 transition-all"></div>
            <FaMapMarkerAlt className="text-green-500 text-5xl mb-4 mx-auto" />
            <h3 className="text-2xl font-bold mb-2">1. Pin Your Location</h3>
            <p className="text-gray-600">
              Use our interactive map to find recycling services right in your
              neighborhood.
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            whileHover={{ rotateY: -10, scale: 1.02 }}
            className="p-8 bg-white border-2 border-blue-200 rounded-xl shadow-md relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-blue-100 opacity-0 group-hover:opacity-20 transition-all"></div>
            <FaCalendarCheck className="text-blue-500 text-5xl mb-4 mx-auto" />
            <h3 className="text-2xl font-bold mb-2">2. Book a Pickup</h3>
            <p className="text-gray-600">
              Schedule a convenient pickup for your segregated waste with just a
              few clicks.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            whileHover={{ rotateY: 10, scale: 1.02 }}
            className="p-8 bg-white border-2 border-yellow-200 rounded-xl shadow-md relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-yellow-100 opacity-0 group-hover:opacity-20 transition-all"></div>
            <FaStar className="text-yellow-500 text-5xl mb-4 mx-auto" />
            <h3 className="text-2xl font-bold mb-2">3. Earn Eco-Points</h3>
            <p className="text-gray-600">
              Get rewarded for every responsible action and climb the
              leaderboard.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;