import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import MapFlyTo from './MapFlyTo';

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

const MapComponent = ({ userPosition }) => {
  // Default center (Kolkata)
  const defaultPosition = [22.5726, 88.3639];

  return (
    <MapContainer center={defaultPosition} zoom={13} style={{ height: '60vh', width: '100%' }} className="rounded-lg shadow-lg">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Marker for a sample service */}
      <Marker position={[22.5958, 88.2636]}>
        <Popup>
          Sample Recycler Inc. <br /> We accept plastics and paper.
        </Popup>
      </Marker>

      {/* Conditionally render marker for user's location */}
      {userPosition && (
        <Marker position={userPosition} icon={userIcon}>
          <Popup>You are here!</Popup>
        </Marker>
      )}

      {/* This component will handle flying to the user's location */}
      <MapFlyTo position={userPosition} zoomLevel={15} />

    </MapContainer>
  );
};

export default MapComponent;