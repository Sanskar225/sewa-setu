import React from 'react';
import { Bell, MessageCircle, Wallet, User, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate=useNavigate()
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="font-bold text-xl">
          Pari<span className="text-gray-600">Chay</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button onClick={()=>{
          navigate("/notification")
        }} className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>
        
        <button onClick={()=>
          navigate('/dashboard/messages')
        } className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <MessageCircle className="w-5 h-5" />
        </button>
        
        <button onClick={()=>navigate("/wallet")} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Wallet className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="hidden md:block text-right">
            <div className="font-medium text-sm">{user?.name}</div>
            <div className="text-xs text-gray-500 capitalize">{user?.role.toLowerCase()}</div>
          </div>
          
          <button onClick={()=>navigate("/profile")} className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-4 h-4" />
          </button>
          
          <button 
            onClick={logout}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}