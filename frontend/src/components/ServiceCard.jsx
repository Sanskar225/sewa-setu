// src/components/ServiceCard.jsx
import React from 'react';
import './ServiceCard.css';

const ServiceCard = ({ title, description }) => {
  return (
    <div className="service-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <button className="service-button">Learn More</button>
    </div>
  );
};

export default ServiceCard;
