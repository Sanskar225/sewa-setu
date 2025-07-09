import React, { useState } from 'react';
import {
  User, Mail, Phone, MapPin, Calendar, Settings,
  Shield, Bell, CreditCard, Star, Edit3, Save, X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
  });

  const handleSave = () => {
    console.log('Saving profile data:', editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
    });
    setIsEditing(false);
  };

  const stats = [
    { label: 'Total Bookings', value: '24', icon: <Calendar className="w-5 h-5" /> },
    { label: 'Completed Services', value: '18', icon: <Star className="w-5 h-5" /> },
    { label: 'Average Rating', value: '4.8', icon: <Star className="w-5 h-5" /> },
    { label: 'Member Since', value: '2023', icon: <Shield className="w-5 h-5" /> },
  ];

  const recentBookings = [
    { id: 1, service: 'Home Cleaning', date: '2024-01-15', status: 'Completed', amount: '₹1200' },
    { id: 2, service: 'Plumbing Repair', date: '2024-01-10', status: 'Completed', amount: '₹850' },
    { id: 3, service: 'Electrical Work', date: '2024-01-05', status: 'Completed', amount: '₹1500' },
  ];

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow mb-8">
          <div className="bg-gradient-to-r from-white via-gray-100 to-white px-8 py-12">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-gray-700" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
                <p className="text-gray-600 text-lg">{user?.email}</p>
                <div className="flex items-center mt-2 text-gray-500">
                  <Shield className="w-4 h-4 mr-2" />
                  <span className="text-sm">Verified Member</span>
                </div>
              </div>
            </div>
          </div>

          {/* Editable Info */}
          <div className="px-8 py-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-medium"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name & Email */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-black"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 text-gray-800">
                      <User className="w-5 h-5 text-gray-400" />
                      <span>{editData.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-black"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 text-gray-800">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span>{editData.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Phone & Location */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-black"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 text-gray-800">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span>{editData.phone}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.location}
                      onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-black"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 text-gray-800">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span>{editData.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-700">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Bookings */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow mb-8">
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Recent Bookings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-8 py-4 text-left text-sm font-medium text-gray-600">Service</th>
                  <th className="px-8 py-4 text-left text-sm font-medium text-gray-600">Date</th>
                  <th className="px-8 py-4 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="px-8 py-4 text-left text-sm font-medium text-gray-600">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-8 py-4 text-sm text-gray-900">{booking.service}</td>
                    <td className="px-8 py-4 text-sm text-gray-600">{booking.date}</td>
                    <td className="px-8 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-sm text-gray-900">{booking.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="bg-white border border-gray-200 rounded-xl shadow p-6 hover:shadow-lg transition text-left">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 mb-4">
              <Settings className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Account Settings</h3>
            <p className="text-gray-600 text-sm">Manage your preferences and settings</p>
          </button>

          <button className="bg-white border border-gray-200 rounded-xl shadow p-6 hover:shadow-lg transition text-left">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 mb-4">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Payment Methods</h3>
            <p className="text-gray-600 text-sm">Update your card or UPI info</p>
          </button>

          <button
            onClick={logout}
            className="bg-white border border-gray-200 rounded-xl shadow p-6 hover:shadow-lg transition text-left"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-red-600 mb-2">Sign Out</h3>
            <p className="text-gray-600 text-sm">Sign out of your SewaSetu account</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
