import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { toast } from 'react-toastify';

const NgoDashboardPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/ngo/bookings/requests');
      setRequests(response.data);
    } catch (error) {
      toast.error('Failed to fetch booking requests.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await api.post(`/ngo/bookings/${bookingId}/update-status`, { status: newStatus });
      toast.success(`Booking status updated to ${newStatus}!`);
      fetchRequests(); // Refresh the list
    } catch (error) {
      toast.error('Failed to update status.');
    }
  };

  if (loading) return <p>Loading requests...</p>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Booking Requests</h1>
      <div className="bg-white p-6 rounded-xl shadow-md">
        {requests.length > 0 ? (
          <ul className="space-y-4">
            {requests.map(req => (
              <li key={req.id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-bold">{req.wasteType} Pickup</p>
                  <p className="text-sm text-gray-600">Requested by: {req.userName}</p>
                  <p className="text-xs text-gray-400">Date: {new Date(req.bookingDate).toLocaleString()}</p>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleUpdateStatus(req.id, 'ACCEPTED')} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Accept</button>
                  <button onClick={() => handleUpdateStatus(req.id, 'COMPLETED')} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Complete</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No new booking requests.</p>
        )}
      </div>
    </motion.div>
  );
};

export default NgoDashboardPage;