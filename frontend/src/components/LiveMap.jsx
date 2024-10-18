// src/components/LiveTracking.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LiveTracking = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationName, setLocationName] = useState('');

  const sendLocationToBackend = async (lat, lng) => {
    try {
      await axios.post(
        'http://localhost:5000/api/location/live-update',
        { latitude: lat, longitude: lng },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
    } catch (error) {
      console.error('Error updating live location', error);
    }
  };

  // Reverse geocoding to get location name using Nominatim API
  const getLocationName = async (lat, lng) => {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
      );
      const location = res.data.display_name; // Get the location name
      setLocationName(location); // Set location name in state
    } catch (error) {
      console.error('Error fetching location name', error);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);

          // Send live location to the server every time it updates
          sendLocationToBackend(latitude, longitude);

          // Get the human-readable location name
          getLocationName(latitude, longitude);
        },
        (error) => {
          console.error('Error getting position', error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );

      // Clean up the geolocation watcher on component unmount
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  return (
    <div>
      <h2>Live Tracking</h2>
      {latitude && longitude ? (
        <div>
          <p>Latitude: {latitude}, Longitude: {longitude}</p>
          {locationName && <p>Location: {locationName}</p>}
        </div>
      ) : (
        <p>Getting your location...</p>
      )}
    </div>
  );
};

export default LiveTracking;
