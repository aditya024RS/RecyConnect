import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const MapFlyTo = ({ position, zoomLevel }) => {
  const map = useMap(); // Get the map instance

  useEffect(() => {
    if (position) {
      map.flyTo(position, zoomLevel); // Animate the map view to the new position
    }
  }, [position, map, zoomLevel]);

  return null; // This component doesn't render anything visible
};

export default MapFlyTo;