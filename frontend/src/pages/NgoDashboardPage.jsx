import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import OtpVerificationForm from '../components/OtpVerificationForm';

const NgoDashboardPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(null);

  // State for the OTP modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Cooldown state { bookingId: expiryTimestamp }
  const [cooldowns, setCooldowns] = useState(() => {
    const saved = localStorage.getItem('otp_cooldowns');
    return saved ? JSON.parse(saved) : {};
  });

  // Force re-render every second to update timers
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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

  const handleAccept = async (bookingId) => {
    setIsSubmitting(bookingId); // Disable the button for this specific booking
    try {
      await api.post(`/ngo/bookings/${bookingId}/accept`);
      toast.success("Booking accepted! An OTP has been sent to the user.");
      fetchRequests(); // Refresh the list to show the status change
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept booking.');
    } finally {
      setIsSubmitting(null); // Re-enable buttons
    }
  };

  const handleResendOtp = async (bookingId) => {
    // Calculate new expiry (60 seconds from now)
    const expiryTime = Date.now() + 60000;
    
    // Update State & LocalStorage
    const newCooldowns = { ...cooldowns, [bookingId]: expiryTime };
    setCooldowns(newCooldowns);
    localStorage.setItem('otp_cooldowns', JSON.stringify(newCooldowns));

    try {
      await api.post(`/ngo/bookings/${bookingId}/resend-otp`);
      toast.success("OTP has been resent successfully!");
    } catch (error) {
      console.error("Failed to resend OTP", error);
      toast.error("Could not resend OTP. Please try again.");
      
      // Revert cooldown on error
      const revertedCooldowns = { ...cooldowns };
      delete revertedCooldowns[bookingId];
      setCooldowns(revertedCooldowns);
      localStorage.setItem('otp_cooldowns', JSON.stringify(revertedCooldowns));
    }
  };

  const handleCompleteClick = (booking) => {
      setSelectedBooking(booking);
      setIsModalOpen(true);
  };

  const onOtpSuccess = () => {
      setIsModalOpen(false);
      setSelectedBooking(null);
      fetchRequests();
  };

  // Helper to get remaining seconds
  const getRemainingTime = (bookingId) => {
      if (!cooldowns[bookingId]) return 0;
      const remaining = Math.ceil((cooldowns[bookingId] - now) / 1000);
      return remaining > 0 ? remaining : 0;
  };

  if (loading) {
    return (<div className="flex justify-center items-center h-screen"> <LoadingSpinner /> </div>);
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">
            Booking Requests
          </h1>
          <Link
            to="/edit-ngo-profile"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Edit Profile
          </Link>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          {requests.length > 0 ? (
            <ul className="space-y-4">
              {requests.map((req) => {

                const remainingSeconds = getRemainingTime(req.id);
                
                return (
                  <li
                    key={req.id}
                    className="p-4 bg-gray-50 rounded-lg flex flex-wrap justify-between items-center gap-4"
                  >
                    <div>
                      <p className="font-bold">{req.wasteType} Pickup</p>
                      <p className="text-sm text-gray-600">
                        Requested by: {req.userName}
                      </p>
                      <p className="text-xs text-gray-400">
                        Date: {new Date(req.bookingDate).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      {req.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleAccept(req.id)}
                            disabled={isSubmitting === req.id}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:bg-blue-300 mr-2"
                          >
                            {isSubmitting === req.id ? "Accepting..." : "Accept"}
                          </button>
                          
                          {/* NEW: Reject Button */}
                          <button
                            onClick={async () => {
                              if(!window.confirm("Are you sure you want to decline this request?")) return;
                              try {
                                await api.post(`/ngo/bookings/${req.id}/reject`);
                                toast.info("Request declined.");
                                fetchRequests();
                              } catch (e) { toast.error("Failed to decline."); }
                            }}
                            className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
                          >
                            Decline
                          </button>
                        </>
                      )}
                      {req.status === "ACCEPTED" && (
                        <>
                          {/* Resend Button with Timer Logic */}
                          <button
                            onClick={() => handleResendOtp(req.id)}
                            disabled={remainingSeconds > 0}
                            className={`text-sm font-medium px-2 transition-colors ${
                              remainingSeconds > 0 
                              ? 'text-gray-400 cursor-not-allowed' 
                              : 'text-blue-600 hover:text-blue-800 hover:underline'
                            }`}
                          >
                            {remainingSeconds > 0 
                              ? `Resend in ${remainingSeconds}s` 
                              : 'Resend OTP'}
                          </button>

                          <button
                            onClick={() => handleCompleteClick(req)}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 ml-2"
                          >
                            Complete
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No new booking requests.</p>
          )}
        </div>
      </motion.div>

      {/* The Modal for OTP Verification */}
      <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Complete Pickup for ${selectedBooking?.wasteType}`}
      >
          <OtpVerificationForm bookingId={selectedBooking?.id} onSuccess={onOtpSuccess} />
      </Modal>
    </>
  );
};

export default NgoDashboardPage;