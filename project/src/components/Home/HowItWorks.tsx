import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, UserCheck, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../Home/AuthModal';

const HowItWorks: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/book/cleaning'); // or any default service
    } else {
      setIsModalOpen(true);
    }
  };

  const steps = [
    {
      id: 1,
      icon: <Search className="w-8 h-8 text-black" />,
      title: 'Search Services',
      description: 'Browse through our wide range of services and find what you need',
      color: 'bg-gray-200',
    },
    {
      id: 2,
      icon: <Calendar className="w-8 h-8 text-black" />,
      title: 'Book & Schedule',
      description: 'Select your preferred date and time that works best for you',
      color: 'bg-gray-200',
    },
    {
      id: 3,
      icon: <UserCheck className="w-8 h-8 text-black" />,
      title: 'Get Matched',
      description: 'We connect you with verified professionals in your area',
      color: 'bg-gray-200',
    },
    {
      id: 4,
      icon: <Star className="w-8 h-8 text-black" />,
      title: 'Enjoy Service',
      description: 'Sit back and enjoy professional service delivered to your door',
      color: 'bg-gray-200',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-white via-gray-100 to-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Getting professional services has never been easier. Just follow these simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              <div className="text-center">
                <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-8 h-0.5 bg-gray-300 transform -translate-x-4"></div>
              )}

              {/* Step Number */}
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                {step.id}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button
            onClick={handleGetStarted}
            className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium mr-4"
          >
            Get Started
          </button>
          <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            Learn More
          </button>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialMode="login"
        redirectPath="/book/cleaning"
      />
    </section>
  );
};

export default HowItWorks;
