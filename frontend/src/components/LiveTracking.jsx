// src/components/LiveTracking.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LiveTracking = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  // Function to send location to the backend
  const sendLocationToBackend = async (latitude, longitude) => {
    try {
      await axios.post(
        'http://localhost:5000/api/location/live-update',
        { latitude, longitude },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Attach token from localStorage
          },
        }
      );
    } catch (error) {
      console.error('Error updating live location', error);
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
        },
        (error) => {
          console.error('Error getting position', error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );

      // Cleanup function to stop watching location
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      console.error('Geolocation not supported');
    }
  }, []);

  return (
    <div>
      <h1>Live GPS Tracking</h1>
      {latitude && longitude ? (
        <p>
          Current Location: Latitude: {latitude}, Longitude: {longitude}
        </p>
      ) : (
        <p>Fetching location...</p>
      )}
    </div>
  );
};

export default LiveTracking;
