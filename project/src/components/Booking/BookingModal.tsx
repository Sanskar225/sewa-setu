import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Star,
} from 'lucide-react';
import { ProviderProfile } from '../../types';
import { apiService } from '../../services/api';
import toast from 'react-hot-toast';

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
  const [paymentMethod, setPaymentMethod] = useState('wallet');
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
        paymentMethod,
      });

      toast.success('Booking created successfully!');
      onClose();
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative z-50 bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Book Service</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Booking Form */}
        {step === 1 && (
          <div className="p-6 space-y-6">
            {/* Provider Info */}
            <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xl font-medium">{provider.user.name.charAt(0)}</span>
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

            {/* Form Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Category</label>
              <select
                value={bookingData.category}
                onChange={(e) =>
                  setBookingData({ ...bookingData, category: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select a service</option>
                {provider.categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date & Time</label>
                <input
                  type="datetime-local"
                  value={bookingData.dateTime}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, dateTime: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (hours)</label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={bookingData.duration}
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      duration: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Location</label>
              <input
                type="text"
                value={bookingData.location}
                onChange={(e) =>
                  setBookingData({ ...bookingData, location: e.target.value })
                }
                placeholder="Enter your address"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
              <textarea
                rows={3}
                value={bookingData.notes}
                onChange={(e) =>
                  setBookingData({ ...bookingData, notes: e.target.value })
                }
                placeholder="Any notes or requirements..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Price Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span>Rate</span>
                <span>₹{provider.rate}/hour</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Duration</span>
                <span>{bookingData.duration} hours</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total</span>
                <span>₹{provider.rate * bookingData.duration}</span>
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={
                  !bookingData.category ||
                  !bookingData.dateTime ||
                  !bookingData.location ||
                  bookingData.duration <= 0
                }
                className="flex-1 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-semibold">Payment Details</h3>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center mb-3 space-x-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <span className="font-medium">Choose Payment Method</span>
              </div>
              <div className="space-y-2">
                {['wallet', 'card', 'upi'].map((method) => (
                  <label key={method} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="payment"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                    />
                    <span className="capitalize">{method}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-1">
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
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total</span>
                <span>₹{provider.rate * bookingData.duration}</span>
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              >
                Back
              </button>
              <button
                onClick={handleBooking}
                disabled={loading}
                className="flex-1 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
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
