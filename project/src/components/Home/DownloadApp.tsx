import React from 'react';
import { Smartphone, Download, QrCode } from 'lucide-react';
import { useMouseFollower } from '../../contexts/MouseFollowerContext';

const DownloadApp: React.FC = () => {
  const { setTalkText } = useMouseFollower();

  return (
    <section id="about" className="py-20 bg-gradient-to-r from-gray-800 to-black relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white mix-blend-overlay animate-float1"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-white mix-blend-overlay animate-float2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-8">
            <div 
              className="flex items-center space-x-3"
              onMouseEnter={() => setTalkText("Our mobile app makes booking even easier!")}
              onMouseLeave={() => setTalkText(null)}
            >
              <Smartphone className="w-8 h-8" />
              <span className="text-xl font-semibold">SewaSetu Mobile App</span>
            </div>
            
            <h2 
              className="text-4xl md:text-5xl font-bold"
              onMouseEnter={() => setTalkText("Get the full SewaSetu experience")}
              onMouseLeave={() => setTalkText(null)}
            >
              Get the App for Better Experience
            </h2>
            
            <p 
              className="text-xl text-gray-300"
              onMouseEnter={() => setTalkText("More features in the app!")}
              onMouseLeave={() => setTalkText(null)}
            >
              Download our mobile app for faster bookings, real-time updates, and exclusive offers
            </p>
            
            <div className="space-y-4">
              {[
                "One-tap booking and scheduling",
                "Real-time service provider tracking",
                "Exclusive app-only discounts",
                "Push notifications for updates"
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-3"
                  onMouseEnter={() => setTalkText(`App feature: ${feature}`)}
                  onMouseLeave={() => setTalkText(null)}
                >
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors flex items-center space-x-3 border border-gray-700 hover:border-white"
                onMouseEnter={() => setTalkText("Download for iOS")}
                onMouseLeave={() => setTalkText(null)}
              >
                <Download className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </button>
              <button 
                className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors flex items-center space-x-3 border border-gray-700 hover:border-white"
                onMouseEnter={() => setTalkText("Download for Android")}
                onMouseLeave={() => setTalkText(null)}
              >
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
            <div 
              className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-300 hover:border-white transition-colors"
              onMouseEnter={() => setTalkText("Scan to download our app")}
              onMouseLeave={() => setTalkText(null)}
            >
              <div className="text-center mb-6">
                <QrCode 
                  className="w-32 h-32 mx-auto text-gray-800 hover:scale-105 transition-transform"
                  onMouseEnter={() => setTalkText("Point your camera at this QR code")}
                  onMouseLeave={() => setTalkText(null)}
                />
                <p className="text-gray-600 mt-4">
                  Scan QR code to download
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div 
                  className="bg-gray-100 rounded-lg p-4 hover:bg-gray-200 transition-colors"
                  onMouseEnter={() => setTalkText("Our app rating from thousands of users")}
                  onMouseLeave={() => setTalkText(null)}
                >
                  <div className="text-2xl font-bold text-gray-900">4.8</div>
                  <div className="text-sm text-gray-600">App Rating</div>
                </div>
                <div 
                  className="bg-gray-100 rounded-lg p-4 hover:bg-gray-200 transition-colors"
                  onMouseEnter={() => setTalkText("Join our growing community")}
                  onMouseLeave={() => setTalkText(null)}
                >
                  <div className="text-2xl font-bold text-gray-900">1M+</div>
                  <div className="text-sm text-gray-600">Downloads</div>
                </div>
              </div>
            </div>
            
            {/* Phone Mockup */}
            <div 
              className="absolute -top-8 -right-8 w-48 h-96 bg-black rounded-3xl p-2 shadow-xl hidden lg:block border border-gray-700 hover:border-white transition-colors"
              onMouseEnter={() => setTalkText("Check out our mobile interface")}
              onMouseLeave={() => setTalkText(null)}
            >
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