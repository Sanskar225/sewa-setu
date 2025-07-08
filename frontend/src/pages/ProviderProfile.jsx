import React from 'react';
import './ProviderProfile.css';

const ProviderProfile = () => {
  // Assume provider data is fetched from Redux or API
  const provider = {
    name: "Jane Smith",
    skills: ["Plumbing", "Electrical"],
    rating: 4.5,
    description: "Experienced plumber and electrician.",
  };

  return (
    <div className="provider-profile">
      <h2>{provider.name}</h2>
      <p><strong>Skills:</strong> {provider.skills.join(", ")}</p>
      <p><strong>Rating:</strong> {provider.rating}</p>
      <p><strong>Description:</strong> {provider.description}</p>
      <button>Book Service</button>
    </div>
  );
};

export default ProviderProfile;
