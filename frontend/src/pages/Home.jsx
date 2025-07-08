import React from 'react';
import ServiceCard from '../components/ServiceCard';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to Parichay</h1>
      <p>Your one-stop solution for finding service providers.</p>
      <div className="service-cards">
        <ServiceCard title="Plumbing" description="Find the best plumbers near you." />
        <ServiceCard title="Cleaning" description="Professional cleaning services." />
        <ServiceCard title="Tutoring" description="Expert tutors for all subjects." />
      </div>
    </div>
  );
};

export default Home;
