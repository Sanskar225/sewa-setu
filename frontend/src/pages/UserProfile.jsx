// src/pages/UserProfile.jsx
import React from 'react';
import './UserProfile.css';

const UserProfile = () => {
  // Assume user data is fetched from Redux or API
  const user = {
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
  };

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <div className="profile-info">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
      </div>
      <button>Edit Profile</button>
    </div>
  );
};

export default UserProfile;
