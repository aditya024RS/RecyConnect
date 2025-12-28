import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaRecycle, FaTruck, FaLeaf, FaUserFriends, FaStar } from 'react-icons/fa';
import api from '../services/api';

const HomePage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalNgos: 0,
    pickupsCompleted: 0,
  });
  const [topUsers, setTopUsers] = useState([]);

  const token = localStorage.getItem('user_token');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/stats");
        setStats(response.data);
        api.get('/leaderboard?type=USER').then(res => setTopUsers(res.data.slice(0, 3)));
      } catch (error) {
        console.error("Failed to fetch site stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="font-sans text-gray-800">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-br from-green-50 to-green-100 overflow-hidden min-h-[600px] flex items-center">
        <div className="container mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 mb-12 md:mb-0 z-10 text-center md:text-left"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-gray-900 mb-6">
              Turn Your Waste <br/> Into <span className="text-green-600">Impact.</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto md:mx-0">
              Connect with local NGOs, schedule pickups for e-waste, plastics, and more. 
              Earn points, climb the leaderboard, and save the planet—one pickup at a time.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <Link to="/services" className="bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-green-700 hover:shadow-xl transition-all transform hover:-translate-y-1">
                Find Recyclers
              </Link>
              <Link to="/signup" className="bg-white text-green-600 font-bold py-3 px-8 rounded-full shadow-md border border-green-100 hover:border-green-300 transition-all">
                Join Now
              </Link>
            </div>
          </motion.div>

          {/* Image Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:w-1/2 relative flex justify-center items-end"
          >
            {/* Abstract Decorative blobs - Adjusted positions */}
            <div className="absolute top-10 right-10 w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob"></div>
            <div className="absolute bottom-0 left-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob animation-delay-2000"></div>
            <div className="absolute top-20 left-20 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob animation-delay-4000"></div>
            
            {/* UPDATED IMAGE STYLES */}
            <img 
              src="/recyconnectAmbassador_new.png"
              alt="RecyConnect Ambassador" 
              className="relative z-10 w-auto h-auto max-h-[400px] md:max-h-[550px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </motion.div>
        </div>
      </section>

      {/* 2. LIVE STATS COUNTER */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <motion.div whileHover={{ scale: 1.05 }} className="p-4">
            <p className="text-4xl font-bold text-green-600">{stats.totalNgos}+</p>
            <p className="text-gray-500 font-medium">Active Partners</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="p-4 border-l border-r border-gray-100">
            <p className="text-4xl font-bold text-blue-600">{stats.pickupsCompleted}+</p>
            <p className="text-gray-500 font-medium">Pickups Completed</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="p-4">
            <p className="text-4xl font-bold text-yellow-500">{stats.totalUsers}+</p>
            <p className="text-gray-500 font-medium">Eco-Warriors Joined</p>
          </motion.div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800">How RecyConnect Works</h2>
            <p className="text-gray-500 mt-2">Simple steps to make a big difference.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: <FaRecycle />, title: "1. Choose Waste", desc: "Select the type of waste (Plastic, E-waste, etc.) you want to recycle." },
              { icon: <FaTruck />, title: "2. Schedule Pickup", desc: "Find a nearby NGO on the map and book a convenient slot." },
              { icon: <FaLeaf />, title: "3. Earn & Track", desc: "Get EcoPoints for every pickup and track your carbon offset." }
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ delay: idx * 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="w-16 h-16 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. LEADERBOARD PREVIEW */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Top Green Heroes 🏆</h2>
            <p className="text-gray-600 mb-8">
              Compete with friends and neighbors. See who contributes most to a cleaner city.
              Check out the top performers of the month!
            </p>
            {token ? 
              <Link to="/dashboard" className="text-green-600 font-bold hover:underline flex items-center gap-2">
                View Full Leaderboard →
              </Link>
            :
              <Link to="/signup" className="text-green-600 font-bold hover:underline flex items-center gap-2">
                View Full Leaderboard →
              </Link>
            }
          </div>

          <div className="md:w-1/2 w-full">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-2xl text-white">
              <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Current Leaders</h3>
              <div className="space-y-4">
                {topUsers.length > 0 ? topUsers.map((user, i) => (
                  <div key={i} className="flex items-center justify-between bg-white/10 p-3 rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className={`font-bold text-xl w-6 text-center ${i===0?'text-yellow-400':i===1?'text-gray-400':'text-orange-400'}`}>#{i+1}</span>
                      <div className="flex items-center gap-2">
                        <FaUserFriends className="text-gray-400"/>
                        <span className="font-semibold">{user.name}</span>
                      </div>
                    </div>
                    <span className="font-mono text-green-400 font-bold">{user.ecoPoints} XP</span>
                  </div>
                )) : (
                  <p className="text-gray-400 text-center">Loading leaders...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER CALL TO ACTION */}
      <section className="py-20 bg-green-600 text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to make a change?</h2>
          <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of users who are making our city cleaner, greener, and smarter.
          </p>
          {token ? 
              <Link to="/services" className="bg-white text-green-600 font-bold py-3 px-10 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                Get Started Free
              </Link>
            :
              <Link to="/signup" className="bg-white text-green-600 font-bold py-3 px-10 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                Get Started Free
              </Link>
          }
        </div>
      </section>

    </div>
  );
};

export default HomePage;