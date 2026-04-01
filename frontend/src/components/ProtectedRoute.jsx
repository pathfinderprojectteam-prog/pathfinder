import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  // Subscribe to central auth state
  const { user } = useAuth();

  // If there is no user populated in context, bounce to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Permitted; render nested layout and dynamic views
  return <Outlet />;
}
