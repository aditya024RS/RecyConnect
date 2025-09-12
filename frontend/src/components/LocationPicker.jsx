import React, { useEffect, useRef, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import { FaCrosshairs } from "react-icons/fa";
import { toast } from "react-toastify";

const MapController = ({ position, setPosition }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, 16, {
      animate: true,
      duration: 1.5,
    });
  }, [position, map]);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      showMarker: false,
    });
    map.addControl(searchControl);

    const onLocationSelect = (result) => {
      setPosition({ lat: result.location.y, lng: result.location.x });
    };

    map.on("geosearch/showlocation", onLocationSelect);
    return () => map.removeControl(searchControl);
  }, [map, setPosition]);

  return null;
};

const LocationPicker = ({ onConfirmLocation, initialPosition }) => {
  const [currentPosition, setCurrentPosition] = useState(
    initialPosition || { lat: 22.5726, lng: 88.3639 }
  );
  const markerRef = useRef(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setCurrentPosition(marker.getLatLng());
        }
      },
    }),
    []
  );

  const handleFindMe = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (error) => {
        toast.error(
          "Could not get your location. Please check browser permissions."
        );
        console.error("Geolocation error:", error);
      }
    );
  };

  return (
    <div className="relative z-[800]">
      <MapContainer
        center={currentPosition}
        zoom={13}
        style={{ height: "50vh", width: "100%" }}
        className="rounded-lg z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          draggable={true}
          eventHandlers={eventHandlers}
          position={currentPosition}
          ref={markerRef}
        />

        <MapController
          position={currentPosition}
          setPosition={setCurrentPosition}
        />
      </MapContainer>

      <button
        type="button"
        onClick={handleFindMe}
        className="absolute top-14 right-2.5 z-[800] bg-white p-2 rounded-md shadow-lg hover:bg-gray-100"
        title="Find My Location"
      >
        <FaCrosshairs size={18} className="text-gray-700" />
      </button>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => onConfirmLocation(currentPosition)}
          className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700"
        >
          Confirm This Location
        </button>
      </div>
    </div>
  );
};

export default LocationPicker;
