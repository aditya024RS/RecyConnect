import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../services/api';

const WASTE_TYPES = ["Plastic", "Paper", "E-Waste", "Clothes", "Cardboard", "Batteries", "Textiles", "Metal"];

const NgoApplicationPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contactNumber: '',
    acceptedWasteTypes: [],
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleWasteTypeChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      if (checked) {
        return { ...prev, acceptedWasteTypes: [...prev.acceptedWasteTypes, value] };
      } else {
        return { ...prev, acceptedWasteTypes: prev.acceptedWasteTypes.filter((type) => type !== value) };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.acceptedWasteTypes.length === 0) {
      toast.error("Please select at least one waste type.");
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/ngo/apply', formData);
      toast.success(response.data);
      navigate('/dashboard'); // Redirect back to dashboard after applying
    } catch (error) {
      toast.error('Application failed. Please check your details and try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto py-12 px-4"
    >
      <div className="p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Service Provider Application</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Fill out the details below to be listed on our platform.
        </p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Official NGO / Business Name</label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="e.g., Green Future Foundation"
            />
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Full Address</label>
            <textarea
              id="address"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="123 Green Lane, Recyville, State, 700001"
            />
          </div>

          <div>
            <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Contact Number</label>
            <input
              id="contactNumber"
              type="tel"
              required
              value={formData.contactNumber}
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Accepted Waste Types</label>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4">
              {WASTE_TYPES.map((type) => (
                <div key={type} className="flex items-center">
                  <input
                    id={type}
                    name="acceptedWasteTypes"
                    type="checkbox"
                    value={type}
                    onChange={handleWasteTypeChange}
                    className="h-4 w-4 text-green-600 border-gray-300 rounded"
                  />
                  <label htmlFor={type} className="ml-3 block text-sm text-gray-900">{type}</label>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-green-300"
          >
            {loading ? 'Submitting Application...' : 'Submit for Approval'}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default NgoApplicationPage;