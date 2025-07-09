import React, { useState } from 'react';
import { ArrowLeft, MapPin, Star, Phone, MessageCircle, Calendar, Clock, User, Shield, CheckCircle } from 'lucide-react';

interface Provider {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  distance: string;
  price: number;
  image: string;
  phone: string;
  address: string;
  verified: boolean;
  availability: string[];
  specialties: string[];
  latitude: number;
  longitude: number;
}

interface ServiceDetailsProps {
  serviceName: string;
  onBack: () => void;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({ serviceName, onBack }) => {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');

  // Mock data for nearby providers
  const providers: Provider[] = [
    {
      id: '1',
      name: 'John Smith',
      rating: 4.8,
      reviews: 127,
      distance: '0.5 km',
      price: 50,
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      phone: '+1234567890',
      address: '123 Main St, Downtown',
      verified: true,
      availability: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'],
      specialties: ['Deep Cleaning', 'Kitchen Cleaning'],
      latitude: 40.7128,
      longitude: -74.0060,
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      rating: 4.9,
      reviews: 89,
      distance: '1.2 km',
      price: 45,
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
      phone: '+1234567891',
      address: '456 Oak Ave, Midtown',
      verified: true,
      availability: ['10:00 AM', '1:00 PM', '3:00 PM', '5:00 PM'],
      specialties: ['Bathroom Cleaning', 'Window Cleaning'],
      latitude: 40.7589,
      longitude: -73.9851,
    },
    {
      id: '3',
      name: 'Mike Wilson',
      rating: 4.7,
      reviews: 156,
      distance: '2.1 km',
      price: 55,
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
      phone: '+1234567892',
      address: '789 Pine St, Uptown',
      verified: true,
      availability: ['8:00 AM', '12:00 PM', '3:00 PM', '6:00 PM'],
      specialties: ['Carpet Cleaning', 'Furniture Cleaning'],
      latitude: 40.7831,
      longitude: -73.9712,
    },
  ];

  const handleWhatsAppContact = (provider: Provider) => {
    const message = `Hi ${provider.name}, I'm interested in booking ${serviceName} service. Can you help me?`;
    const whatsappUrl = `https://wa.me/${provider.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleBooking = (provider: Provider) => {
    setSelectedProvider(provider);
    setShowBookingModal(true);
  };

  const confirmBooking = () => {
    if (selectedProvider && selectedDate && selectedTime) {
      // Here you would typically make an API call to create the booking
      console.log('Booking confirmed:', {
        provider: selectedProvider.id,
        service: serviceName,
        date: selectedDate,
        time: selectedTime,
        notes: bookingNotes,
      });
      
      alert('Booking confirmed! You will receive a confirmation message shortly.');
      setShowBookingModal(false);
      setSelectedProvider(null);
      setSelectedDate('');
      setSelectedTime('');
      setBookingNotes('');
    }
  };

  const generateMapUrl = (provider: Provider) => {
    return `https://www.google.com/maps?q=${provider.latitude},${provider.longitude}&z=15`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-black shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">{serviceName}</h1>
              <p className="text-gray-400">Find nearby service providers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Providers List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Available Providers ({providers.length})</h2>
              <select className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white">
                <option>Sort by Distance</option>
                <option>Sort by Rating</option>
                <option>Sort by Price</option>
              </select>
            </div>

            {providers.map((provider) => (
              <div key={provider.id} className="bg-gray-800 rounded-2xl p-6 hover:bg-gray-750 transition-colors">
                <div className="flex items-start space-x-4">
                  <img
                    src={provider.image}
                    alt={provider.name}
                    className="w-16 h-16 rounded-full object-cover grayscale"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold">{provider.name}</h3>
                        {provider.verified && (
                          <Shield className="w-4 h-4 text-green-400" />
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">${provider.price}/hr</div>
                        <div className="text-sm text-gray-400">{provider.distance} away</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{provider.rating}</span>
                        <span className="text-gray-400">({provider.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{provider.address}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm text-gray-400 mb-1">Specialties:</div>
                      <div className="flex flex-wrap gap-2">
                        {provider.specialties.map((specialty, index) => (
                          <span
                            key={index}
                            className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleBooking(provider)}
                        className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium flex items-center space-x-2"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Book Now</span>
                      </button>
                      <button
                        onClick={() => handleWhatsAppContact(provider)}
                        className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center space-x-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>WhatsApp</span>
                      </button>
                      <button
                        onClick={() => window.open(`tel:${provider.phone}`, '_self')}
                        className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center space-x-2"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Call</span>
                      </button>
                      <button
                        onClick={() => window.open(generateMapUrl(provider), '_blank')}
                        className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center space-x-2"
                      >
                        <MapPin className="w-4 h-4" />
                        <span>Map</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Map Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-2xl p-6 sticky top-8">
              <h3 className="text-lg font-semibold mb-4">Provider Locations</h3>
              <div className="bg-gray-700 rounded-lg h-64 flex items-center justify-center mb-4">
                <div className="text-center text-gray-400">
                  <MapPin className="w-8 h-8 mx-auto mb-2" />
                  <p>Interactive Map</p>
                  <p className="text-sm">Click "Map" button to view location</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Quick Stats</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-700 rounded-lg p-3 text-center">
                    <div className="font-bold text-lg">{providers.length}</div>
                    <div className="text-gray-400">Available</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3 text-center">
                    <div className="font-bold text-lg">4.8</div>
                    <div className="text-gray-400">Avg Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold">Book {serviceName}</h2>
              <button
                onClick={() => setShowBookingModal(false)}
                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={selectedProvider.image}
                  alt={selectedProvider.name}
                  className="w-12 h-12 rounded-full object-cover grayscale"
                />
                <div>
                  <h3 className="font-semibold">{selectedProvider.name}</h3>
                  <p className="text-gray-400 text-sm">${selectedProvider.price}/hr</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Select Time</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                >
                  <option value="">Choose a time</option>
                  {selectedProvider.availability.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Additional Notes (Optional)</label>
                <textarea
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder="Any specific requirements or instructions..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-gray-400 focus:border-gray-400 h-20 resize-none"
                />
              </div>

              <button
                onClick={confirmBooking}
                disabled={!selectedDate || !selectedTime}
                className="w-full bg-white text-black py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Confirm Booking</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetails;