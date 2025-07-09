import React, { useState } from 'react';
import { Wrench, Sparkles, Scissors, Zap, Car, Palette, Home, Heart } from 'lucide-react';
import ServiceDetails from '../Home/AuthModal';

const ServiceCategories: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  if (selectedService) {
    return (
      <ServiceDetails 
        serviceName={selectedService} 
        onBack={() => setSelectedService(null)} 
      />
    );
  }

  const categories = [
    {
      id: 1,
      name: 'Cleaning',
      icon: <Sparkles className="w-8 h-8" />,
      description: 'Home & Office Cleaning',
      image: 'https://images.pexels.com/photos/4099467/pexels-photo-4099467.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'bg-gray-200 text-gray-800',
    },
    {
      id: 2,
      name: 'Repairs',
      icon: <Wrench className="w-8 h-8" />,
      description: 'Home Repairs & Fixes',
      image: 'https://images.pexels.com/photos/5691654/pexels-photo-5691654.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'bg-gray-200 text-gray-800',
    },
    {
      id: 3,
      name: 'Beauty',
      icon: <Scissors className="w-8 h-8" />,
      description: 'Salon & Spa Services',
      image: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'bg-gray-200 text-gray-800',
    },
    {
      id: 4,
      name: 'Electrical',
      icon: <Zap className="w-8 h-8" />,
      description: 'Electrical Services',
      image: 'https://images.pexels.com/photos/5691658/pexels-photo-5691658.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'bg-gray-200 text-gray-800',
    },
    {
      id: 5,
      name: 'Automotive',
      icon: <Car className="w-8 h-8" />,
      description: 'Car Care & Repair',
      image: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'bg-gray-200 text-gray-800',
    },
    {
      id: 6,
      name: 'Painting',
      icon: <Palette className="w-8 h-8" />,
      description: 'Home Painting',
      image: 'https://images.pexels.com/photos/1648771/pexels-photo-1648771.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'bg-gray-200 text-gray-800',
    },
    {
      id: 7,
      name: 'Plumbing',
      icon: <Home className="w-8 h-8" />,
      description: 'Plumbing Services',
      image: 'https://images.pexels.com/photos/8072716/pexels-photo-8072716.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'bg-gray-200 text-gray-800',
    },
    {
      id: 8,
      name: 'Wellness',
      icon: <Heart className="w-8 h-8" />,
      description: 'Health & Wellness',
      image: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'bg-gray-200 text-gray-800',
    },
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Popular Services
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose from our wide range of professional services delivered right to your doorstep
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
              onClick={() => setSelectedService(category.name)}
            >
              <div className="relative h-48 overflow-hidden bg-gray-700">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 grayscale opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  {category.icon}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  {category.description}
                </p>
                <button className="text-white hover:text-gray-300 font-medium text-sm group-hover:underline">
                  Book Now →
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-white text-black px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium">
            View All Services
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServiceCategories;