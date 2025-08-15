import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';
import {
  Calendar, MapPin, Star, Clock, CreditCard, PlusCircle, Trophy, Lock
} from 'lucide-react';
import { apiService } from '../../services/api';
import { Booking } from '../../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function UserDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await apiService.getMyBookings();
        if (response?.bookings?.length) {
          setBookings(response.bookings);
        } else {
          throw new Error("No bookings found");
        }
      } catch (error) {
        console.warn('Using dummy bookings due to error or empty response:', error);
        setBookings([
          {
            id: 'b1',
            provider: { name: 'Ankit Yadav' },
            category: 'AC Repair',
            location: 'Hazratganj, Lucknow',
            status: 'COMPLETED',
            price: 500,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'b2',
            provider: { name: 'Neha Singh' },
            category: 'Salon Services',
            location: 'Alambagh, Lucknow',
            status: 'PENDING',
            price: 700,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'b3',
            provider: { name: 'Ravi Verma' },
            category: 'Home Cleaning',
            location: 'Indira Nagar, Lucknow',
            status: 'CANCELLED',
            price: 400,
            createdAt: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const recentBookings = bookings.slice(0, 3);
  const stats = {
    total: bookings.length,
    completed: bookings.filter(b => b.status === 'COMPLETED').length,
    pending: bookings.filter(b => b.status === 'PENDING').length,
    cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
  };

  const totalAmount = bookings.reduce((acc, b) => acc + (b.price || 0), 0);
  const successRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);

  const monthlyData = Array.from({ length: 6 }).map((_, i) => ({
    month: `Month ${i + 1}`,
    bookings: Math.floor(Math.random() * 10) + 1,
  }));

  const renderProgressBar = (progress: number) => (
    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }}></div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back 👋</h1>
        <p className="text-gray-600 text-sm">Here's a snapshot of your recent service activity</p>
      </header>

      {/* 📊 Stats Overview */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        <StatCard icon={<Calendar className="w-7 h-7 text-gray-500" />} title="Total Bookings" value={stats.total} />
        <StatCard icon={<Star className="w-7 h-7 text-green-500" />} title="Completed" value={stats.completed} textColor="text-green-600" />
        <StatCard icon={<Clock className="w-7 h-7 text-orange-500" />} title="Pending" value={stats.pending} textColor="text-orange-600" />
        <StatCard icon={<Calendar className="w-7 h-7 text-red-500" />} title="Cancelled" value={stats.cancelled} textColor="text-red-600" />
        <WalletCard totalAmount={totalAmount} />
      </section>

      {/* ⚡ Quick Actions */}
      <section className="flex flex-wrap gap-4 mb-10">
        <button onClick={() => navigate('/dashboard/bookings')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700">
          <PlusCircle className="w-5 h-5" /> Book New Service
        </button>
      </section>

      {/* 📈 Monthly Trends */}
      <section className="bg-white p-6 mb-10 rounded-xl border border-gray-200 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Monthly Booking Trends</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={monthlyData}>
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* 🏆 Achievements */}
      <section className="bg-white p-6 mb-10 rounded-xl border border-gray-200 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Your Achievements</h2>
        <div className="flex gap-4 flex-wrap">
          {/* Unlocked Achievements */}
          {stats.total >= 5 && (
            <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
              <Trophy className="w-5 h-5" /> 5+ Bookings
            </div>
          )}
          {stats.total >= 10 && (
            <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg">
              <Trophy className="w-5 h-5" /> 10+ Bookings
            </div>
          )}
          {successRate >= 80 && (
            <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
              <Trophy className="w-5 h-5" /> 80%+ Success Rate
            </div>
          )}

          {/* Locked Achievements with progress */}
          {stats.total < 5 && (
            <div className="bg-gray-100 text-gray-500 px-4 py-2 rounded-lg opacity-80 w-60">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5" /> 5+ Bookings (Locked)
              </div>
              {renderProgressBar((stats.total / 5) * 100)}
            </div>
          )}
          {stats.total < 10 && (
            <div className="bg-gray-100 text-gray-500 px-4 py-2 rounded-lg opacity-80 w-60">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5" /> 10+ Bookings (Locked)
              </div>
              {renderProgressBar((stats.total / 10) * 100)}
            </div>
          )}
          {successRate < 80 && (
            <div className="bg-gray-100 text-gray-500 px-4 py-2 rounded-lg opacity-80 w-60">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5" /> 80%+ Success Rate (Locked)
              </div>
              {renderProgressBar(successRate)}
            </div>
          )}
        </div>
      </section>

      {/* 📅 Recent Bookings */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-5">Recent Bookings</h2>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        ) : recentBookings.length > 0 ? (
          <div className="space-y-4">
            {recentBookings.map(booking => (
              <div
                key={booking.id}
                onClick={() => navigate('/dashboard/bookings')}
                className="cursor-pointer flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-[2px] transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-semibold shadow-sm">
                    <span className="text-sm font-medium">
                      {booking.provider?.name?.charAt(0) || ""}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium">{booking.category}</h3>
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
          <div className="text-center py-8">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No bookings yet. Start by finding a service!</p>
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
}

function StatCard({ icon, title, value, textColor = 'text-black' }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-800 mb-1">{title}</p>
          <p className={`text-3xl font-extrabold ${textColor}`}>
            <CountUp end={+value} duration={1.5} separator="," />
          </p>
        </div>
        <div className="bg-gray-100 p-2 rounded-lg">{icon}</div>
      </div>
    </div>
  );
}

interface WalletCardProps {
  totalAmount: number;
}

function WalletCard({ totalAmount }: WalletCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-800 mb-1">Total Wallet</p>
          <p className="text-3xl font-extrabold text-purple-600">
            ₹<CountUp end={totalAmount} duration={1.5} separator="," />
          </p>
        </div>
        <div className="bg-purple-100 p-2 rounded-lg">
          <CreditCard className="w-7 h-7 text-purple-500" />
        </div>
      </div>
    </div>
  );
}
