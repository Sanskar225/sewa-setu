import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, CreditCard, Star, MessageCircle } from 'lucide-react';
import { ProviderProfile } from '../../types';
import { apiService } from '../../services/api';

interface BookingModalProps {
  provider: ProviderProfile;
  onClose: () => void;
}

export function BookingModal({ provider, onClose }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    category: '',
    dateTime: '',
    location: '',
    notes: '',
    duration: 1,
  });
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    setLoading(true);
    try {
      const response = await apiService.createBooking({
        providerId: provider.userId,
        category: bookingData.category,
        dateTime: bookingData.dateTime,
        location: bookingData.location,
        notes: bookingData.notes,
        price: provider.rate * bookingData.duration,
      });
      
      alert('Booking created successfully!');
      onClose();
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Book Service</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 1 && (
          <div className="p-6">
            {/* Provider Info */}
            <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xl font-medium">
                  {provider.user.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{provider.user.name}</h3>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">4.8 (127 reviews)</span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{provider.address}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">₹{provider.rate}/hour</div>
                <div className="text-sm text-gray-600">Starting from</div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Category
                </label>
                <select
                  value={bookingData.category}
                  onChange={(e) => setBookingData({...bookingData, category: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">Select a service</option>
                  {provider.categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={bookingData.dateTime}
                    onChange={(e) => setBookingData({...bookingData, dateTime: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (hours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={bookingData.duration}
                    onChange={(e) => setBookingData({...bookingData, duration: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Location
                </label>
                <input
                  type="text"
                  value={bookingData.location}
                  onChange={(e) => setBookingData({...bookingData, location: e.target.value})}
                  placeholder="Enter your address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions
                </label>
                <textarea
                  value={bookingData.notes}
                  onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                  rows={3}
                  placeholder="Any special requirements or notes..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              {/* Price Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span>Service Rate</span>
                  <span>₹{provider.rate}/hour</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Duration</span>
                  <span>{bookingData.duration} hours</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total</span>
                    <span>₹{provider.rate * bookingData.duration}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!bookingData.category || !bookingData.dateTime || !bookingData.location}
                className="flex-1 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
            
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">Payment Method</span>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="payment" value="wallet" className="text-black" />
                    <span>Wallet Balance</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="payment" value="card" className="text-black" />
                    <span>Credit/Debit Card</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="payment" value="upi" className="text-black" />
                    <span>UPI</span>
                  </label>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Booking Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Service</span>
                    <span>{bookingData.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Provider</span>
                    <span>{provider.user.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date & Time</span>
                    <span>{new Date(bookingData.dateTime).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration</span>
                    <span>{bookingData.duration} hours</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t">
                    <span>Total Amount</span>
                    <span>₹{provider.rate * bookingData.duration}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleBooking}
                disabled={loading}
                className="flex-1 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}