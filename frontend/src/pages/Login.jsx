import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    const result = await login(email, password);
    setLoading(false);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 selection:bg-indigo-100">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
        <div>
          <h2 className="text-center text-3xl font-black tracking-tight text-slate-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            Log in to access your PathFinder dashboard
          </p>
        </div>
        
        {error && (
          <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-md">
            <p className="text-sm text-rose-700 font-medium">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all shadow-sm"
                placeholder="you@university.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all shadow-sm"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-md hover:shadow-lg`}
            >
              {loading ? 'Authenticating...' : 'Sign Int'}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <span className="text-sm text-slate-500">Don't have an account? </span>
          <Link to="/register" className="text-sm font-bold text-indigo-600 hover:text-indigo-500 hover:underline transition-all">
            Join PathFinder
          </Link>
        </div>
      </div>
    </div>
  );
}
