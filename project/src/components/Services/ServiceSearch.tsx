import React, { useState, useEffect } from 'react';
import {
  Search, MapPin, Clock, Star, ChevronRight, Filter, Grid, Map
} from 'lucide-react';
import { ServiceMap } from './ServiceMap';
import { BookingModal } from '../Booking/BookingModal';
import { ProviderProfile, ServiceCategory } from '../../types';
import { apiService } from '../../services/api';
import toast from 'react-hot-toast';

export function ServiceSearch() {
  const [providers, setProviders] = useState<ProviderProfile[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<ProviderProfile | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    const saved = localStorage.getItem('viewMode');
    if (saved === 'list' || saved === 'map') {
      setViewMode(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('viewMode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    fetchData();
    getUserLocation();
  }, []);

  const fetchData = async () => {
    try {
      const [providersRes, categoriesRes] = await Promise.all([
        apiService.getAllProviders(),
        apiService.getCategories()
      ]);
      
      setProviders(providersRes.providers || []);
      setCategories(categoriesRes.categories || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load services data');
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setUserLocation([26.8467, 80.9462]); // Fallback to Lucknow
        }
      );
    } else {
      setUserLocation([26.8467, 80.9462]);
    }
  };

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch =
      provider.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.skills?.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      provider.categories?.some((cat) =>
        cat.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      !selectedCategory ||
      provider.categories?.some(
        (cat) => cat.toLowerCase() === selectedCategory.toLowerCase()
      );

    return matchesSearch && matchesCategory;
  });

  const sortedProviders = [...filteredProviders].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return 0; // Mock rating sort since we don't have ratings yet
      case 'price':
        return a.rate - b.rate;
      case 'distance':
        return 0; // Mock distance sort
      default:
        return 0;
    }
  });

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white p-6 border-b border-gray-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Find Services
            </h1>
            <p className="text-gray-600">Discover skilled professionals near you</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search services or providers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 bg-white shadow-sm"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            >
              <option value="rating">Sort by Rating</option>
              <option value="price">Sort by Price</option>
              <option value="distance">Sort by Distance</option>
            </select>

            <div className="flex bg-gray-100 rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-3 transition-all duration-200 flex items-center gap-2 ${
                  viewMode === 'list'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="w-4 h-4" />
                List
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-3 transition-all duration-200 flex items-center gap-2 ${
                  viewMode === 'map'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Map className="w-4 h-4" />
                Map
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {viewMode === 'map' ? (
          <ServiceMap
            providers={sortedProviders}
            userLocation={userLocation}
            onProviderSelect={setSelectedProvider}
            onPickLocation={setUserLocation}
          />
        ) : (
          <div className="p-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-xl h-80"></div>
                  </div>
                ))}
              </div>
            ) : sortedProviders.length === 0 ? (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No providers found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or browse all categories
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6 text-sm text-gray-600">
                  Found {sortedProviders.length} provider{sortedProviders.length !== 1 ? 's' : ''}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProviders.map((provider) => (
                    <div
                      key={provider.id}
                      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300 group"
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                          {provider.user.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900">{provider.user.name}</h3>
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">4.8 (127 reviews)</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{provider.address}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className={`font-medium ${provider.availability ? 'text-green-600' : 'text-red-600'}`}>
                            {provider.availability ? 'Available now' : 'Not available'}
                          </span>
                        </div>
                      </div>

                      {provider.skills && provider.skills.length > 0 && (
                        <div className="mb-4">
                          <div className="text-sm text-gray-600 mb-2">Skills:</div>
                          <div className="flex flex-wrap gap-2">
                            {provider.skills.slice(0, 3).map((skill, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                            {provider.skills.length > 3 && (
                              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{provider.skills.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="text-xl font-bold text-gray-900">₹{provider.rate}/hour</div>
                        <button
                          onClick={() => setSelectedProvider(provider)}
                          disabled={!provider.availability}
                          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium group-hover:scale-105"
                        >
                          <span>Book Now</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedProvider && (
        <BookingModal 
          provider={selectedProvider} 
          onClose={() => setSelectedProvider(null)} 
        />
      )}
    </div>
  );
}