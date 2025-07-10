import React, { useState } from 'react';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

export function SettingsDashboard() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profilePic, setProfilePic] = useState(null);
  const [saving, setSaving] = useState(false);
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const [notifications, setNotifications] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = async () => {
    try {
      setSaving(true);
      await apiService.request('/auth/update-profile', {
        method: 'POST',
        body: JSON.stringify({ name, email, phone }),
      });
      toast.success('Profile updated!');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    // Call password update API here
    toast.success('Password changed successfully');
  };

  const handleDeleteAccount = async () => {
    // Confirm and delete account
    toast('Account deletion flow triggered.');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold mb-4">Settings</h1>

      {/* Profile Info */}
      <section className="bg-white p-6 rounded-xl border border-gray-200 space-y-6">
        <h2 className="text-xl font-semibold">Profile Info</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" value={email} disabled className="w-full px-4 py-2 border border-gray-200 bg-gray-100 rounded-lg" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
          <input type="file" accept="image/*" onChange={(e) => setProfilePic(e.target.files?.[0] || null)} />
        </div>

        <button onClick={handleSave} disabled={saving} className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </section>

      {/* Password & Security */}
      <section className="bg-white p-6 rounded-xl border border-gray-200 space-y-6">
        <h2 className="text-xl font-semibold">Password & Security</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
        </div>

        <button onClick={handlePasswordChange} className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800">Change Password</button>

        <div className="text-sm text-gray-500">(2FA and Recent Login history coming soon)</div>
      </section>

      {/* Preferences */}
      <section className="bg-white p-6 rounded-xl border border-gray-200 space-y-6">
        <h2 className="text-xl font-semibold">Preferences</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
          <select value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
            <option value="en">English</option>
            <option value="hi">Hindi</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
          <label className="text-sm font-medium text-gray-700">Enable Notifications</label>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="bg-red-50 p-6 rounded-xl border border-red-200">
        <h2 className="text-xl font-semibold text-red-700 mb-4">Danger Zone</h2>
        <button onClick={handleDeleteAccount} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
          Delete My Account
        </button>
      </section>
    </div>
  );
}
