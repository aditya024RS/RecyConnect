import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { toast } from 'react-toastify';

const AdminDashboardPage = () => {
  const [pendingNgos, setPendingNgos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingNgos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/ngos/pending');
      setPendingNgos(response.data);
    } catch (error) {
      toast.error('Failed to fetch pending NGOs.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingNgos();
  }, []);

  const handleApprove = async (ngoId) => {
    try {
      await api.post(`/admin/ngos/${ngoId}/approve`);
      toast.success(`NGO with ID ${ngoId} has been approved!`);
      // Refresh the list after approval
      fetchPendingNgos();
    } catch (error) {
      toast.error('Failed to approve NGO.');
      console.error(error);
    }
  };

  if (loading) {
    return <div className="text-center p-10">Loading Admin Dashboard...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-6"
    >
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Pending NGO Approvals</h2>
        {pendingNgos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">NGO Name</th>
                  <th className="py-3 px-4 text-left">Contact</th>
                  <th className="py-3 px-4 text-left">Address</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingNgos.map((ngo) => (
                  <tr key={ngo.id} className="border-b">
                    <td className="py-3 px-4">{ngo.user.name}</td>
                    <td className="py-3 px-4">{ngo.contactNumber}</td>
                    <td className="py-3 px-4">{ngo.address}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleApprove(ngo.id)}
                        className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition-colors"
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No pending approvals at the moment.</p>
        )}
      </div>
    </motion.div>
  );
};

export default AdminDashboardPage;