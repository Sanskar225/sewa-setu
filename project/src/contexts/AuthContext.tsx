import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { apiService, setForceLogout } from '../services/api';
import { User } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (
    name: string,
    email: string,
    password: string,
    phone: string,
    role: 'USER' | 'PROVIDER' | 'ADMIN'
  ) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Setup force logout
  useEffect(() => {
    setForceLogout(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      toast.error('Session expired. Please login again.');
    });
  }, []);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        // Verify token is still valid
        apiService.getCurrentUser().catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        });
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await apiService.signin(email, password);
      if (res.jwt && res.user) {
        localStorage.setItem('token', res.jwt);
        localStorage.setItem('user', JSON.stringify(res.user));
        setUser(res.user);
        return true;
      }
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    }
    return false;
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    phone: string,
    role: 'USER' | 'PROVIDER' | 'ADMIN'
  ): Promise<boolean> => {
    try {
      const res = await apiService.signup({ name, email, password, phone, role });
      if (res.token && res.user) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        setUser(res.user);
        return true;
      }
    } catch (err: any) {
      toast.error(err.message || 'Signup failed');
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        setUser, 
        login, 
        signup, 
        logout, 
        loading, 
        isAuthenticated: !!user 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};