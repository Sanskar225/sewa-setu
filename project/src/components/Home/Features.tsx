import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useMouseFollower } from '../../contexts/MouseFollowerContext';
import AuthModal from '../Home/AuthModal';
import { Shield, Clock, Wallet, MessageCircle, Star, MapPin } from 'lucide-react';

const Features: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { setTalkText } = useMouseFollower();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBookClick = () => {
    if (isAuthenticated) {
      navigate('/book/cleaning');
    } else {
      setIsModalOpen(true);
    }
  };

  const features = [
    {
      icon: <Shield className="w-6 h-6 text-black" />,
      title: 'Verified Professionals',
      description: 'All service providers are background verified and trained',
      color: 'bg-gray-200',
      hoverText: "We verify all professionals thoroughly 🔍"
    },
    {
      icon: <Clock className="w-6 h-6 text-black" />,
      title: '24/7 Availability',
      description: 'Book services anytime, anywhere with our 24/7 platform',
      color: 'bg-gray-200',
      hoverText: "Need help at 3 AM? We're available! ⏰"
    },
    {
      icon: <Wallet className="w-6 h-6 text-black" />,
      title: 'Secure Payments',
      description: 'Multiple payment options with wallet and secure transactions',
      color: 'bg-gray-200',
      hoverText: "Your payments are 100% secure 🔒"
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-black" />,
      title: 'Real-time Chat',
      description: 'Chat with service providers in real-time for better coordination',
      color: 'bg-gray-200',
      hoverText: "Message your provider directly 💬"
    },
    {
      icon: <Star className="w-6 h-6 text-black" />,
      title: 'Quality Guarantee',
      description: 'Rate and review services with our quality guarantee promise',
      color: 'bg-gray-200',
      hoverText: "We stand behind our services ⭐"
    },
    {
      icon: <MapPin className="w-6 h-6 text-black" />,
      title: 'Location Based',
      description: 'Find nearby service providers with GPS-based matching',
      color: 'bg-gray-200',
      hoverText: "Get services from providers near you 📍"
    },
  ];

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white mix-blend-overlay animate-float1"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-white mix-blend-overlay animate-float2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl font-bold text-white mb-6"
            onMouseEnter={() => setTalkText("Discover what makes us different")}
            onMouseLeave={() => setTalkText(null)}
          >
            Why Choose SewaSetu?
          </h2>
          <p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            onMouseEnter={() => setTalkText("We go the extra mile for you")}
            onMouseLeave={() => setTalkText(null)}
          >
            Experience the best-in-class features that make us the preferred choice for home services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-900 rounded-xl p-8 border border-gray-800 hover:border-white hover:shadow-lg hover:shadow-white/10 transition-all duration-300 group"
              onMouseEnter={() => setTalkText(feature.hoverText)}
              onMouseLeave={() => setTalkText(null)}
            >
              <div className={`w-14 h-14 ${feature.color} rounded-full flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div 
          className="mt-16 bg-gray-800 rounded-2xl p-10 text-center border border-gray-700 hover:border-white transition-colors"
          onMouseEnter={() => setTalkText("Join thousands of happy customers!")}
          onMouseLeave={() => setTalkText(null)}
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to experience premium home services?
          </h3>
          <p className="text-lg text-gray-300 mb-6">
            Join thousands of satisfied customers who trust SewaSetu for their home service needs
          </p>
          <button
            onClick={handleBookClick}
            className="bg-white text-black px-10 py-3 rounded-xl hover:bg-gray-100 transition-all duration-300 font-medium shadow-lg hover:shadow-white/20"
          >
            Book Your First Service
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

export default Features;