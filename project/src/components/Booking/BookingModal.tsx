import React, { useState } from 'react';
import {
  X, Calendar, Clock, MapPin, CreditCard, Star,
  ArrowRight, ArrowLeft, User, CheckCircle
} from 'lucide-react';
import { ProviderProfile } from '../../types';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import clsx from 'clsx';

interface BookingModalProps {
  provider: ProviderProfile;
  onClose: () => void;
}

export function BookingModal({ provider, onClose }: BookingModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    category: '',
    dateTime: new Date(),
    location: '',
    notes: '',
    duration: 1,
  });
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    if (!user) {
      toast.error('Please login to book a service');
      return;
    }

    setLoading(true);
    try {
      await apiService.createBooking({
        userId: user.id,
        providerId: provider.userId,
        category: bookingData.category,
        dateTime: bookingData.dateTime.toISOString(),
        location: bookingData.location,
        notes: bookingData.notes,
        price: provider.rate * bookingData.duration,
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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative z-50 bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <h2 className="text-2xl font-bold text-gray-900">Book Service</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center gap-4 py-4 bg-gray-50 border-b border-gray-200">
          <div className={clsx(
            'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all',
            step === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          )}>
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">1</span>
            Booking Details
          </div>
          <div className={clsx(
            'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all',
            step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          )}>
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">2</span>
            Payment
          </div>
        </div>

        {/* Step 1: Booking Form */}
        {step === 1 && (
          <div className="p-6 space-y-6">
            {/* Provider Info */}
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                {provider.user.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900">{provider.user.name}</h3>
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm text-gray-600">4.8 (127 reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{provider.address}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-gray-900">₹{provider.rate}/hr</div>
                <div className="text-xs text-gray-500">Starting from</div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Service Category</label>
                <select
                  value={bookingData.category}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, category: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select a service</option>
                  {provider.categories?.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date & Time</label>
                  <DatePicker
                    selected={bookingData.dateTime}
                    onChange={(date) =>
                      setBookingData({ ...bookingData, dateTime: date || new Date() })
                    }
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={30}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    minDate={new Date()}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (hours)</label>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Service Location</label>
                <input
                  type="text"
                  value={bookingData.location}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, location: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter complete address"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Special Instructions</label>
                <textarea
                  rows={3}
                  value={bookingData.notes}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, notes: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any specific requirements or instructions?"
                />
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Booking Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rate per hour</span>
                    <span className="font-medium">₹{provider.rate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{bookingData.duration} hour{bookingData.duration !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="font-semibold text-gray-900">Total Amount</span>
                    <span className="font-bold text-lg text-blue-600">₹{provider.rate * bookingData.duration}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={
                  !bookingData.category ||
                  !bookingData.location ||
                  bookingData.duration <= 0
                }
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium flex items-center justify-center gap-2"
              >
                Continue to Payment
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div className="p-6 space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Details</h3>

            <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
              <div className="flex items-center mb-4 gap-3">
                <CreditCard className="w-5 h-5 text-gray-500" />
                <span className="font-semibold text-gray-900">Select Payment Method</span>
              </div>
              <div className="space-y-3">
                {[
                  { id: 'wallet', label: 'Wallet', icon: '💳' },
                  { id: 'card', label: 'Credit/Debit Card', icon: '💳' },
                  { id: 'upi', label: 'UPI', icon: '📱' }
                ].map((method) => (
                  <label
                    key={method.id}
                    className={clsx(
                      'flex items-center space-x-3 cursor-pointer p-3 rounded-lg border transition-all',
                      paymentMethod === method.id 
                        ? 'bg-blue-50 border-blue-300' 
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    )}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="text-blue-600"
                    />
                    <span className="text-lg">{method.icon}</span>
                    <span className="font-medium">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Booking Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service</span>
                  <span className="font-medium">{bookingData.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Provider</span>
                  <span className="font-medium">{provider.user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date & Time</span>
                  <span className="font-medium">{bookingData.dateTime.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{bookingData.duration} hour{bookingData.duration !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium">{bookingData.location}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="font-bold text-gray-900">Total Amount</span>
                  <span className="font-bold text-xl text-blue-600">₹{provider.rate * bookingData.duration}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={() => setStep(1)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={handleBooking}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Confirm Booking
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}