import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [fromQuery, setFromQuery] = useState(''); // From location search query
  const [toQuery, setToQuery] = useState('');     // To location search query
  const [fromSuggestions, setFromSuggestions] = useState([]); // Suggestions for "From"
  const [toSuggestions, setToSuggestions] = useState([]);     // Suggestions for "To"
  const [fromCoordinates, setFromCoordinates] = useState(null); // Coordinates of "From"
  const [toCoordinates, setToCoordinates] = useState(null);     // Coordinates of "To"
  const [distance, setDistance] = useState(null); // Calculated distance between "From" and "To"

  // Function to fetch suggestions based on query and which search bar ("From" or "To")
  const getSuggestions = async (query, setSuggestions) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&limit=50`);
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  // Function to handle search changes and fetch suggestions for "From" or "To"
  const handleFromSearchChange = (e) => {
    setFromQuery(e.target.value);
    getSuggestions(e.target.value, setFromSuggestions);  // Fetch suggestions for "From"
  };

  const handleToSearchChange = (e) => {
    setToQuery(e.target.value);
    getSuggestions(e.target.value, setToSuggestions);  // Fetch suggestions for "To"
  };

  // Function to handle suggestion selection for "From" and save coordinates
  const handleFromSuggestionClick = (suggestion) => {
    setFromQuery(suggestion.display_name); // Set selected place name
    setFromCoordinates({
      latitude: suggestion.lat,
      longitude: suggestion.lon,
    }); // Save coordinates of the selected place
    setFromSuggestions([]); // Clear suggestions
  };

  // Function to handle suggestion selection for "To" and save coordinates
  const handleToSuggestionClick = (suggestion) => {
    setToQuery(suggestion.display_name); // Set selected place name
    setToCoordinates({
      latitude: suggestion.lat,
      longitude: suggestion.lon,
    }); // Save coordinates of the selected place
    setToSuggestions([]); // Clear suggestions
  };

  // Haversine Formula to calculate distance between two coordinates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  // Calculate distance between "From" and "To" whenever both coordinates are set
  useEffect(() => {
    if (fromCoordinates && toCoordinates) {
      const calculatedDistance = calculateDistance(
        fromCoordinates.latitude,
        fromCoordinates.longitude,
        toCoordinates.latitude,
        toCoordinates.longitude
      );
      setDistance(calculatedDistance);
    }
  }, [fromCoordinates, toCoordinates]);

  return (
    <div>
      <h2>Calculate Distance Between Two Places</h2>

      {/* From Location Search */}
      <div>
        <label>From:</label>
        <input
          type="text"
          value={fromQuery}
          onChange={handleFromSearchChange}
          placeholder="Enter starting location"
          autoComplete="off"
        />
        {fromSuggestions.length > 0 && (
          <ul className="suggestions-dropdown">
            {fromSuggestions.map((suggestion) => (
              <li key={suggestion.place_id} onClick={() => handleFromSuggestionClick(suggestion)}>
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* To Location Search */}
      <div>
        <label>To:</label>
        <input
          type="text"
          value={toQuery}
          onChange={handleToSearchChange}
          placeholder="Enter destination location"
          autoComplete="off"
        />
        {toSuggestions.length > 0 && (
          <ul className="suggestions-dropdown">
            {toSuggestions.map((suggestion) => (
              <li key={suggestion.place_id} onClick={() => handleToSuggestionClick(suggestion)}>
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Show distance after both locations are selected */}
      {distance && (
        <p>
          The distance from <strong>{fromQuery}</strong> to <strong>{toQuery}</strong> is {distance.toFixed(2)} kilometers.
        </p>
      )}
    </div>
  );
};

export default Home;
