import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import MapFlyTo from './MapFlyTo';
import { FaRecycle, FaMapMarkerAlt, FaStar, FaTrophy } from 'react-icons/fa'; // Ensure react-icons is installed

// This code manually sets the default icon paths for markers.
import icon from 'leaflet-color-markers/img/marker-icon-2x-blue.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Create a custom icon for the user's location
const userIcon = new L.Icon({
  iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MapComponent = ({ userPosition, recyclers, onBookClick }) => {
  // Default center (Kolkata)
  const defaultPosition = [22.5726, 88.3639];
  
  // Get role for conditional rendering inside popups
  const userRole = localStorage.getItem('user_role');

  return (
    <MapContainer center={defaultPosition} zoom={13} style={{ height: '60vh', width: '100%', zIndex: 0 }} className="rounded-lg shadow-lg relative z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Render a marker for each recycler */}
      {recyclers && recyclers.map(recycler => (
        <Marker key={recycler.id} position={[recycler.latitude, recycler.longitude]}>
          <Popup className="custom-popup">
            <div className="p-1 min-w-[200px]">
                {/* Header */}
                <div className="flex items-center gap-2 border-b pb-2 mb-2">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                        <FaRecycle />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 text-base m-0 leading-tight">
                            {recycler.name}
                        </h3>
                        {/* NEW: Star Rating Display */}
                        <div className="flex items-center gap-1 mt-1">
                            <FaStar className="text-yellow-400 text-xs" />
                            <span className="text-xs font-bold text-gray-700">
                                {recycler.averageRating > 0 ? recycler.averageRating.toFixed(1) : "New"}
                            </span>
                            <span className="text-[10px] text-gray-400 ml-1">
                                ({recycler.completedPickups} pickups)
                            </span>
                        </div>
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-3">
                    {/* NEW: Verified Badge if pickups > 10 */}
                    {recycler.completedPickups > 10 && (
                        <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1">
                            <FaTrophy className="text-green-600" /> Top Recycler
                        </div>
                    )}

                    <div className="flex items-start gap-2 text-gray-600 text-sm">
                        <FaMapMarkerAlt className="mt-1 flex-shrink-0 text-red-400" />
                        <p className="m-0 leading-snug text-xs">{recycler.address}</p>
                    </div>
                    <div>
                        <div className="flex flex-wrap gap-1 mt-2">
                            {recycler.wasteTypes.map((type, i) => (
                                <span key={i} className="bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded border border-gray-200">
                                    {type}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Action Button - Only for Users */}
                {userRole !== 'ROLE_NGO' ? (
                    <button 
                      onClick={() => onBookClick(recycler)} 
                      className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2 px-4 rounded transition-colors shadow-sm"
                    >
                      Book Pickup
                    </button>
                ) : (
                    <div className="text-center text-xs text-gray-400 italic border-t pt-2">
                        Provider View
                    </div>
                )}
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Conditionally render marker for user's location */}
      {userPosition && (
        <Marker position={userPosition} icon={userIcon}>
          <Popup>
            <div className="text-center font-medium">You are here! 📍</div>
          </Popup>
        </Marker>
      )}

      {/* This component will handle flying to the user's location */}
      <MapFlyTo position={userPosition} zoomLevel={15} />

    </MapContainer>
  );
};

export default MapComponent;