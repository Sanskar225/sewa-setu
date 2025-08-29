import React, { useEffect, useState } from 'react';
import { Users, BarChart3, Briefcase, MapPin, ShieldCheck, HelpCircle, AlertTriangle, Bell, Gift, Layers, Activity } from 'lucide-react';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface AdminStats {
  totalUsers: number;
  totalProviders: number;
  totalBookings: number;
  totalRevenue: number;
  activeAreas: number;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalProviders: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeAreas: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchAdminStats();
    }
  }, [user]);

  const fetchAdminStats = async () => {
    try {
      const [usersRes, providersRes, bookingsRes] = await Promise.all([
        apiService.getAllUsers(),
        apiService.getAllProviders(),
        apiService.request('/booking/all') // You'll need to add this endpoint
      ]);

      const users = usersRes.users || [];
      const providers = providersRes.providers || [];
      const bookings = bookingsRes.bookings || [];

      const totalRevenue = bookings
        .filter((b: any) => b.status === 'COMPLETED')
        .reduce((sum: number, b: any) => sum + (b.price || 0), 0);

      setStats({
        totalUsers: users.filter((u: any) => u.role === 'USER').length,
        totalProviders: providers.length,
        totalBookings: bookings.length,
        totalRevenue,
        activeAreas: 5 // Mock data for now
      });

      setRecentBookings(bookings.slice(0, 5));
    } catch (error) {
      console.error('Admin Dashboard Error:', error);
      toast.error('Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="p-6 text-center">
        <ShieldCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600">This page is only accessible to administrators</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          🛡️ Admin Dashboard
        </h1>
        <p className="text-gray-600">Monitor and manage your SewaSetu platform</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-600">Total Users</h4>
              <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-600">Service Providers</h4>
              <p className="text-3xl font-bold text-green-600">{stats.totalProviders}</p>
            </div>
            <ShieldCheck className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-600">Total Bookings</h4>
              <p className="text-3xl font-bold text-purple-600">{stats.totalBookings}</p>
            </div>
            <Briefcase className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-600">Total Revenue</h4>
              <p className="text-3xl font-bold text-pink-600">₹{stats.totalRevenue}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-pink-500" />
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white p-6 shadow-lg rounded-xl mb-8 border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" />
          Recent Bookings
        </h3>
        
        {recentBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 font-semibold text-gray-700">Booking ID</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Customer</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Provider</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Service</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentBookings.map((booking: any) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs">#{booking.id.slice(0, 8)}</td>
                    <td className="py-3 px-4">{booking.user?.name || 'N/A'}</td>
                    <td className="py-3 px-4">{booking.provider?.user?.name || 'N/A'}</td>
                    <td className="py-3 px-4">{booking.category}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        booking.status === 'PENDING' ? 'bg-orange-100 text-orange-800' :
                        booking.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold">₹{booking.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No recent bookings</p>
          </div>
        )}
      </div>

      {/* Management Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition-all">
          <ShieldCheck className="text-blue-500 mb-4 w-8 h-8" />
          <h4 className="text-lg font-bold mb-3 text-gray-900">Manage Providers</h4>
          <p className="text-gray-600 text-sm mb-4">View and manage service providers</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full">
            View All Providers
          </button>
        </div>

        <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition-all">
          <Users className="text-green-500 mb-4 w-8 h-8" />
          <h4 className="text-lg font-bold mb-3 text-gray-900">Manage Users</h4>
          <p className="text-gray-600 text-sm mb-4">View and manage platform users</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors w-full">
            View All Users
          </button>
        </div>

        <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition-all">
          <HelpCircle className="text-red-500 mb-4 w-8 h-8" />
          <h4 className="text-lg font-bold mb-3 text-gray-900">Support & Reports</h4>
          <p className="text-gray-600 text-sm mb-4">Handle customer support issues</p>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors w-full">
            View Reports
          </button>
        </div>
      </div>

      {/* Advanced Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition-all">
          <BarChart3 className="text-purple-600 mb-4 w-8 h-8" />
          <h4 className="text-lg font-bold mb-3 text-gray-900">Revenue Analytics</h4>
          <p className="text-gray-600 text-sm mb-4">View detailed revenue reports</p>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors w-full">
            View Analytics
          </button>
        </div>

        <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition-all">
          <Layers className="text-indigo-600 mb-4 w-8 h-8" />
          <h4 className="text-lg font-bold mb-3 text-gray-900">Service Categories</h4>
          <p className="text-gray-600 text-sm mb-4">Manage service categories</p>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors w-full">
            Manage Categories
          </button>
        </div>

        <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition-all">
          <Gift className="text-pink-600 mb-4 w-8 h-8" />
          <h4 className="text-lg font-bold mb-3 text-gray-900">Promotions</h4>
          <p className="text-gray-600 text-sm mb-4">Create and manage offers</p>
          <button className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors w-full">
            Manage Offers
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;