import React, { useState, useEffect } from 'react';
import MapComponent from '../components/MapComponent';
import Modal from '../components/Modal';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../services/api';

const FindServicesPage = () => {
  const [userPosition, setUserPosition] = useState(null);
  const [recyclers, setRecyclers] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecycler, setSelectedRecycler] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({ wasteType: '', notes: '' });
  const [bookingStatus, setBookingStatus] = useState({ message: '', error: false });

  useEffect(() => {
    const fetchRecyclers = async () => {
      try {
        const response = await api.get('/map/recyclers');
        setRecyclers(response.data);
      } catch (error) {
        console.error("Failed to fetch recycler locations:", error);
        toast.error("Could not load recycler locations.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecyclers();
  }, []);

  const handleFindMe = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserPosition([latitude, longitude]);
        console.log('Location found:', [latitude, longitude]);
      },
      (error) => {
        console.error("Error getting user location:", error);
        toast.info("Could not get your location. Please ensure you have granted permission.");
      }
    );
  };

  // Function to open the modal
  const handleBookClick = (recycler) => {
    setSelectedRecycler(recycler);
    setIsModalOpen(true);
    setBookingStatus({ message: '', error: false }); // Reset status
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      // In a real app, you might pass selectedRecycler.id to the backend
      const response = await api.post('/bookings', bookingDetails);
      setBookingStatus({ message: `Success! Booking ID: ${response.data.id}`, error: false });
      // Close modal after a short delay
      setTimeout(() => {
        setIsModalOpen(false);
      }, 2000);
    } catch (error) {
      setBookingStatus({ message: 'Booking failed. Please try again.', error: true });
      console.error("Booking failed:", error);
    }
  };

  return (
    <div className="animate-fade-in relative">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Find Recycling Services</h1>
        <p className="text-lg text-gray-600 mt-2">Explore nearby NGOs and recyclers.</p>
      </div>

      {/* We pass the user's position down to the MapComponent */}
      <div className="relative">
        {loading ? (
            <div className="flex justify-center items-center h-[60vh] bg-gray-100 rounded-lg">Loading Map...</div>
        ) : (
            <MapComponent userPosition={userPosition} recyclers={recyclers} onBookClick={handleBookClick} />
        )}
        <button
          onClick={handleFindMe}
          className="absolute top-4 right-4 z-[1000] bg-white text-green-600 font-bold py-2 px-4 rounded-full shadow-lg hover:bg-green-50 transition-transform transform hover:scale-105 flex items-center space-x-2"
        >
          <FaMapMarkerAlt />
          <span>Find Me</span>
        </button>
      </div>
      {/* Booking Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={`Book Pickup with ${selectedRecycler?.name}`}
      >
        <form onSubmit={handleBookingSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="wasteType" className="block text-sm font-medium text-gray-700">Type of Waste</label>
              <select
                id="wasteType"
                value={bookingDetails.wasteType}
                onChange={(e) => setBookingDetails({ ...bookingDetails, wasteType: e.target.value })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                required
              >
                <option value="" disabled>Select a type</option>
                {selectedRecycler?.wasteTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Additional Notes (Optional)</label>
              <textarea
                id="notes"
                rows={3}
                value={bookingDetails.notes}
                onChange={(e) => setBookingDetails({ ...bookingDetails, notes: e.target.value })}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Items are in a blue bag near the gate."
              />
            </div>
          </div>
          <div className="mt-6">
            <button type="submit" className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Confirm Booking
            </button>
          </div>
          {bookingStatus.message && (
            <p className={`mt-4 text-center text-sm ${bookingStatus.error ? 'text-red-600' : 'text-green-600'}`}>
              {bookingStatus.message}
            </p>
          )}
        </form>
      </Modal>
    </div>
  );
};

export default FindServicesPage;