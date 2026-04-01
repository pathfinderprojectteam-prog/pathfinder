import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';

// difficulty options from the backend schema
const DIFFICULTY_OPTIONS = ['Beginner', 'Intermediate', 'Advanced'];

export default function ClientDashboard() {
  const { user } = useAuth();

  // ── Create form state ──────────────────────────────────────────────────────
  const [form, setForm] = useState({ title: '', description: '', difficulty: 'Beginner' });
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState(null); // { type: 'success'|'error', text }

  // ── My projects list state ─────────────────────────────────────────────────
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch validated projects and filter by owner client-side
  useEffect(() => {
    setLoadingProjects(true);
    dataService.getAllFreelanceRaw()
      .then(res => {
        const all = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setProjects(
          all.filter(p => p.client?._id === user._id || p.client === user._id)
        );
      })
      .catch(err => console.error('Error loading projects', err))
      .finally(() => setLoadingProjects(false));
  }, [user._id, refreshTrigger]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMsg(null);
    setSubmitting(true);
    try {
      await dataService.createFreelanceProject(form);
      setFormMsg({ type: 'success', text: `"${form.title}" submitted. Awaiting admin validation.` });
      setForm({ title: '', description: '', difficulty: 'Beginner' });
      setRefreshTrigger(t => t + 1);
    } catch (err) {
      setFormMsg({ type: 'error', text: err.response?.data?.message || 'Submission failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Client Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Welcome, <span className="font-bold text-slate-700">{user?.name}</span>. Post and manage your freelance projects.
        </p>
      </div>

      {/* ── Create Project Form ── */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Post a New Freelance Project</h2>

        {formMsg && (
          <div className={`mb-4 p-3 text-sm rounded border-l-4 ${
            formMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
              : 'bg-rose-50 border-rose-500 text-rose-700'
          }`}>
            {formMsg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Project Title *</label>
            <input
              name="title" required value={form.title} onChange={handleChange}
              placeholder="e.g. Build a REST API"
              className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Description *</label>
            <textarea
              name="description" required rows={3} value={form.description} onChange={handleChange}
              placeholder="Describe the scope, deliverables, and timeline..."
              className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Difficulty Level</label>
            <select
              name="difficulty" value={form.difficulty} onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {DIFFICULTY_OPTIONS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit" disabled={submitting}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-lg text-sm transition-colors"
            >
              {submitting ? 'Submitting...' : 'Post Project'}
            </button>
          </div>
        </form>
      </div>

      {/* ── My Projects List ── */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h2 className="text-lg font-bold text-slate-900">My Projects</h2>
          <span className="text-xs text-slate-500 italic">Only validated listings shown</span>
        </div>

        {loadingProjects ? (
          <p className="p-6 text-slate-500 text-sm animate-pulse">Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="p-10 text-center border-2 border-dashed border-slate-200 m-4 rounded-xl">
            <p className="text-slate-400 font-medium">No validated projects yet.</p>
            <p className="text-slate-400 text-sm mt-1">New posts require admin approval before appearing here.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {projects.map(proj => (
              <div key={proj._id} className="px-6 py-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-900">{proj.title}</h3>
                  <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">{proj.description}</p>
                </div>
                <span className={`shrink-0 px-2 py-1 text-xs font-bold rounded-md border ${
                  proj.difficulty === 'Advanced' ? 'bg-rose-50 text-rose-700 border-rose-100'
                  : proj.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-700 border-amber-100'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                }`}>
                  {proj.difficulty}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
