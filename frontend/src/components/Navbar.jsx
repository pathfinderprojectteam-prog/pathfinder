import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50">
      <nav className="h-20 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-xl">P</span>
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              Path<span className="text-indigo-600">Finder</span>
            </span>
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
              About
            </Link>
            
            {user ? (
              <Link to="/dashboard" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95 ml-2">
                Dashboard
              </Link>
            ) : (
              <div className="flex items-center gap-4 ml-2">
                <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 hover:text-indigo-600 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-md absolute w-full left-0 top-20">
          <div className="px-6 py-4 flex flex-col gap-4">
            <Link to="/" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
              About
            </Link>
            {user ? (
              <div className="pt-2 border-t border-slate-100">
                <Link to="/dashboard" className="block px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all text-center shadow-md">
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3 pt-2 border-t border-slate-100">
                <Link to="/login" className="block px-5 py-2.5 text-slate-600 rounded-xl text-sm font-bold border border-slate-200 text-center hover:bg-slate-50 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="block px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold text-center hover:bg-slate-800 transition-colors shadow-md">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
