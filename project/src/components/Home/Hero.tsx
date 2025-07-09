import React, { useEffect, useState } from 'react';
import { Search, MapPin, Star, Shield, Clock } from 'lucide-react';
import { ClimbingBoxLoader } from 'react-spinners';

const Hero: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // 2s loader
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = () => {
    console.log('Searching for:', searchQuery, 'in', location);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
        <ClimbingBoxLoader color="#485b91" size={22} speedMultiplier={1.1} />
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-white via-gray-100 to-gray-200 min-h-screen flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23000000%22 fill-opacity=%220.02%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Home Services,
                <span className="text-gray-700 block">On Demand</span>
              </h1>
              <p className="text-xl text-gray-700 max-w-md">
                Book trusted professionals for home cleaning, repairs, beauty, and more. 
                Quality service at your doorstep.
              </p>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for services..."
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 text-gray-800 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 placeholder-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter location..."
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 text-gray-800 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 placeholder-gray-400"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
              <button
                onClick={handleSearch}
                className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Search Services
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">50K+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">1000+</div>
                <div className="text-sm text-gray-600">Service Providers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">25+</div>
                <div className="text-sm text-gray-600">Cities</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.pexels.com/photos/4099238/pexels-photo-4099238.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Professional service provider"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent"></div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-gray-800" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Verified</div>
                <div className="text-xs text-gray-500">Professionals</div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-gray-800" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">4.8 Rating</div>
                <div className="text-xs text-gray-500">Premium</div>
              </div>
            </div>

            <div className="absolute top-1/2 -left-8 bg-white rounded-lg shadow-lg p-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-gray-800" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">24/7</div>
                <div className="text-xs text-gray-500">Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
