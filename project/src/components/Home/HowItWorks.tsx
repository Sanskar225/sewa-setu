import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, UserCheck, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useMouseFollower } from '../../contexts/MouseFollowerContext';
import AuthModal from '../Home/AuthModal';

const HowItWorks: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { setTalkText } = useMouseFollower();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/book/cleaning');
    } else {
      setIsModalOpen(true);
    }
  };

  const steps = [
    {
      id: 1,
      icon: <Search className="w-6 h-6 text-black" />,
      title: 'Search Services',
      description: 'Browse through our wide range of services and find what you need',
      hoverText: 'Find exactly what you need with our search 🔍'
    },
    {
      id: 2,
      icon: <Calendar className="w-6 h-6 text-black" />,
      title: 'Book & Schedule',
      description: 'Select your preferred date and time that works best for you',
      hoverText: 'Schedule at your convenience 🗓️'
    },
    {
      id: 3,
      icon: <UserCheck className="w-6 h-6 text-black" />,
      title: 'Get Matched',
      description: 'We connect you with verified professionals in your area',
      hoverText: 'We only work with verified pros ✅'
    },
    {
      id: 4,
      icon: <Star className="w-6 h-6 text-black" />,
      title: 'Enjoy Service',
      description: 'Sit back and enjoy professional service delivered to your door',
      hoverText: 'Relax while we handle everything 😌'
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-black relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-20 -left-20 w-64 h-64 rounded-full bg-white mix-blend-overlay"></div>
        <div className="absolute bottom-10 -right-10 w-80 h-80 rounded-full bg-white mix-blend-overlay"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative">
        <div className="text-center mb-20">
          <h2 
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            onMouseEnter={() => setTalkText("Discover our simple 4-step process!")}
            onMouseLeave={() => setTalkText(null)}
          >
            How It Works
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Getting professional services has never been easier. Just follow these simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className="relative group"
              onMouseEnter={() => setTalkText(step.hoverText)}
              onMouseLeave={() => setTalkText(null)}
            >
              <div className="h-full bg-gray-900 rounded-xl p-8 border border-gray-800 transition-all duration-300 group-hover:border-white group-hover:shadow-lg group-hover:shadow-white/10">
                <div className="flex flex-col items-center text-center h-full">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {step.description}
                  </p>
                  <div className="mt-auto w-8 h-8 bg-white text-black rounded-full flex items-center justify-center text-sm font-bold">
                    {step.id}
                  </div>
                </div>
              </div>

              {/* Connector Line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 left-full w-16 h-0.5 bg-gray-700 transform -translate-y-1/2 -translate-x-8">
                  <div className="w-0 h-full bg-white transition-all duration-500 group-hover:w-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-20">
          <button
            onClick={handleGetStarted}
            onMouseEnter={() => setTalkText("Ready to get started? Click me!")}
            onMouseLeave={() => setTalkText(null)}
            className="bg-white text-black px-10 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 font-medium mr-6 shadow-lg hover:shadow-white/20"
          >
            Get Started
          </button>
          <button 
            onMouseEnter={() => setTalkText("Want to know more about our services?")}
            onMouseLeave={() => setTalkText(null)}
            className="border-2 border-white text-white px-10 py-4 rounded-xl hover:bg-white hover:text-black transition-all duration-300 font-medium shadow-lg hover:shadow-white/20"
          >
            Learn More
          </button>
        </div>
      </div>

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