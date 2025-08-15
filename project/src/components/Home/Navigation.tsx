import React, { useState } from 'react';
import { Menu, X, Search, User, ShoppingCart, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useMouseFollower } from '../../contexts/MouseFollowerContext';
import AuthModal from './AuthModal';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showSearchBox, setShowSearchBox] = useState(false);
  const { setTalkText } = useMouseFollower();
  
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
            <div 
              className="flex-shrink-0 flex items-center"
              onMouseEnter={() => setTalkText("Welcome to SewaSetu")}
              onMouseLeave={() => setTalkText(null)}
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-[#4FAF1B] font-bold text-lg">S</span>
                </div>
                <span className="text-xl font-bold text-white">सेवासेतु</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { id: 'home', text: 'Home', hover: 'Go to homepage' },
                { id: 'services', text: 'Services', hover: 'Browse our services' },
                { id: 'how-it-works', text: 'How it Works', hover: 'See how it works' },
                { id: 'about', text: 'About', hover: 'Learn about us' },
                { id: 'footer', text: 'Contact', hover: 'Get in touch' }
              ].map((item) => (
                <a 
                  key={item.id}
                  href={`#${item.id}`}
                  className="text-white hover:text-gray-200 font-medium transition-colors px-2 py-1 rounded hover:bg-[#3e8f16]"
                  onMouseEnter={() => setTalkText(item.hover)}
                  onMouseLeave={() => setTalkText(null)}
                >
                  {item.text}
                </a>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setShowSearchBox(!showSearchBox)}
                className="relative p-2 text-white hover:text-gray-200 transition-colors"
                onMouseEnter={() => setTalkText("Search services")}
                onMouseLeave={() => setTalkText(null)}
              >
                <Search size={20} />
                {showSearchBox && (
                  <div className="absolute top-10 right-0 bg-white shadow-lg rounded-lg p-3 w-64 z-50">
                    <input
                      type="text"
                      placeholder="Search services..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4FAF1B] text-black"
                      autoFocus
                    />
                  </div>
                )}
              </button>

              {user ? (
                <>
                  <button 
                    className="p-2 text-white hover:text-gray-200 transition-colors relative"
                    onMouseEnter={() => setTalkText("Notifications")}
                    onMouseLeave={() => setTalkText(null)}
                  >
                    <Bell size={20} />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                  <div className="flex items-center space-x-3">
                    <a
                      href="/profile"
                      className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors"
                      onMouseEnter={() => setTalkText("Your profile")}
                      onMouseLeave={() => setTalkText(null)}
                    >
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow">
                        <User size={16} className="text-[#4FAF1B]" />
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </a>
                    <button
                      onClick={logout}
                      className="p-2 text-white hover:text-red-300 transition-colors"
                      onMouseEnter={() => setTalkText("Sign out")}
                      onMouseLeave={() => setTalkText(null)}
                    >
                      <LogOut size={20} />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="bg-white text-[#4FAF1B] px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium shadow hover:shadow-md"
                    onMouseEnter={() => setTalkText("Sign in to your account")}
                    onMouseLeave={() => setTalkText(null)}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleAuthClick('signup')}
                    className="bg-[#3e8f16] text-white px-4 py-2 rounded-lg hover:bg-[#357d12] transition-colors font-medium shadow hover:shadow-md"
                    onMouseEnter={() => setTalkText("Join as service provider")}
                    onMouseLeave={() => setTalkText(null)}
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
                className="p-2 text-white hover:text-gray-200 transition-colors"
                onMouseEnter={() => setTalkText(isMenuOpen ? "Close menu" : "Open menu")}
                onMouseLeave={() => setTalkText(null)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#3e8f16] shadow-xl">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {[
                { id: 'home', text: 'Home', hover: 'Go to homepage' },
                { id: 'services', text: 'Services', hover: 'Browse our services' },
                { id: 'how-it-works', text: 'How it Works', hover: 'See how it works' },
                { id: 'about', text: 'About', hover: 'Learn about us' },
                { id: 'footer', text: 'Contact', hover: 'Get in touch' }
              ].map((item) => (
                <a 
                  key={item.id}
                  href={`#${item.id}`}
                  className="block px-3 py-3 text-white hover:bg-[#4FAF1B] rounded-md font-medium"
                  onClick={() => setIsMenuOpen(false)}
                  onMouseEnter={() => setTalkText(item.hover)}
                  onMouseLeave={() => setTalkText(null)}
                >
                  {item.text}
                </a>
              ))}

              <div className="pt-2 border-t border-[#4FAF1B]">
                <div className="px-3 py-2 relative">
                  <input
                    type="text"
                    placeholder="Search services..."
                    className="w-full px-4 py-2 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4FAF1B]"
                  />
                  <Search 
                    size={20} 
                    className="absolute right-5 top-3.5 text-gray-500" 
                  />
                </div>
              </div>

              {user ? (
                <div className="pt-2 border-t border-[#4FAF1B] space-y-1">
                  <a
                    href="/profile"
                    className="flex items-center space-x-3 px-3 py-3 text-white hover:bg-[#4FAF1B] rounded-md font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={20} />
                    <span>Profile</span>
                  </a>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full px-3 py-3 text-white hover:bg-[#4FAF1B] rounded-md font-medium text-left"
                  >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t border-[#4FAF1B] space-y-2">
                  <button
                    onClick={() => {
                      handleAuthClick('login');
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-white text-[#4FAF1B] px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      handleAuthClick('signup');
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-[#357d12] text-white px-4 py-2 rounded-lg hover:bg-[#2a6b0e] transition-colors font-medium"
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