import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import StudentDashboard from './dashboards/StudentDashboard';
import CompanyDashboard from './dashboards/CompanyDashboard';
import ClientDashboard from './dashboards/ClientDashboard';
import UniversityDashboard from './dashboards/UniversityDashboard';
import AdminDashboard from './dashboards/AdminDashboard';

const DASHBOARD_MAP = {
  Student: StudentDashboard,
  Company: CompanyDashboard,
  Client: ClientDashboard,
  University: UniversityDashboard,
  Admin: AdminDashboard,
};

export default function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();

  const role = user?.role;
  const RoleDashboard = DASHBOARD_MAP[role];

  if (!role) {
    return <div className="p-10 text-center animate-pulse">Loading identity dashboard context...</div>;
  }

  // Redirect to role-specific path IF current path is generic /dashboard
  if (location.pathname === '/dashboard') {
    const rolePath = role.toLowerCase();
    return <Navigate to={`/${rolePath}/dashboard`} replace />;
  }

  if (!RoleDashboard) {
    return <div className="p-10 text-rose-500 font-bold border border-rose-200 m-8 rounded-xl bg-rose-50">Unknown user role: "{role}". Access denied.</div>;
  }

  return <RoleDashboard />;
}
