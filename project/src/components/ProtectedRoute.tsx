// components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const RequireRole = ({
  role,
  children,
}: {
  role: 'USER' | 'PROVIDER' | 'ADMIN';
  children: JSX.Element;
}) => {
  const { user, loading } = useAuth();

  if (loading) return null; // or spinner
  if (!user || user.role !== role) return <Navigate to="/login" />;

  return children;
};
