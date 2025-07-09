import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Star, MessageCircle, Phone } from 'lucide-react';
import { apiService } from '../../services/api';
import { Booking } from '../../types';

export function BookingsList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  // const fetchBookings = async () => {
  //   try {
  //     const response = await apiService.getMyBookings();
  //     setBookings(response.bookings);
  //   } catch (error) {
  //     console.error('Error fetching bookings:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
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

    // ✅ Dummy Bookings Fallback
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
      <div className="p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-gray-600">Track and manage your service bookings</p>
        </div>
        
        <div className="flex space-x-2">
          {['all', 'pending', 'accepted', 'completed', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                filter === status
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {booking.provider?.name?.charAt(0) || 'P'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{booking.category}</h3>
                    <p className="text-gray-600">{booking.provider?.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                  <div className="text-right">
                    <div className="font-semibold">₹{booking.price}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">
                    {new Date(booking.dateTime).toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{booking.location}</span>
                </div>
              </div>

              {booking.notes && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    <strong>Notes:</strong> {booking.notes}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span>Message</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <Phone className="w-4 h-4" />
                    <span>Call</span>
                  </button>
                </div>

                <div className="flex space-x-2">
                  {booking.status === 'PENDING' && (
                    <button
                      onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')}
                      className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  
                  {booking.status === 'COMPLETED' && (
                    <button className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                      <Star className="w-4 h-4" />
                      <span>Rate</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? "You haven't made any bookings yet. Start by finding a service!" 
                : `No ${filter} bookings found.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}