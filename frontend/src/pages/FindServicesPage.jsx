import React, { useState, useEffect, useCallback } from 'react';
import MapComponent from '../components/MapComponent';
import Modal from '../components/Modal';
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../services/api';
import debounce from 'lodash.debounce';

const WASTE_TYPES = ["Plastic", "Paper", "E-Waste", "Clothes", "Cardboard", "Batteries", "Textiles"];

const FindServicesPage = () => {
  const [userPosition, setUserPosition] = useState(null);
  const [recyclers, setRecyclers] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWasteType, setSelectedWasteType] = useState('');

  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecycler, setSelectedRecycler] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({ wasteType: '', notes: '' });
  const [bookingStatus, setBookingStatus] = useState({ message: '', error: false });

  const fetchRecyclers = useCallback(async (query, wasteType) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (wasteType) params.append('wasteType', wasteType);

      const response = await api.get(`/map/recyclers?${params.toString()}`);
      setRecyclers(response.data);
    } catch (error) {
      toast.error("Could not load recycler locations.");
      console.error("Failed to fetch recycler locations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a debounced version of the fetch function
  const debouncedFetch = useCallback(debounce(fetchRecyclers, 500), [fetchRecyclers]);

  // useEffect for initial data load
  useEffect(() => {
    const token = localStorage.getItem('user_token');
    if (token) {
      fetchRecyclers('', ''); // Fetch all recyclers initially
    } else {
      setLoading(false); // If not logged in, just stop loading
    }
  }, [fetchRecyclers]);

  // useEffect for handling filter changes
  useEffect(() => {
    debouncedFetch(searchQuery, selectedWasteType);
    // Cleanup the debounce function on component unmount
    return () => debouncedFetch.cancel();
  }, [searchQuery, selectedWasteType, debouncedFetch]);

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
      const payload = {
        ...bookingDetails,
        ngoId: selectedRecycler.id
      };
      const response = await api.post('/bookings', payload);
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
        <p className="text-lg text-gray-600 mt-2">Search for a specific service or filter by waste type.</p>
      </div>

      {/* Filter and Search Controls */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-md flex flex-col md:flex-row gap-4 items-center">
        {/* Search Bar */}
        <div className="relative w-full md:w-1/2">
          <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
          />
        </div>
        {/* Waste Type Filter */}
        <div className="w-full md:w-1/2">
          <select
            value={selectedWasteType}
            onChange={(e) => setSelectedWasteType(e.target.value)}
            className="w-full py-2 px-3 border rounded-lg focus:ring-green-500 focus:border-green-500"
          >
            <option value="">All Waste Types</option>
            {WASTE_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
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
          className="absolute top-4 right-4 z-[800] bg-white text-green-600 font-bold py-2 px-4 rounded-full shadow-lg hover:bg-green-50 transition-transform transform hover:scale-105 flex items-center space-x-2"
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