import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Clock,
  Star,
  ChevronRight
} from 'lucide-react';
import { ServiceMap } from './ServiceMap';
import { BookingModal } from '../Booking/BookingModal';
import { ProviderProfile, ServiceCategory } from '../../types';

export function ServiceSearch() {
  const [providers, setProviders] = useState<ProviderProfile[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<ProviderProfile | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [pickedLocation, setPickedLocation] = useState<[number, number] | null>(null);

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
      const dummyProviders: ProviderProfile[] = [
        {
          id: '1',
          user: { id: 'u1', name: 'Ankit Yadav', email: 'ankit@example.com', role: 'provider' },
          address: 'Hazratganj, Lucknow',
          latitude: 26.8486,
          longitude: 80.9462,
          rate: 400,
          skills: ['AC Repair', 'Installation'],
          categories: ['AC Technician']
        },
        {
          id: '2',
          user: { id: 'u2', name: 'Neha Singh', email: 'neha@example.com', role: 'provider' },
          address: 'Alambagh, Lucknow',
          latitude: 26.7956,
          longitude: 80.8998,
          rate: 600,
          skills: ['Salon Services', 'Makeup'],
          categories: ['Beautician']
        },
        {
          id: '3',
          user: { id: 'u3', name: 'Ravi Verma', email: 'ravi@example.com', role: 'provider' },
          address: 'Indira Nagar, Lucknow',
          latitude: 26.8768,
          longitude: 81.0064,
          rate: 500,
          skills: ['Cleaning', 'Home Sanitization'],
          categories: ['Cleaning']
        }
      ];

      const dummyCategories: ServiceCategory[] = [
        { id: 'cat1', name: 'AC Technician' },
        { id: 'cat2', name: 'Beautician' },
        { id: 'cat3', name: 'Cleaning' }
      ];

      setProviders(dummyProviders);
      setCategories(dummyCategories);
    } catch (error) {
      console.error('Error fetching providers:', error);
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
        () => {
          setUserLocation([28.6139, 77.2090]); // Fallback to Delhi
        }
      );
    } else {
      setUserLocation([28.6139, 77.2090]);
    }
  };

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch =
      provider.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.skills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      !selectedCategory ||
      provider.categories.some(
        (cat) => cat.toLowerCase() === selectedCategory.toLowerCase()
      );

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-bold mb-2">Find Services</h1>
            <p className="text-gray-600">Discover skilled professionals near you</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>

            <div className="flex bg-gray-100 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 transition-colors ${
                  viewMode === 'map'
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
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
            providers={filteredProviders}
            userLocation={userLocation}
            onProviderSelect={setSelectedProvider}
            onPickLocation={(loc) => {
              setPickedLocation(loc);
              setUserLocation(loc);
            }}
          />
        ) : (
          <div className="p-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-xl h-48"></div>
                  </div>
                ))}
              </div>
            ) : filteredProviders.length === 0 ? (
              <div className="text-center text-gray-500 text-lg py-10">
                No providers found matching your filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProviders.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => setSelectedProvider(provider)}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow text-left"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-xl font-medium">
                        {provider.user.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{provider.user.name}</h3>
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">4.8 (127 reviews)</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{provider.address}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>Available now</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-1">Skills:</div>
                      <div className="flex flex-wrap gap-2">
                        {provider.skills.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold">₹{provider.rate}/hour</div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProvider(provider);
                        }}
                        className="flex items-center space-x-1 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <span>Book Now</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedProvider && (
        <BookingModal provider={selectedProvider} onClose={() => setSelectedProvider(null)} />
      )}
    </div>
  );
}
