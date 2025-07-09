import React from 'react';
import { Shield, Clock, Wallet, MessageCircle, Star, MapPin } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-black" />,
      title: 'Verified Professionals',
      description: 'All service providers are background verified and trained',
      color: 'bg-gray-200',
    },
    {
      icon: <Clock className="w-8 h-8 text-black" />,
      title: '24/7 Availability',
      description: 'Book services anytime, anywhere with our 24/7 platform',
      color: 'bg-gray-200',
    },
    {
      icon: <Wallet className="w-8 h-8 text-black" />,
      title: 'Secure Payments',
      description: 'Multiple payment options with wallet and secure transactions',
      color: 'bg-gray-200',
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-black" />,
      title: 'Real-time Chat',
      description: 'Chat with service providers in real-time for better coordination',
      color: 'bg-gray-200',
    },
    {
      icon: <Star className="w-8 h-8 text-black" />,
      title: 'Quality Guarantee',
      description: 'Rate and review services with our quality guarantee promise',
      color: 'bg-gray-200',
    },
    {
      icon: <MapPin className="w-8 h-8 text-black" />,
      title: 'Location Based',
      description: 'Find nearby service providers with GPS-based matching',
      color: 'bg-gray-200',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose SewaSetu?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the best-in-class features that make us the preferred choice for home services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mb-6`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            Ready to experience premium home services?
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Join thousands of satisfied customers who trust SewaSetu for their home service needs
          </p>
          <button className="bg-white text-black px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium">
            Book Your First Service
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;