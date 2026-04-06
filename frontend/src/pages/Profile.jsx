import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

/**
 * Profile acts as a dispatcher/redirector for legacy /profile route
 * It redirects to /student/profile, /company/profile, etc. based on user role
 */
export default function Profile() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const rolePath = user?.role?.toLowerCase() || 'student';
  
  if (rolePath === 'admin') {
     return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to={`/${rolePath}/profile`} replace />;
}
