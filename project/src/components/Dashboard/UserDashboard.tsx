import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';
import {
  Calendar, MapPin, Star, Clock, CreditCard, PlusCircle, Trophy, Lock, TrendingUp, User
} from 'lucide-react';
import { apiService } from '../../services/api';
import { Booking, Wallet } from '../../types';
import toast from 'react-hot-toast';

export function UserDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [bookingsRes, walletRes] = await Promise.all([
        apiService.getMyBookings(),
        apiService.getWallet()
      ]);
      
      setBookings(bookingsRes.bookings || []);
      setWallet(walletRes.wallet);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const recentBookings = bookings.slice(0, 3);
  const stats = {
    total: bookings.length,
    completed: bookings.filter(b => b.status === 'COMPLETED').length,
    pending: bookings.filter(b => b.status === 'PENDING').length,
    cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
  };

  const totalSpent = bookings
    .filter(b => b.status === 'COMPLETED')
    .reduce((acc, b) => acc + (b.price || 0), 0);
  
  const successRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);

  const renderProgressBar = (progress: number) => (
    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
      <div 
        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000" 
        style={{ width: `${Math.min(progress, 100)}%` }}
      ></div>
    </div>
  );

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
          Welcome back 👋
        </h1>
        <p className="text-gray-600 text-sm">Here's a snapshot of your recent service activity</p>
      </header>

      {/* Stats Overview */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          icon={<Calendar className="w-7 h-7 text-blue-500" />} 
          title="Total Bookings" 
          value={stats.total}
          bgColor="bg-blue-50"
          borderColor="border-blue-200"
        />
        <StatCard 
          icon={<Star className="w-7 h-7 text-green-500" />} 
          title="Completed" 
          value={stats.completed} 
          textColor="text-green-600"
          bgColor="bg-green-50"
          borderColor="border-green-200"
        />
        <StatCard 
          icon={<Clock className="w-7 h-7 text-orange-500" />} 
          title="Pending" 
          value={stats.pending} 
          textColor="text-orange-600"
          bgColor="bg-orange-50"
          borderColor="border-orange-200"
        />
        <WalletCard balance={wallet?.balance || 0} />
      </section>

      {/* Quick Actions */}
      <section className="flex flex-wrap gap-4 mb-10">
        <button 
          onClick={() => navigate('/dashboard/services')} 
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          <PlusCircle className="w-5 h-5" /> 
          Book New Service
        </button>
        <button 
          onClick={() => navigate('/dashboard/payments')} 
          className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          <CreditCard className="w-5 h-5" /> 
          Top Up Wallet
        </button>
      </section>

      {/* Performance Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            Your Stats
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="text-sm font-medium">{successRate}%</span>
              </div>
              {renderProgressBar(successRate)}
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Total Spent</span>
                <span className="text-sm font-medium">{formatCurrency(totalSpent)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Achievements
          </h3>
          <div className="space-y-3">
            {stats.total >= 5 && (
              <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-2 rounded-lg">
                <Trophy className="w-4 h-4" /> 
                <span className="text-sm font-medium">5+ Bookings</span>
              </div>
            )}
            {stats.total >= 10 && (
              <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg">
                <Trophy className="w-4 h-4" /> 
                <span className="text-sm font-medium">10+ Bookings</span>
              </div>
            )}
            {successRate >= 80 && (
              <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-2 rounded-lg">
                <Trophy className="w-4 h-4" /> 
                <span className="text-sm font-medium">80%+ Success Rate</span>
              </div>
            )}
            
            {/* Locked Achievements */}
            {stats.total < 5 && (
              <div className="bg-gray-100 text-gray-500 px-3 py-2 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="w-4 h-4" /> 
                  <span className="text-sm">5+ Bookings (Locked)</span>
                </div>
                {renderProgressBar((stats.total / 5) * 100)}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recent Bookings */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Recent Bookings</h2>
          <button 
            onClick={() => navigate('/dashboard/bookings')}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            View All
          </button>
        </div>

        {recentBookings.length > 0 ? (
          <div className="space-y-4">
            {recentBookings.map(booking => (
              <div
                key={booking.id}
                onClick={() => navigate('/dashboard/bookings')}
                className="cursor-pointer flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl hover:shadow-md hover:bg-gray-100 transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                    <span className="text-sm">
                      {booking.provider?.user?.name?.charAt(0) || booking.category.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{booking.category}</h3>
                    <p className="text-sm text-gray-600 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {booking.location}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'PENDING'
                        ? 'bg-orange-100 text-orange-800'
                        : booking.status === 'ACCEPTED'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {booking.status}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">{formatCurrency(booking.price)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-4">Start by finding a service!</p>
            <button 
              onClick={() => navigate('/dashboard/services')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Find Services
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  textColor?: string;
  bgColor?: string;
  borderColor?: string;
}

function StatCard({ 
  icon, 
  title, 
  value, 
  textColor = 'text-gray-900',
  bgColor = 'bg-white',
  borderColor = 'border-gray-200'
}: StatCardProps) {
  return (
    <div className={`${bgColor} p-6 rounded-xl border ${borderColor} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-extrabold ${textColor}`}>
            <CountUp end={+value} duration={1.5} separator="," />
          </p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm">{icon}</div>
      </div>
    </div>
  );
}

interface WalletCardProps {
  balance: number;
}

function WalletCard({ balance }: WalletCardProps) {
  return (
    <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-purple-100 mb-1">Wallet Balance</p>
          <p className="text-3xl font-extrabold">
            ₹<CountUp end={balance} duration={1.5} separator="," />
          </p>
        </div>
        <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
          <CreditCard className="w-7 h-7" />
        </div>
      </div>
    </div>
  );
}