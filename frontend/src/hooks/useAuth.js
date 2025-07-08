// src/hooks/useAuth.js
import { useSelector } from 'react-redux';

export const useAuth = () => {
  const user = useSelector((state) => state.user.user);
  const loading = useSelector((state) => state.user.loading);
  const error = useSelector((state) => state.user.error);

  return { user, loading, error };
};
