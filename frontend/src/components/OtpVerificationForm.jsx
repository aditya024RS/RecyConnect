import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const OtpVerificationForm = ({ bookingId, onSuccess }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      await api.post(`/ngo/bookings/${bookingId}/complete`, { otp });
      toast.success("Booking completed successfully!");
      onSuccess(); // This will close the modal and refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired OTP.");
      console.error("OTP verification failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
          Enter 6-Digit OTP from User
        </label>
        <input
          id="otp"
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength="6"
          className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm text-center text-2xl tracking-[.5em]"
          placeholder="· · · · · ·"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-green-300"
      >
        {loading ? 'Verifying...' : 'Confirm & Complete Pickup'}
      </button>
    </form>
  );
};

export default OtpVerificationForm;