import React, { useState, useEffect, useCallback } from 'react';
import MapComponent from '../components/MapComponent';
import Modal from '../components/Modal';
import { FaMapMarkerAlt, FaSearch, FaFilter, FaRecycle, FaStickyNote } from 'react-icons/fa';
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

  // NEW: State to prevent double clicks
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userRole = localStorage.getItem('user_role');

  const fetchRecyclers = useCallback(async (query, wasteType) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (wasteType) params.append('wasteType', wasteType);

      const response = await api.get(`/map/recyclers?${params.toString()}`);
      setRecyclers(response.data);
    } catch (error) {
      toast.error("Could not load recycler locations. Please Login, to continue!");
      console.error("Failed to fetch recycler locations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedFetch = useCallback(debounce(fetchRecyclers, 500), [fetchRecyclers]);

  useEffect(() => {
    const token = localStorage.getItem('user_token');
    if (token) {
      fetchRecyclers('', ''); 
    } else {
      setLoading(false); 
    }
  }, [fetchRecyclers]);

  useEffect(() => {
    debouncedFetch(searchQuery, selectedWasteType);
    return () => debouncedFetch.cancel();
  }, [searchQuery, selectedWasteType, debouncedFetch]);

  const handleFindMe = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserPosition([latitude, longitude]);
      },
      (error) => {
        console.error("Error getting user location:", error);
        toast.info("Could not get your location. Please ensure you have granted permission.");
      }
    );
  };

  const handleBookClick = (recycler) => {
    if (userRole === 'ROLE_NGO') {
        toast.warning("Service Providers (NGOs) cannot book pickups.");
        return;
    }

    setSelectedRecycler(recycler);
    setIsModalOpen(true);
    setBookingStatus({ message: '', error: false }); 
    setIsSubmitting(false); // Reset submission state when opening modal
    setBookingDetails({ wasteType: '', notes: '' });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent duplicate submissions
    if (isSubmitting) return;

    setIsSubmitting(true); // Lock the button

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
        // We don't need to reset isSubmitting here because the modal closes, 
        // and handleBookClick resets it next time.
      }, 2000);
    } catch (error) {
      setBookingStatus({ message: 'Booking failed. Please try again.', error: true });
      console.error("Booking failed:", error);
      setIsSubmitting(false); // Unlock button only on error so they can retry
    }
  };

  return (
    <div className="animate-fade-in relative container mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Find Recycling Services</h1>
        <p className="text-lg text-gray-500 mt-2 max-w-2xl mx-auto">
            Locate nearest recycling centers or NGOs and schedule a pickup instantly.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="mb-8 p-5 bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-3/5">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400 text-lg" />
          </div>
          <input
            type="text"
            placeholder="Search by name, address, or landmark..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all outline-none text-base shadow-sm"
          />
        </div>

        <div className="relative w-full md:w-2/5">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
            </div>
            <select
                value={selectedWasteType}
                onChange={(e) => setSelectedWasteType(e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all outline-none appearance-none cursor-pointer shadow-sm"
            >
                <option value="">All Waste Types</option>
                {WASTE_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
                ))}
            </select>
             <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200">
        {loading ? (
            <div className="flex flex-col justify-center items-center h-[60vh] bg-gray-50 text-gray-500">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
                <p>Locating recyclers...</p>
            </div>
        ) : (
            <MapComponent userPosition={userPosition} recyclers={recyclers} onBookClick={handleBookClick} />
        )}
        
        <button
          onClick={handleFindMe}
          className="absolute top-4 right-4 z-[800] bg-white text-gray-700 hover:text-green-600 font-bold py-2.5 px-5 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2 border border-gray-100"
        >
          <FaMapMarkerAlt className="text-red-500" />
          <span>Locate Me</span>
        </button>
      </div>

      {/* Enhanced Booking Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={`Schedule Pickup`} 
      >
        <div className="px-1">
            <div className="mb-6 pb-4 border-b border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Provider</p>
                <h3 className="text-xl font-bold text-gray-800">{selectedRecycler?.name}</h3>
                <p className="text-xs text-gray-400">{selectedRecycler?.address}</p>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-5">
            <div>
                <label htmlFor="wasteType" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FaRecycle className="text-green-600"/> Type of Waste
                </label>
                <div className="relative">
                    <select
                    id="wasteType"
                    value={bookingDetails.wasteType}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, wasteType: e.target.value })}
                    className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors"
                    required
                    >
                        <option value="" disabled>Select a category...</option>
                        {selectedRecycler?.wasteTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label htmlFor="notes" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FaStickyNote className="text-yellow-500"/> Additional Instructions
                </label>
                <textarea
                    id="notes"
                    rows={3}
                    value={bookingDetails.notes}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, notes: e.target.value })}
                    className="block w-full p-3 border border-gray-300 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors resize-none"
                    placeholder="e.g., Gate code is 1234, Call upon arrival..."
                />
            </div>

            <div className="pt-4">
                {/* MODIFIED BUTTON: Disabled when submitting */}
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`w-full flex justify-center items-center gap-2 font-bold py-3.5 px-4 rounded-xl shadow-md transform transition-all focus:outline-none focus:ring-4 focus:ring-green-200
                        ${isSubmitting 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:shadow-lg active:scale-95 text-white'
                        }`}
                >
                    
                    Confirm Pickup Request
                    
                </button>
            </div>

            {bookingStatus.message && (
                <div className={`mt-4 p-3 rounded-lg text-center text-sm font-medium ${bookingStatus.error ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                {bookingStatus.message}
                </div>
            )}
            </form>
        </div>
      </Modal>
    </div>
  );
};

export default FindServicesPage;