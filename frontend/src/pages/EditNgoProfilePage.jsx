import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import api from "../services/api";
import LoadingSpinner from '../components/LoadingSpinner'; 
import {
  FaSave,
  FaBuilding,
  FaMapMarkerAlt,
  FaPhone,
  FaRecycle,
} from "react-icons/fa";

const WASTE_TYPES = [
  "Plastic",
  "Paper",
  "E-Waste",
  "Clothes",
  "Cardboard",
  "Batteries",
  "Textiles",
  "Metal",
];

const EditNgoProfilePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contactNumber: "",
    acceptedWasteTypes: [],
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/ngo/profile");
        setFormData(response.data);
      } catch (error) {
        toast.error("Failed to load your profile data.");
        console.error("Fetch profile error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleWasteTypeChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const currentTypes = prev.acceptedWasteTypes;
      if (checked) {
        return { ...prev, acceptedWasteTypes: [...currentTypes, value] };
      } else {
        return {
          ...prev,
          acceptedWasteTypes: currentTypes.filter((type) => type !== value),
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (
        !formData.name.trim() ||
        !formData.address.trim() ||
        !formData.contactNumber.trim()
      ) {
        toast.error("Please fill in all required fields.");
        setIsSubmitting(false);
        return;
      }
      if (formData.acceptedWasteTypes.length === 0) {
        toast.error("Please select at least one waste type.");
        setIsSubmitting(false);
        return;
      }
      if (
        formData.contactNumber.length !== 10 ||
        formData.contactNumber.charAt(0) < 6
      ) {
        toast.error("Please provide a valid contact number.");
        return;
      }

      await api.put("/ngo/profile", formData);
      toast.success("Profile updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
      console.error("Update profile error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (<div className="flex justify-center items-center h-screen"> <LoadingSpinner /> </div>);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto py-12 px-4"
    >
      <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">
          Edit Your Profile
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Update your organization's details to keep your information current
          for users.
        </p>

        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="flex items-center text-sm font-medium text-gray-700 mb-1"
            >
              <FaBuilding className="mr-2 text-green-600" /> Official NGO /
              Business Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-400"
              placeholder="e.g., Green Future Foundation"
            />
          </div>

          {/* Address Field */}
          <div>
            <label
              htmlFor="address"
              className="flex items-center text-sm font-medium text-gray-700 mb-1"
            >
              <FaMapMarkerAlt className="mr-2 text-green-600" /> Full Address
            </label>
            <textarea
              id="address"
              name="address"
              required
              value={formData.address}
              onChange={handleInputChange}
              rows="3"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-400"
              placeholder="123 Green Lane, Recyville, State, 700001"
            ></textarea>
          </div>

          {/* Contact Number Field */}
          <div>
            <label
              htmlFor="contactNumber"
              className="flex items-center text-sm font-medium text-gray-700 mb-1"
            >
              <FaPhone className="mr-2 text-green-600" /> Contact Number
            </label>
            <input
              id="contactNumber"
              name="contactNumber"
              type="tel"
              required
              value={formData.contactNumber}
              onChange={handleInputChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-400"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          {/* Accepted Waste Types Checkboxes */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FaRecycle className="mr-2 text-green-600" /> Accepted Waste Types
            </label>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {WASTE_TYPES.map((type) => (
                <div key={type} className="flex items-center">
                  <input
                    id={`waste-type-${type}`}
                    name="acceptedWasteTypes"
                    type="checkbox"
                    value={type}
                    checked={formData.acceptedWasteTypes.includes(type)}
                    onChange={handleWasteTypeChange}
                    className="h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                  />
                  <label
                    htmlFor={`waste-type-${type}`}
                    className="ml-3 text-sm font-medium text-gray-800 cursor-pointer"
                  >
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
          >
            <FaSave />
            {isSubmitting ? "Saving Changes..." : "Save Changes"}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default EditNgoProfilePage;
