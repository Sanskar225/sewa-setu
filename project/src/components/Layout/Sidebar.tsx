import React from 'react';
import {
  Home, Search, Calendar, CreditCard, Star, Settings, Users,
  MapPin, MessageSquare, Instagram, Linkedin, Facebook, Twitter
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onNavigate: (path: string) => void;
}

export function Sidebar({ isOpen, onNavigate }: SidebarProps) {
  const { user } = useAuth();

  const userMenuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/dashboard/services', icon: Search, label: 'Find Services' },
    { path: '/dashboard/bookings', icon: Calendar, label: 'My Bookings' },
    { path: '/dashboard/payments', icon: CreditCard, label: 'Payments' },
    { path: '/dashboard/reviews', icon: Star, label: 'Reviews' },
    { path: '/dashboard/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  const providerMenuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/dashboard/jobs', icon: Calendar, label: 'My Jobs' },
    { path: '/dashboard/location', icon: MapPin, label: 'Location' },
    { path: '/dashboard/earnings', icon: CreditCard, label: 'Earnings' },
    { path: '/dashboard/reviews', icon: Star, label: 'Reviews' },
    { path: '/dashboard/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  const adminMenuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/dashboard/users', icon: Users, label: 'Users' },
    { path: '/dashboard/providers', icon: Users, label: 'Providers' },
    { path: '/dashboard/categories', icon: Search, label: 'Categories' },
    { path: '/dashboard/bookings', icon: Calendar, label: 'All Bookings' },
    { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  const getMenuItems = () => {
    switch (user?.role) {
      case 'PROVIDER': return providerMenuItems;
      case 'ADMIN': return adminMenuItems;
      default: return userMenuItems;
    }
  };

  return (
    <div
      className={`
        bg-black fixed top-0 left-0 w-64 z-40
        h-screen flex flex-col justify-between border-r
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      {/* Scrollable content */}
      <div className="flex-grow overflow-y-auto">
        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-bold">S</span>
            </div>
            <div>
              <div className="font-semibold text-white">सेवासेतु</div>
              <div className="text-xs text-white">Professional Services</div>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="mt-6">
          {getMenuItems().map(item => (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className="w-full flex items-center space-x-3 px-6 py-3 text-left text-white hover:text-lg transition-all duration-200"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Social icons pinned at the bottom */}
      <div className="flex items-center justify-center space-x-4 p-4">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-pink-500">
          <Instagram size={20} />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-500">
          <Linkedin size={20} />
        </a>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-700">
          <Facebook size={20} />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-400">
          <Twitter size={20} />
        </a>
      </div>
    </div>
  );
}
