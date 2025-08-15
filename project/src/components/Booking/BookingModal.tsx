import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Star,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { ProviderProfile } from '../../types';
import { apiService } from '../../services/api';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import clsx from 'clsx';

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
      await apiService.createBooking({
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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative z-50 bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Book Service</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center gap-3 py-3 text-sm text-gray-500 font-medium">
          <span className={clsx('px-3 py-1 rounded-full', step === 1 ? 'bg-black text-white' : 'bg-gray-100')}>1. Booking</span>
          <span className={clsx('px-3 py-1 rounded-full', step === 2 ? 'bg-black text-white' : 'bg-gray-100')}>2. Payment</span>
        </div>

        {/* Step 1: Booking Form */}
        {step === 1 && (
          <div className="p-6 space-y-6 transition-opacity duration-300 animate-fadeIn">
            {/* Provider Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-200 to-purple-300 text-white rounded-full flex items-center justify-center text-xl font-bold">
                {provider.user.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{provider.user.name}</h3>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm text-gray-600">4.8 (127 reviews)</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{provider.address}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-black">₹{provider.rate}/hr</div>
                <div className="text-xs text-gray-500">Starting from</div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Service Category</label>
                <select
                  value={bookingData.category}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  <label className="block text-sm font-medium mb-1">Date & Time</label>
                  <DatePicker
                    selected={bookingData.dateTime ? new Date(bookingData.dateTime) : null}
                    onChange={(date) =>
                      setBookingData({ ...bookingData, dateTime: date?.toISOString() || '' })
                    }
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={30}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    minDate={new Date()}
                    placeholderText="Choose a time"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Duration (hours)</label>
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
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={bookingData.location}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, location: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Special Instructions</label>
                <textarea
                  rows={3}
                  value={bookingData.notes}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, notes: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Any specific requirements?"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span>Rate</span>
                  <span>₹{provider.rate}/hour</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Duration</span>
                  <span>{bookingData.duration} hrs</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>Total</span>
                  <span>₹{provider.rate * bookingData.duration}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
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
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                Continue <ArrowRight className="inline ml-1 w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div className="p-6 space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-gray-800">Payment Details</h3>

            <div className="p-4 border rounded-xl bg-gray-50">
              <div className="flex items-center mb-3 gap-3">
                <CreditCard className="w-5 h-5 text-gray-500" />
                <span className="font-medium">Select Payment Method</span>
              </div>
              <div className="space-y-2">
                {['wallet', 'card', 'upi'].map((method) => (
                  <label
                    key={method}
                    className={clsx(
                      'flex items-center space-x-2 cursor-pointer p-2 rounded-lg',
                      paymentMethod === method ? 'bg-indigo-100' : ''
                    )}
                  >
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

            <div className="bg-white border rounded-lg p-4 text-sm">
              <div className="flex justify-between mb-1">
                <span>Service</span>
                <span>{bookingData.category}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Provider</span>
                <span>{provider.user.name}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Date & Time</span>
                <span>{new Date(bookingData.dateTime).toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Duration</span>
                <span>{bookingData.duration} hours</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total</span>
                <span>₹{provider.rate * bookingData.duration}</span>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft className="inline mr-1 w-4 h-4" /> Back
              </button>
              <button
                onClick={handleBooking}
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
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
