import React from 'react';
import { Smartphone, Download, QrCode } from 'lucide-react';

const DownloadApp: React.FC = () => {
  return (
    <section id="about"className="py-20 bg-gradient-to-r from-gray-800 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-6">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-8 h-8" />
              <span className="text-xl font-semibold">SewaSetu Mobile App</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold">
              Get the App for Better Experience
            </h2>
            
            <p className="text-xl opacity-90">
              Download our mobile app for faster bookings, real-time updates, and exclusive offers
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>One-tap booking and scheduling</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Real-time service provider tracking</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Exclusive app-only discounts</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Push notifications for updates</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-3">
                <Download className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </button>
              <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-3">
                <Download className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-xs">Get it on</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </button>
            </div>
          </div>

          {/* Right Content - QR Code and Phone Mockup */}
          <div className="relative">
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-6">
                <QrCode className="w-32 h-32 mx-auto text-gray-800" />
                <p className="text-gray-600 mt-4">
                  Scan QR code to download
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">4.8</div>
                  <div className="text-sm text-gray-600">App Rating</div>
                </div>
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">1M+</div>
                  <div className="text-sm text-gray-600">Downloads</div>
                </div>
              </div>
            </div>
            
            {/* Phone Mockup */}
            <div className="absolute -top-8 -right-8 w-48 h-96 bg-black rounded-3xl p-2 shadow-xl hidden lg:block">
              <div className="w-full h-full bg-gray-800 rounded-2xl flex items-center justify-center">
                <div className="text-white text-center">
                  <Smartphone className="w-16 h-16 mx-auto mb-4" />
                  <div className="text-sm font-medium">SewaSetu</div>
                  <div className="text-xs opacity-75">Mobile App</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadApp;