import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Protection
import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';

// View Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Jobs from './pages/Jobs';
import Freelance from './pages/Freelance';
import Scholarships from './pages/Scholarships';
import Applications from './pages/Applications';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import Recommendations from './pages/Recommendations';
import CareerPath from './pages/CareerPath';
import CV from './pages/CV';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Hub Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            {/* Index Redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Core Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* Opportunities Market */}
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/freelance" element={<Freelance />} />
            <Route path="/scholarships" element={<Scholarships />} />
            <Route path="/applications" element={<Applications />} />
            
            {/* Communications Alerts */}
            <Route path="/messages" element={<Messages />} />
            <Route path="/notifications" element={<Notifications />} />
            
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
