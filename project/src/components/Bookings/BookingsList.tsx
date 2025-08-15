import React, { useState, useEffect } from 'react';
import {
  Calendar, MapPin, Clock, Star,
  MessageCircle, Phone, RefreshCcw, Clipboard
} from 'lucide-react';
import { apiService } from '../../services/api';
import { Booking } from '../../types';

export function BookingsList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await apiService.getMyBookings();
      if (response?.bookings?.length) {
        setBookings(response.bookings);
      } else {
        throw new Error('Empty response');
      }
    } catch (error) {
      console.warn('Using dummy bookings due to error or empty response:', error);
      setBookings([
        {
          id: 'b1',
          category: 'AC Repair',
          dateTime: new Date().toISOString(),
          location: 'Hazratganj, Lucknow',
          notes: 'Please come after 5 PM.',
          price: 600,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          provider: { name: 'Ankit Yadav' },
        },
        {
          id: 'b2',
          category: 'Salon Services',
          dateTime: new Date().toISOString(),
          location: 'Alambagh, Lucknow',
          notes: '',
          price: 800,
          status: 'COMPLETED',
          createdAt: new Date().toISOString(),
          provider: { name: 'Neha Singh' },
        },
        {
          id: 'b3',
          category: 'Home Cleaning',
          dateTime: new Date().toISOString(),
          location: 'Indira Nagar, Lucknow',
          notes: 'Bring your own equipment.',
          price: 500,
          status: 'CANCELLED',
          createdAt: new Date().toISOString(),
          provider: { name: 'Ravi Verma' },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: string, status: string) => {
    try {
      await apiService.updateBookingStatus(bookingId, status);
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter.toUpperCase();
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-orange-100 text-orange-800';
      case 'ACCEPTED': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-28 bg-gray-200 rounded-xl shadow-sm" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">📋 My Bookings</h1>
          <p className="text-gray-600 text-sm">Track and manage your service bookings with ease</p>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          {['all', 'pending', 'accepted', 'completed', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-1.5 rounded-full capitalize text-sm font-medium border transition-all duration-200 ${
                filter === status
                  ? 'bg-black text-white border-black shadow-md'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {status}
            </button>
          ))}
          <button
            onClick={fetchBookings}
            title="Refresh"
            className="ml-2 p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-100 transition"
          >
            <RefreshCcw className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="space-y-5">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-lg font-semibold text-gray-700">
                    {booking.provider?.name?.charAt(0) || 'P'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{booking.category}</h3>
                    <p className="text-gray-600 text-sm">{booking.provider?.name}</p>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                  <div className="text-base font-semibold">₹{booking.price}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {new Date(booking.dateTime).toLocaleString()}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{booking.location}</span>
                  <button
                    title="Copy location"
                    onClick={() => navigator.clipboard.writeText(booking.location)}
                    className="text-gray-400 hover:text-black"
                  >
                    <Clipboard className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {booking.notes && (
                <div className="text-sm text-gray-600 italic mb-3">
                  <span className="font-medium">Note:</span> {booking.notes}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <button className="flex items-center gap-1 px-4 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </button>
                  <button className="flex items-center gap-1 px-4 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                    <Phone className="w-4 h-4" />
                    Call
                  </button>
                </div>
                <div className="flex gap-2">
                  {booking.status === 'PENDING' && (
                    <button
                      onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')}
                      className="px-4 py-1.5 border border-red-400 text-red-600 rounded-lg hover:bg-red-50 transition"
                    >
                      Cancel
                    </button>
                  )}
                  {booking.status === 'COMPLETED' && (
                    <button className="flex items-center gap-1 px-4 py-1.5 bg-black text-white rounded-lg hover:bg-gray-800 transition">
                      <Star className="w-4 h-4" />
                      Rate
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 text-sm">
              {filter === 'all'
                ? "You haven't made any bookings yet. Start by finding a service!"
                : `No ${filter} bookings found.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
