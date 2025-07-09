import React from 'react';
import { 
  Home, 
  Search, 
  Calendar, 
  CreditCard, 
  Star, 
  Settings, 
  Users,
  MapPin,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ isOpen, currentView, onViewChange }: SidebarProps) {
  const { user } = useAuth();

  const userMenuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'services', icon: Search, label: 'Find Services' },
    { id: 'bookings', icon: Calendar, label: 'My Bookings' },
    { id: 'payments', icon: CreditCard, label: 'Payments' },
    { id: 'reviews', icon: Star, label: 'Reviews' },
    { id: 'messages', icon: MessageSquare, label: 'Messages' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const providerMenuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'jobs', icon: Calendar, label: 'My Jobs' },
    { id: 'location', icon: MapPin, label: 'Location' },
    { id: 'earnings', icon: CreditCard, label: 'Earnings' },
    { id: 'reviews', icon: Star, label: 'Reviews' },
    { id: 'messages', icon: MessageSquare, label: 'Messages' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const adminMenuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'users', icon: Users, label: 'Users' },
    { id: 'providers', icon: Users, label: 'Providers' },
    { id: 'categories', icon: Search, label: 'Categories' },
    { id: 'bookings', icon: Calendar, label: 'All Bookings' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const getMenuItems = () => {
    switch (user?.role) {
      case 'PROVIDER':
        return providerMenuItems;
      case 'ADMIN':
        return adminMenuItems;
      default:
        return userMenuItems;
    }
  };

  return (
    <div className={`bg-white border-r border-gray-200 h-screen fixed lg:relative z-40 transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    } w-64`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
          <div>
            <div className="font-semibold">ServicePro</div>
            <div className="text-xs text-gray-500">Professional Services</div>
          </div>
        </div>
      </div>

      <nav className="mt-6">
        {getMenuItems().map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors ${
              currentView === item.id
                ? 'bg-gray-100 text-black border-r-2 border-black'
                : 'text-gray-600 hover:bg-gray-50 hover:text-black'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}