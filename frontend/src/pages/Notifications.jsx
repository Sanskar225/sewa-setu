// src/pages/Notifications.jsx
import React from 'react';
import './Notifications.css';

const Notifications = () => {
  // Assume notifications data is fetched from Redux or API
  const notifications = [
    { id: 1, message: "Your booking has been confirmed." },
    { id: 2, message: "You have a new message from a provider." },
  ];

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      {notifications.map((notification) => (
        <div key={notification.id} className="notification">
          <p>{notification.message}</p>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
