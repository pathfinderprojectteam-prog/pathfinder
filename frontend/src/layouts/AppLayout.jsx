import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AppLayout() {
  const { user, logout } = useAuth();

  const role = user?.role || 'student';

  // Define navigation matrices for different roles
  const navigationMap = {
    student: [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Profile', path: '/profile' },
      { name: 'Jobs', path: '/jobs' },
      { name: 'Freelance', path: '/freelance' },
      { name: 'Scholarships', path: '/scholarships' },
      { name: 'Applications', path: '/applications' },
      { name: 'Messages', path: '/messages' },
      { name: 'Notifications', path: '/notifications' },
      { name: 'Recommendations', path: '/recommendations' },
      { name: 'Career Path', path: '/career-path' },
      { name: 'CV Generator', path: '/cv' },
    ],
    company: [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Profile', path: '/profile' },
      { name: 'Messages', path: '/messages' },
      { name: 'Notifications', path: '/notifications' },
    ],
    client: [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Profile', path: '/profile' },
      { name: 'Messages', path: '/messages' },
      { name: 'Notifications', path: '/notifications' },
    ],
    university: [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Profile', path: '/profile' },
      { name: 'Messages', path: '/messages' },
      { name: 'Notifications', path: '/notifications' },
    ],
    admin: [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Messages', path: '/messages' },
      { name: 'Notifications', path: '/notifications' },
    ],
  };

  const navItems = navigationMap[role] || navigationMap.student;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 flex flex-col shadow-xl z-20">
        <div className="p-6 border-b border-slate-800 flex items-center justify-center">
          <span className="text-2xl font-black text-white tracking-tight">
            Path<span className="text-indigo-500">Finder</span>
          </span>
        </div>
        
        <nav className="p-4 flex-1 flex flex-col gap-1 overflow-y-auto">
           <div className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-4 mb-2 px-3">
             Menu: {role}
           </div>
           
           {navItems.map((item) => (
             <NavLink
               key={item.path}
               to={item.path}
               className={({ isActive }) =>
                 `px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-3 ${
                   isActive 
                     ? 'bg-indigo-600 text-white shadow-md' 
                     : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                 }`
               }
             >
               {item.name}
             </NavLink>
           ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Top Navbar with Glassmorphism */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
          <div className="text-slate-500 font-medium text-sm flex items-center gap-2">
            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-bold uppercase tracking-wide">
              Sprint 6 Beta
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Notification Bell */}
            <NavLink to="/notifications" className="relative text-slate-400 hover:text-indigo-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {/* Notification Ping Indicator */}
              <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
            </NavLink>
            
            <div className="h-6 w-px bg-slate-200"></div>

            {/* Profile Menu */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col text-right">
                <span className="text-sm font-bold text-slate-800 leading-tight">{user?.name || 'PathFinder User'}</span>
                <span className="text-xs font-medium text-slate-500 capitalize">{user?.role || 'Guest'}</span>
              </div>
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-inner flex items-center justify-center text-white font-bold text-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <button onClick={logout} className="ml-2 text-slate-400 hover:text-rose-500 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                   <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                 </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-7xl mx-auto h-full animate-in fade-in duration-500 slide-in-from-bottom-2">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
