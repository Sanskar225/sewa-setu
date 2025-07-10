import React, { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import { Calendar, MapPin, Star, Clock } from 'lucide-react';
import { apiService } from '../../services/api';
import { Booking } from '../../types';

export function UserDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

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

  const successRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-gray-600">Here’s your recent booking activity</p>
      </header>

      {/* 📊 Stats Overview */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<Calendar className="w-8 h-8 text-gray-500" />} title="Total Bookings" value={stats.total} />
        <StatCard icon={<Star className="w-8 h-8 text-green-500" />} title="Completed" value={stats.completed} textColor="text-green-600" />
        <StatCard icon={<Clock className="w-8 h-8 text-orange-500" />} title="Pending" value={stats.pending} textColor="text-orange-600" />
        <SuccessRateCard successRate={successRate} />
      </section>

      {/* 📅 Recent Bookings */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>

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
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-semibold shadow-sm">
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

interface SuccessRateCardProps {
  successRate: number;
}

function SuccessRateCard({ successRate }: SuccessRateCardProps) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (successRate / 100) * circumference;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-800 mb-1">Success Rate</p>
          <p className="text-3xl font-extrabold text-blue-600">
            <CountUp end={successRate} duration={1.5} suffix="%" />
          </p>
        </div>
        <svg width="64" height="64" className="transform -rotate-90">
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="6"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
      </div>
    </div>
  );
}
