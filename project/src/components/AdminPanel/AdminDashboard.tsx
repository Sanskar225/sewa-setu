import React, { useEffect, useState } from 'react';
import { Users, BarChart3, Briefcase, MapPin, ShieldCheck, HelpCircle, AlertTriangle, Bell, Gift, Layers, Activity } from 'lucide-react';
import { apiService } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProviders: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeAreas: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const res = await apiService.get('/admin/dashboard');
      setStats(res.data.stats);
      setRecentBookings(res.data.recentBookings);
    } catch (error) {
      console.error('Admin Dashboard Error:', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard - Sewa Sethu</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 shadow rounded-xl">
          <Users className="text-blue-600 mb-2" />
          <h4 className="text-sm">Total Service Providers</h4>
          <p className="text-xl font-bold">{stats.totalProviders}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-xl">
          <Briefcase className="text-green-600 mb-2" />
          <h4 className="text-sm">Total Bookings</h4>
          <p className="text-xl font-bold">{stats.totalBookings}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-xl">
          <BarChart3 className="text-purple-600 mb-2" />
          <h4 className="text-sm">Total Revenue</h4>
          <p className="text-xl font-bold">₹{stats.totalRevenue}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-xl">
          <MapPin className="text-pink-600 mb-2" />
          <h4 className="text-sm">Active Areas</h4>
          <p className="text-xl font-bold">{stats.activeAreas}</p>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white p-4 shadow rounded-xl mb-6">
        <h3 className="text-lg font-bold mb-3">Recent Bookings</h3>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">Booking ID</th>
              <th>Customer</th>
              <th>Provider</th>
              <th>Service</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentBookings.map((booking) => (
              <tr key={booking.id} className="border-b">
                <td className="py-2">#{booking.id}</td>
                <td>{booking.customerName}</td>
                <td>{booking.providerName}</td>
                <td>{booking.serviceType}</td>
                <td>{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Management Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 shadow rounded-xl">
          <ShieldCheck className="text-blue-500 mb-2" />
          <h4 className="text-lg font-bold mb-2">Manage Providers</h4>
          <button className="bg-blue-600 text-white px-4 py-1 rounded">View All</button>
        </div>
        <div className="bg-white p-4 shadow rounded-xl">
          <Briefcase className="text-green-500 mb-2" />
          <h4 className="text-lg font-bold mb-2">Manage Bookings</h4>
          <button className="bg-green-600 text-white px-4 py-1 rounded">Manage</button>
        </div>
        <div className="bg-white p-4 shadow rounded-xl">
          <HelpCircle className="text-red-500 mb-2" />
          <h4 className="text-lg font-bold mb-2">Help & Reports</h4>
          <button className="bg-red-600 text-white px-4 py-1 rounded">View Reports</button>
        </div>
      </div>

      {/* Advanced Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 shadow rounded-xl">
          <BarChart3 className="text-purple-600 mb-2" />
          <h4 className="text-lg font-bold mb-2">Revenue Analytics</h4>
          <button className="bg-purple-600 text-white px-4 py-1 rounded">View Chart</button>
        </div>
        <div className="bg-white p-4 shadow rounded-xl">
          <Activity className="text-yellow-600 mb-2" />
          <h4 className="text-lg font-bold mb-2">Live Status Overview</h4>
          <button className="bg-yellow-600 text-white px-4 py-1 rounded">Track Jobs</button>
        </div>
        <div className="bg-white p-4 shadow rounded-xl">
          <AlertTriangle className="text-orange-600 mb-2" />
          <h4 className="text-lg font-bold mb-2">Complaints & Disputes</h4>
          <button className="bg-orange-600 text-white px-4 py-1 rounded">View Issues</button>
        </div>
        <div className="bg-white p-4 shadow rounded-xl">
          <Layers className="text-indigo-600 mb-2" />
          <h4 className="text-lg font-bold mb-2">Service Categories</h4>
          <button className="bg-indigo-600 text-white px-4 py-1 rounded">Manage Services</button>
        </div>
        <div className="bg-white p-4 shadow rounded-xl">
          <Bell className="text-teal-600 mb-2" />
          <h4 className="text-lg font-bold mb-2">Push Notifications</h4>
          <button className="bg-teal-600 text-white px-4 py-1 rounded">Send Alerts</button>
        </div>
        <div className="bg-white p-4 shadow rounded-xl">
          <Gift className="text-pink-600 mb-2" />
          <h4 className="text-lg font-bold mb-2">Marketing & Promotions</h4>
          <button className="bg-pink-600 text-white px-4 py-1 rounded">Manage Offers</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
