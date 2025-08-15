import React, { useEffect, useState } from 'react';
import { Search, MapPin, Star, Shield, Clock } from 'lucide-react';
import { useMouseFollower } from '../../contexts/MouseFollowerContext';

const Hero: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const { setIsFollowing, isFollowing, setShowText, setTalkText } = useMouseFollower();

  // Loader timeout
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Enable follow mode on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!isFollowing) {
        setIsFollowing(true);
        setTimeout(() => {
          setShowText(false);
        }, 5000);
      }
    };
    window.addEventListener('scroll', handleScroll, { once: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFollowing, setIsFollowing, setShowText]);

  const handleSearch = () => {
    console.log('Searching for:', searchQuery, 'in', location);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center space-y-4">
        <img
          src="/assets/plumber-loader.png"
          alt="Loading..."
          className="w-36 h-36 object-contain animate-pulse"
        />
        <h1 className="text-[#4FAF1B] text-4xl font-bold tracking-wider animate-fadeIn">Parichay</h1>
      </div>
    );
  }

  return (
    <div id="Home" className="relative bg-black min-h-screen flex items-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white mix-blend-overlay animate-float1"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-white mix-blend-overlay animate-float2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-10">
            <div className="space-y-6">
              <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Home Services,
                <span className="text-white block mt-3">On Demand</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-lg leading-relaxed">
                Book trusted professionals for home cleaning, repairs, beauty, and more.
                Quality service at your doorstep.
              </p>
            </div>

            {/* Search Box */}
            <div className="bg-gray-900 rounded-2xl shadow-xl p-8 space-y-6 border border-gray-800">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search for services..."
                    className="w-full pl-12 pr-5 py-4 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-white focus:border-white placeholder-gray-400 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter location..."
                    className="w-full pl-12 pr-5 py-4 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-white focus:border-white placeholder-gray-400 transition-all"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
              <button
                onClick={handleSearch}
                className="w-full bg-white text-black py-4 px-6 rounded-xl hover:bg-gray-100 transition-all duration-300 font-medium shadow-lg hover:shadow-white/20"
              >
                Search Services
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">50K+</div>
                <div className="text-sm text-gray-300 uppercase tracking-wider">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">1000+</div>
                <div className="text-sm text-gray-300 uppercase tracking-wider">Service Providers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">25+</div>
                <div className="text-sm text-gray-300 uppercase tracking-wider">Cities</div>
              </div>
            </div>
          </div>

          {/* Right Content - Image with Cards */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-800">
              <img
                src="https://images.pexels.com/photos/4099238/pexels-photo-4099238.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Professional service provider"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>

            {/* Floating Cards */}
            <div
              onMouseEnter={() => setTalkText('We ensure all professionals are verified 🔐')}
              onMouseLeave={() => setTalkText(null)}
              className="absolute -top-5 -left-5 bg-white rounded-xl shadow-xl p-5 flex items-center space-x-4 hover:scale-105 transition-transform duration-300 border-2 border-gray-200"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-gray-800" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">Verified</div>
                <div className="text-xs text-gray-600">Professionals</div>
              </div>
            </div>

            <div
              onMouseEnter={() => setTalkText('Our customers rate us 4.8 ⭐')}
              onMouseLeave={() => setTalkText(null)}
              className="absolute -bottom-5 -right-5 bg-white rounded-xl shadow-xl p-5 flex items-center space-x-4 hover:scale-105 transition-transform duration-300 border-2 border-gray-200"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-gray-800" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">4.8 Rating</div>
                <div className="text-xs text-gray-600">Premium</div>
              </div>
            </div>

            <div
              onMouseEnter={() => setTalkText("Yes, we're open round the clock ⏰")}
              onMouseLeave={() => setTalkText(null)}
              className="absolute top-1/2 -left-8 bg-white rounded-xl shadow-xl p-5 flex items-center space-x-4 hover:scale-105 transition-transform duration-300 border-2 border-gray-200"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-gray-800" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">24/7</div>
                <div className="text-xs text-gray-600">Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;