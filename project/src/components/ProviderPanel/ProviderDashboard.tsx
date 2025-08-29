import React, { useEffect, useState } from 'react';
import { MapPin, Clock, Camera, BarChart, HelpCircle, Medal, CheckCircle, AlertCircle } from 'lucide-react';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Booking } from '../../types';
import toast from 'react-hot-toast';

const ProviderDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [timerStart, setTimerStart] = useState<number | null>(null);
  const [availability, setAvailability] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await apiService.getMyJobs();
      setBookings(response.bookings || []);
    } catch (error) {
      console.error('Dashboard Error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleJobStart = (jobId: string) => {
    setCurrentJobId(jobId);
    setTimerStart(Date.now());
    toast.success('Job started! Timer is running.');
  };

  const handleJobComplete = async (jobId: string) => {
    try {
      await apiService.updateBookingStatus(jobId, 'COMPLETED');
      setCurrentJobId(null);
      setTimerStart(null);
      toast.success('Job completed successfully!');
      fetchDashboardData();
    } catch (error) {
      console.error('Error completing job:', error);
      toast.error('Failed to complete job');
    }
  };

  const handleJobAccept = async (jobId: string) => {
    try {
      await apiService.updateBookingStatus(jobId, 'ACCEPTED');
      toast.success('Job accepted!');
      fetchDashboardData();
    } catch (error) {
      console.error('Error accepting job:', error);
      toast.error('Failed to accept job');
    }
  };

  const todaysBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.dateTime);
    const today = new Date();
    return bookingDate.toDateString() === today.toDateString();
  });

  const stats = {
    total: bookings.length,
    completed: bookings.filter(b => b.status === 'COMPLETED').length,
    pending: bookings.filter(b => b.status === 'PENDING').length,
    accepted: bookings.filter(b => b.status === 'ACCEPTED').length,
  };

  const totalEarnings = bookings
    .filter(b => b.status === 'COMPLETED')
    .reduce((acc, b) => acc + (b.price || 0), 0);

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Provider Dashboard 👨‍🔧
        </h1>
        <p className="text-gray-600 text-sm">Manage your jobs and track your performance</p>
      </header>

      {/* Live Timer */}
      {currentJobId && timerStart && (
        <div className="bg-yellow-100 border border-yellow-300 p-4 rounded-xl mb-6 flex items-center gap-3">
          <Clock className="w-6 h-6 text-yellow-600" />
          <div>
            <span className="font-semibold text-yellow-800">Job #{currentJobId} in progress</span>
            <div className="text-sm text-yellow-700">
              Started: {new Date(timerStart).toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Total Jobs</p>
              <p className="text-3xl font-extrabold text-blue-600">{stats.total}</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <BarChart className="w-7 h-7 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-xl border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Completed</p>
              <p className="text-3xl font-extrabold text-green-600">{stats.completed}</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <CheckCircle className="w-7 h-7 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-orange-50 p-6 rounded-xl border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Pending</p>
              <p className="text-3xl font-extrabold text-orange-600">{stats.pending}</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <AlertCircle className="w-7 h-7 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-purple-100 mb-1">Total Earnings</p>
              <p className="text-3xl font-extrabold">₹{totalEarnings}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
              <Medal className="w-7 h-7" />
            </div>
          </div>
        </div>
      </section>

      {/* Today's Jobs */}
      <section className="bg-white shadow-lg rounded-xl p-6 mb-6 border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          Today's Bookings
        </h3>
        
        {todaysBookings.length > 0 ? (
          <div className="space-y-4">
            {todaysBookings.map((booking) => (
              <div key={booking.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {booking.user?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{booking.user?.name || 'Customer'}</p>
                        <p className="text-sm text-gray-600">{booking.category}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {new Date(booking.dateTime).toLocaleTimeString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {booking.location}
                      </div>
                      <div className="font-medium text-gray-900">₹{booking.price}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'PENDING' ? 'bg-orange-100 text-orange-800' :
                      booking.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-800' :
                      booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                    
                    {booking.status === 'PENDING' && (
                      <button 
                        className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                        onClick={() => handleJobAccept(booking.id)}
                      >
                        Accept
                      </button>
                    )}
                    
                    {booking.status === 'ACCEPTED' && currentJobId !== booking.id && (
                      <button 
                        className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition-colors"
                        onClick={() => handleJobStart(booking.id)}
                      >
                        Start Job
                      </button>
                    )}
                    
                    {currentJobId === booking.id && (
                      <button 
                        className="bg-purple-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-purple-700 transition-colors"
                        onClick={() => handleJobComplete(booking.id)}
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No bookings for today</p>
            <p className="text-sm">Check back later for new job requests</p>
          </div>
        )}
      </section>

      {/* Availability Toggle */}
      <section className="bg-white shadow-lg rounded-xl p-6 mb-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Availability Status</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${availability ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="font-medium">
              {availability ? 'Available for new bookings' : 'Not available'}
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={availability} 
              onChange={() => setAvailability(!availability)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </section>

      {/* Performance Analytics */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart className="w-5 h-5 text-purple-500" />
            Performance Overview
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completion Rate</span>
              <span className="font-semibold">
                {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Rating</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold">4.8</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Earnings</span>
              <span className="font-semibold">₹{totalEarnings}</span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Medal className="w-5 h-5 text-yellow-500" />
            Provider Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Medal className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Gold Provider</p>
                <p className="text-sm text-gray-600">Complete 5 more jobs to reach Platinum!</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-1000" 
                style={{ width: `${Math.min((stats.completed / 20) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProviderDashboard;