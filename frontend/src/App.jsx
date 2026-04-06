import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Protection
import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';

// View Pages
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import StudentProfile from './pages/StudentProfile';
import CompanyProfile from './pages/CompanyProfile';
import ClientProfile from './pages/ClientProfile';
import UniversityProfile from './pages/UniversityProfile';
import Jobs from './pages/Jobs';
import Freelance from './pages/Freelance';
import Scholarships from './pages/Scholarships';
import Applications from './pages/Applications';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import Recommendations from './pages/Recommendations';
import CareerPath from './pages/CareerPath';
import CV from './pages/CV';
import Network from './pages/Network';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Marketing & Auth Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Hub Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            {/* Index Redirect for legacy safety */}
            <Route path="/index" element={<Navigate to="/dashboard" replace />} />
            
            {/* Role-Specific Dashboards */}
            <Route path="/student/dashboard" element={<Dashboard />} />
            <Route path="/company/dashboard" element={<Dashboard />} />
            <Route path="/client/dashboard" element={<Dashboard />} />
            <Route path="/university/dashboard" element={<Dashboard />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            
            {/* Generic Dashboard (legacy redirect) */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Role-Specific Profile Pages */}
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/company/profile" element={<CompanyProfile />} />
            <Route path="/client/profile" element={<ClientProfile />} />
            <Route path="/university/profile" element={<UniversityProfile />} />
            
            {/* Generic Profile (Dispatcher) */}
            <Route path="/profile" element={<Profile />} />
            
            {/* Opportunities Market */}
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/freelance" element={<Freelance />} />
            <Route path="/scholarships" element={<Scholarships />} />
            <Route path="/applications" element={<Applications />} />
            
            {/* Communications Alerts */}
            <Route path="/messages" element={<Messages />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/network" element={<Network />} />
            
            {/* AI Intelligence Layer */}
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/career-path" element={<CareerPath />} />
            <Route path="/cv" element={<CV />} />
          </Route>
        </Route>

        {/* 404 Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
