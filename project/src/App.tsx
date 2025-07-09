import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider, useAuth } from './contexts/AuthContext';

import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { UserDashboard } from './components/Dashboard/UserDashboard';
import { ServiceSearch } from './components/Services/ServiceSearch';
import { BookingsList } from './components/Bookings/BookingsList';
import { PaymentDashboard } from './components/Payments/PaymentDashboard';
import { LoginForm } from './components/Auth/LoginForm';

import Navigation from './components/Navigation';
import Hero from './components/Hero';
import ServiceCategories from './components/ServiceCategories';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import DownloadApp from './components/DownloadApp';
import Footer from './components/Footer';
import ProfilePage from './components/ProfilePage';

function DashboardLayout() {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <UserDashboard />;
      case 'services':
        return <ServiceSearch />;
      case 'bookings':
        return <BookingsList />;
      case 'payments':
        return <PaymentDashboard />;
      default:
        return <UserDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        isOpen={sidebarOpen} 
        currentView={currentView} 
        onViewChange={setCurrentView}
      />

      <div className="flex-1 flex flex-col">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      <Hero />
      <ServiceCategories />
      <HowItWorks />
      <Features />
      <Testimonials />
      <DownloadApp />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={
            <div className="min-h-screen bg-gray-900">
              <Navigation />
              <ProfilePage />
            </div>
          } />
          <Route path="/dashboard" element={<DashboardLayout />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
