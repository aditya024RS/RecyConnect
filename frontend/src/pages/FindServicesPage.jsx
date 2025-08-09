import React, { useState, useEffect } from 'react';
import MapComponent from '../components/MapComponent';
import { FaMapMarkerAlt } from 'react-icons/fa';
import api from '../services/api';

const FindServicesPage = () => {
  const [userPosition, setUserPosition] = useState(null);
  const [recyclers, setRecyclers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecyclers = async () => {
      try {
        const response = await api.get('/map/recyclers');
        setRecyclers(response.data);
      } catch (error) {
        console.error("Failed to fetch recycler locations:", error);
        alert("Could not load recycler locations.");
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
        alert("Could not get your location. Please ensure you have granted permission.");
      }
    );
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
            <MapComponent userPosition={userPosition} recyclers={recyclers} />
        )}
        <button
          onClick={handleFindMe}
          className="absolute top-4 right-4 z-[1000] bg-white text-green-600 font-bold py-2 px-4 rounded-full shadow-lg hover:bg-green-50 transition-transform transform hover:scale-105 flex items-center space-x-2"
        >
          <FaMapMarkerAlt />
          <span>Find Me</span>
        </button>
      </div>
    </div>
  );
};

export default FindServicesPage;