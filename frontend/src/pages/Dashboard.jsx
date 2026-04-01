import { useAuth } from '../context/AuthContext';
import StudentDashboard from './dashboards/StudentDashboard';
import CompanyDashboard from './dashboards/CompanyDashboard';
import ClientDashboard from './dashboards/ClientDashboard';
import UniversityDashboard from './dashboards/UniversityDashboard';
import AdminDashboard from './dashboards/AdminDashboard';

const DASHBOARD_MAP = {
  student: StudentDashboard,
  company: CompanyDashboard,
  client: ClientDashboard,
  university: UniversityDashboard,
  admin: AdminDashboard,
};

export default function Dashboard() {
  const { user } = useAuth();

  const role = user?.role;
  const RoleDashboard = DASHBOARD_MAP[role];

  if (!role) {
    return <div>Loading user context...</div>;
  }

  if (!RoleDashboard) {
    return <div>Unknown role: "{role}". Please contact support.</div>;
  }

  return <RoleDashboard />;
}
