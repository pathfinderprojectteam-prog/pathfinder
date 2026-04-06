import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    const result = await login(formData.email, formData.password);
    setLoading(false);
    
    if (result.success) {
      // Get role from result or context (AuthContext updates sync)
      // Since AuthContext.jsx update already happened in result, we can wait a tick or just calculate from what login returned
      // The current AuthContext.jsx doesn't return the full user in 'result', but it sets it in state.
      // Let's assume result might need to return the role or we can check the user state if it updates immediately.
      // Actually, let's just make sure redirect logic is robust.
      
      // Wait, let's look at AuthContext.jsx login return again. It returns { success: true }.
      // I should probably update AuthContext.jsx to return the userData.
      // But for now, let's use the stored user in localStorage or just a small timeout to let state sync.
      
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const role = storedUser?.role?.toLowerCase() || 'student';
      
      const dashMap = {
        student: '/student/dashboard',
        company: '/company/dashboard',
        client: '/client/dashboard',
        university: '/university/dashboard',
        admin: '/admin/dashboard'
      };

      const dashPath = dashMap[role] || '/dashboard';
      const origin = location.state?.from?.pathname || dashPath;
      navigate(origin, { replace: true });
    } else {
      setError(result.error || 'Invalid credentials.');
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 selection:bg-indigo-100">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
        <div>
          <div className="mx-auto flex items-center justify-center h-16 w-16 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 mb-6">
            <span className="text-white font-black text-2xl">P</span>
          </div>
          <h2 className="text-center text-3xl font-black tracking-tight text-slate-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500 font-medium">
            Sign in to access your PathFinder portal
          </p>
        </div>
        
        {error && (
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-center gap-3">
            <svg className="w-5 h-5 text-rose-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
            </svg>
            <p className="text-sm text-rose-700 font-bold">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="email">Email Address</label>
              <input
                id="email" name="email" type="email" required
                className="appearance-none rounded-xl relative block w-full px-5 py-4 border border-slate-200 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-medium transition-all shadow-sm"
                placeholder="you@example.com"
                value={formData.email} onChange={handleChange} disabled={loading}
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-slate-700" htmlFor="password">Password</label>
                <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
                  Forgot password?
                </a>
              </div>
              <input
                id="password" name="password" type="password" required
                className="appearance-none rounded-xl relative block w-full px-5 py-4 border border-slate-200 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-medium transition-all shadow-sm"
                placeholder="••••••••"
                value={formData.password} onChange={handleChange} disabled={loading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center py-4 px-4 border border-transparent text-sm font-black rounded-xl text-white ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-lg hover:shadow-xl shadow-indigo-200 active:scale-95`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                   <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                   </svg>
                   Authenticating...
                </span>
              ) : 'Sign In'}
            </button>
          </div>
        </form>
        
        <div className="text-center pt-4 border-t border-slate-100">
          <span className="text-sm font-medium text-slate-500">Don't have an account? </span>
          <Link to="/register" className="text-sm font-bold text-indigo-600 hover:text-indigo-500 hover:underline transition-all">
            Apply now
          </Link>
        </div>
      </div>
    </div>
  );
}
