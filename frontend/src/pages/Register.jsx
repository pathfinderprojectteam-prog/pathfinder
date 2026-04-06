import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Student' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    const result = await register(formData.name, formData.email, formData.password, formData.role);
    setLoading(false);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 selection:bg-indigo-100">
      <div className="max-w-md w-full space-y-6 bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
        <div>
          <h2 className="text-center text-3xl font-black tracking-tight text-slate-900">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            Join the PathFinder network today
          </p>
        </div>
        
        {error && (
          <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-md">
            <p className="text-sm text-rose-700 font-medium">{error}</p>
          </div>
        )}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="name">Full Name</label>
              <input
                id="name" name="name" type="text" required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all shadow-sm"
                placeholder="John Doe"
                value={formData.name} onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="email">Email Address</label>
              <input
                id="email" name="email" type="email" required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all shadow-sm"
                placeholder="you@university.edu"
                value={formData.email} onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="password">Password</label>
              <input
                id="password" name="password" type="password" required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all shadow-sm"
                placeholder="••••••••"
                value={formData.password} onChange={handleChange}
              />
            </div>

            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="role">Platform Persona</label>
               <select 
                 id="role" name="role" required
                 className="appearance-none bg-white rounded-lg relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all shadow-sm cursor-pointer"
                 value={formData.role} onChange={handleChange}
                >
                 <option value="Student">Student / Candidate</option>
                 <option value="Company">Employer / Company</option>
                 <option value="Client">Freelance Client</option>
                 <option value="University">University Administrator</option>
               </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-md hover:shadow-lg`}
            >
              {loading ? 'Processing...' : 'Register'}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <span className="text-sm text-slate-500">Already have an account? </span>
          <Link to="/login" className="text-sm font-bold text-indigo-600 hover:text-indigo-500 hover:underline transition-all">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}
