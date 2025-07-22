import React, { useState } from 'react';
import { Menu, X, Search, User, ShoppingCart, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from './AuthModal';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showSearchBox, setShowSearchBox] = useState(false);

  const { user, logout } = useAuth();

  const handleAuthClick = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <nav className="bg-[#4FAF1B] shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-lg">S</span>
                </div>
                <span className="text-xl font-bold text-black">सेवासेतु</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#Home" className="text-black hover:text-white font-medium transition-colors">
                Home
              </a>
              <a href="#services" className="text-black hover:text-white font-medium transition-colors">
                Services
              </a>
              <a href="#how-it-works" className="text-black hover:text-white font-medium transition-colors">
                How it Works
              </a>
              <a href="#about" className="text-black hover:text-white font-medium transition-colors">
                About
              </a>
              <a href="#footer" className="text-black hover:text-white font-medium transition-colors">
                Contact
              </a>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setShowSearchBox(!showSearchBox)}
                className="relative p-2 text-black hover:text-white transition-colors"
              >
                <Search size={20} />
                {showSearchBox && (
                  <div className="absolute top-10 right-0 bg-white shadow-lg rounded-lg p-3 w-64 z-50">
                    <input
                      type="text"
                      placeholder="Search services..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-black"
                      autoFocus
                    />
                  </div>
                )}
              </button>

              {user ? (
                <>
                  <button className="p-2 text-black hover:text-white transition-colors">
                    <Bell size={20} />
                  </button>
                  <div className="flex items-center space-x-3">
                    <a
                      href="/profile"
                      className="flex items-center space-x-2 text-black hover:text-white transition-colors"
                    >
                      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                        <User size={16} className="text-black" />
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </a>
                    <button
                      onClick={logout}
                      className="p-2 text-black hover:text-red-400 transition-colors"
                      title="Sign Out"
                    >
                      <LogOut size={20} />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleAuthClick('signup')}
                    className="bg-gray-700 text-black px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                  >
                    Join as Provider
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-black hover:text-white transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-black border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#home" className="block px-3 py-2 text-white hover:text-white font-medium">
                Home
              </a>
              <a href="#services" className="block px-3 py-2 text-white hover:text-white font-medium">
                Services
              </a>
              <a href="#how-it-works" className="block px-3 py-2 text-white hover:text-white font-medium">
                How it Works
              </a>
              <a href="#about" className="block px-3 py-2 text-white hover:text-white font-medium">
                About
              </a>
              <a href="#contact" className="block px-3 py-2 text-white hover:text-white font-medium">
                Contact
              </a>

              {user ? (
                <div className="pt-4 border-t border-white space-y-2">
                  <a
                    href="/profile"
                    className="flex items-center space-x-3 px-3 py-2 text-white hover:text-white font-medium"
                  >
                    <User size={20} />
                    <span>Profile</span>
                  </a>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-3 w-full px-3 py-2 text-white hover:text-red-400 font-medium text-left"
                  >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-800">
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="w-full bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium mb-2"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleAuthClick('signup')}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                  >
                    Join as Provider
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
};

export default Navigation;
