import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';

import DashboardLayout from './components/Layout/DashboardLayout';
import { UserDashboard } from './components/Dashboard/UserDashboard';
import { ServiceSearch } from './components/Services/ServiceSearch';
import { BookingsList } from './components/Bookings/BookingsList';
import { PaymentDashboard } from './components/Payments/PaymentDashboard';
import { MessagesDashboard } from './components/Messages/Message';
import { ReviewsDashboard } from './components/Reviews/ReviewsDashboard';
import { SettingsDashboard } from './components/Settings/SettingsDashboard';

import Navigation from './components/Home/Navigation';
import Hero from './components/Home/Hero';
import ServiceCategories from './components/Home/ServiceCategories';
import HowItWorks from './components/Home/HowItWorks';
import Features from './components/Home/Features';
import Testimonials from './components/Home/Testimonials';
import DownloadApp from './components/Home/DownloadApp';
import Footer from './components/Home/Footer';
import ProfilePage from './components/Home/ProfilePage';
import { LoginForm } from './components/Auth/LoginForm';
import { TestChat } from './components/Messages/TestChat';
import SignupForm from './components/Auth/SignupForm';
import JobsPage from './components/ProviderPanel/jobs';
import EarningsPage from './components/ProviderPanel/earning';

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
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Dashboard and nested routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<UserDashboard />} />
            <Route path="services" element={<ServiceSearch />} />
            <Route path="bookings" element={<BookingsList />} />
            <Route path="payments" element={<PaymentDashboard />} />
            <Route path="messages" element={<MessagesDashboard receiverId={''} chatActive={false} />} />
            <Route path="reviews" element={<ReviewsDashboard />} />
            <Route path="settings" element={<SettingsDashboard />} />
            <Route path="test-chat" element={<TestChat />} />
            <Route path="jobs" element={<JobsPage />} />
            <Route path="earnings" element={<EarningsPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
