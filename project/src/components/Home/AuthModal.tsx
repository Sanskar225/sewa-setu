import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Phone, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  redirectPath?: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login', redirectPath = '/' }) => {
  const { setUser } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', role: 'USER' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'signup' | 'otp'>('signup');
  const [otp, setOtp] = useState('');
  const [adminExists, setAdminExists] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate()
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, role: value }));
    if (value === 'ADMIN') {
      try {
        const response = await apiService.checkAdminExists();
        setAdminExists(response.adminExists);
        if (response.adminExists) {
          toast.error('An admin already exists. Only one admin is allowed.');
        }
      } catch {
        toast.error('Error checking admin existence');
      }
    } else {
      setAdminExists(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const email = formData.email.toLowerCase();
      const password = formData.password;

      const response = await apiService.signin(email, password);

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      toast.success('Login successful!');
      navigate('/dashboard');
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.role === 'ADMIN' && adminExists) return toast.error('Admin already exists.');
    if (formData.password !== formData.confirmPassword) return toast.error('Passwords do not match');
    if (formData.password.length < 6) return toast.error('Password must be at least 6 characters long');

    setIsLoading(true);
    try {
      await apiService.generateOtp(formData.email);
      setStep('otp');
      setResendCooldown(60);
    } catch (err: any) {
      toast.error(err.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const email = formData.email.toLowerCase();
      await apiService.verifyOtp(email, otp.trim());
      const response = await apiService.signup({
        name: formData.name,
        email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      });
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      toast.success("Signup successful! Redirecting...");
      navigate('/dashboard')
    } catch (err: any) {
      toast.error(err.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      await apiService.generateOtp(formData.email.toLowerCase());
      setResendCooldown(60);
      toast.success('OTP resent successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to resend OTP');
    }
  };

  if (!isOpen) return null;

  if (step === 'otp') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 text-black relative">
          <h2 className="text-2xl font-bold text-center mb-4">Verify Your Email</h2>
          <p className="text-center mb-6">We sent a 6-digit code to {formData.email}</p>
          <form onSubmit={handleOtpVerification} className="space-y-4">
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full border px-4 py-2 rounded"
              required
            />
            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify & Create Account'}
            </button>
            <button
              type="button"
              onClick={resendOtp}
              disabled={resendCooldown > 0}
              className="text-blue-600 text-sm"
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
            </button>
            <button type="button" onClick={() => setStep('signup')} className="text-sm text-gray-500">
              ← Back to Signup
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center px-4">
      <div className="bg-gray-900 text-white rounded-xl shadow-xl w-full max-w-md p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-center mb-2">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="text-center text-gray-400 mb-6">{mode === 'login' ? 'Sign in to your account' : 'Sign up to get started'}</p>

        <form onSubmit={mode === 'signup' ? handleSignup : handleLogin} className="space-y-4">
          {mode === 'signup' && (
            <>
              <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" className="w-full bg-gray-700 text-white px-4 py-2 rounded" required />
              <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone" className="w-full bg-gray-700 text-white px-4 py-2 rounded" required />
              <select name="role" value={formData.role} onChange={handleRoleChange} className="w-full bg-gray-700 text-white px-4 py-2 rounded">
                <option value="USER">User</option>
                <option value="PROVIDER">Provider</option>
                <option value="ADMIN" disabled={adminExists}>Admin {adminExists ? '(Exists)' : ''}</option>
              </select>
            </>
          )}

          <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="w-full bg-gray-700 text-white px-4 py-2 rounded" required />

          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            className="w-full bg-gray-700 text-white px-4 py-2 rounded"
            required
          />

          {mode === 'signup' && (
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              className="w-full bg-gray-700 text-white px-4 py-2 rounded"
              required
            />
          )}

          <button
            type="submit"
            disabled={isLoading || (formData.role === 'ADMIN' && adminExists)}
            className="w-full bg-white text-black py-2 rounded hover:bg-gray-200"
          >
            {isLoading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-white underline">
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
