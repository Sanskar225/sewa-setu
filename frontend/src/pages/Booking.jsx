import React, { useState } from 'react';
import './Booking.css';

const Booking = () => {
  const [dateTime, setDateTime] = useState('');
  const [providerId, setProviderId] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ dateTime, providerId, location });
  };

  return (
    <div className="booking-container">
      <h2>Book a Service</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Provider ID"
          value={providerId}
          onChange={(e) => setProviderId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <button type="submit">Book Now</button>
      </form>
    </div>
  );
};

export default Booking;
