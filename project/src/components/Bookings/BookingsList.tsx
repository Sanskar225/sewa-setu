import React, { useState, useEffect } from 'react';
import {
  Calendar, MapPin, Clock, Star, MessageCircle, Phone, 
  RefreshCcw, Clipboard, User, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import { apiService } from '../../services/api';
import { Booking } from '../../types';
import toast from 'react-hot-toast';

export function BookingsList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMyBookings();
      setBookings(response.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: string, status: string) => {
    try {
      setUpdating(bookingId);
      await apiService.updateBookingStatus(bookingId, status);
      toast.success(`Booking ${status.toLowerCase()} successfully`);
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    } finally {
      setUpdating(null);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter.toUpperCase();
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ACCEPTED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <AlertCircle className="w-4 h-4" />;
      case 'ACCEPTED': return <CheckCircle className="w-4 h-4" />;
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />;
      case 'CANCELLED': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-xl shadow-sm" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            📋 My Bookings
          </h1>
          <p className="text-gray-600 text-sm">Track and manage your service bookings with ease</p>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          {['all', 'pending', 'accepted', 'completed', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full capitalize text-sm font-medium border transition-all duration-200 ${
                filter === status
                  ? 'bg-gradient-to-r from-gray-900 to-gray-700 text-white border-gray-900 shadow-lg'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              {status}
            </button>
          ))}
          <button
            onClick={fetchBookings}
            title="Refresh"
            className="ml-2 p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            <RefreshCcw className={`w-4 h-4 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="space-y-5">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <div 
              key={booking.id} 
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-gray-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg font-semibold shadow-lg">
                    {booking.provider?.user?.name?.charAt(0) || booking.category.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{booking.category}</h3>
                    <p className="text-gray-600 text-sm flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {booking.provider?.user?.name || 'Provider'}
                    </p>
                  </div>
                </div>

                <div className="text-right space-y-2">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    {booking.status}
                  </div>
                  <div className="text-lg font-semibold text-gray-900">₹{booking.price}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{new Date(booking.dateTime).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="flex-1">{booking.location}</span>
                  <button
                    title="Copy location"
                    onClick={() => {
                      navigator.clipboard.writeText(booking.location);
                      toast.success('Location copied to clipboard');
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Clipboard className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {booking.notes && (
                <div className="text-sm text-gray-600 italic mb-4 bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <span className="font-medium text-blue-800">Note:</span> {booking.notes}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                    <Phone className="w-4 h-4" />
                    Call
                  </button>
                </div>
                
                <div className="flex gap-2">
                  {booking.status === 'PENDING' && (
                    <button
                      onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')}
                      disabled={updating === booking.id}
                      className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      {updating === booking.id ? 'Cancelling...' : 'Cancel'}
                    </button>
                  )}
                  {booking.status === 'COMPLETED' && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 text-sm font-medium">
                      <Star className="w-4 h-4" />
                      Rate Service
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
            <p className="text-gray-600 text-sm mb-6">
              {filter === 'all'
                ? "You haven't made any bookings yet. Start by finding a service!"
                : `No ${filter} bookings found.`}
            </p>
            <button 
              onClick={() => navigate('/dashboard/services')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium"
            >
              Find Services
            </button>
          </div>
        )}
      </div>
    </div>
  );
}