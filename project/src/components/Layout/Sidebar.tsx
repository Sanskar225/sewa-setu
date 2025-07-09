import React from 'react';
import { 
  Home, Search, Calendar, CreditCard, Star, Settings, Users,
  MapPin, MessageSquare
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
    <div className={`bg-white border-r h-screen fixed lg:relative z-40 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} w-64`}>
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
          <div>
            <div className="font-semibold">PariChay</div>
            <div className="text-xs text-gray-500">Professional Services</div>
          </div>
        </div>
      </div>
      <nav className="mt-6">
        {getMenuItems().map(item => (
          <button
            key={item.path}
            onClick={() => onNavigate(item.path)}
            className="w-full flex items-center space-x-3 px-6 py-3 text-left text-gray-700 hover:bg-gray-100"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
