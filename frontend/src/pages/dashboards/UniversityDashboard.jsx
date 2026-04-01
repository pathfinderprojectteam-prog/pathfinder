import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';

const ACADEMIC_LEVELS = ['High School', 'Bachelor', 'Master', 'PhD'];

export default function UniversityDashboard() {
  const { user } = useAuth();

  // ── Create form state ──────────────────────────────────────────────────────
  const [form, setForm] = useState({ title: '', academicLevelRequired: 'Bachelor', deadline: '' });
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState(null);

  // ── My scholarships list state ─────────────────────────────────────────────
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    setLoading(true);
    dataService.getAllScholarshipsRaw()
      .then(res => {
        const all = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setScholarships(
          all.filter(s => s.university?._id === user._id || s.university === user._id)
        );
      })
      .catch(err => console.error('Error loading scholarships', err))
      .finally(() => setLoading(false));
  }, [user._id, refreshTrigger]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMsg(null);
    setSubmitting(true);
    try {
      await dataService.createScholarship(form);
      setFormMsg({ type: 'success', text: `"${form.title}" submitted. Awaiting admin validation.` });
      setForm({ title: '', academicLevelRequired: 'Bachelor', deadline: '' });
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
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">University Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Welcome, <span className="font-bold text-slate-700">{user?.name}</span>. Post and manage your scholarships.
        </p>
      </div>

      {/* ── Create Scholarship Form ── */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Post a New Scholarship</h2>

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
            <label className="block text-sm font-semibold text-slate-700 mb-1">Scholarship Title *</label>
            <input
              name="title" required value={form.title} onChange={handleChange}
              placeholder="e.g. STEM Excellence Grant 2025"
              className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Academic Level Required</label>
            <select
              name="academicLevelRequired" value={form.academicLevelRequired} onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {ACADEMIC_LEVELS.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Application Deadline</label>
            <input
              type="date" name="deadline" value={form.deadline} onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit" disabled={submitting}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-lg text-sm transition-colors"
            >
              {submitting ? 'Submitting...' : 'Post Scholarship'}
            </button>
          </div>
        </form>
      </div>

      {/* ── My Scholarships List ── */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h2 className="text-lg font-bold text-slate-900">My Scholarships</h2>
          <span className="text-xs text-slate-500 italic">Only validated listings shown</span>
        </div>

        {loading ? (
          <p className="p-6 text-slate-500 text-sm animate-pulse">Loading scholarships...</p>
        ) : scholarships.length === 0 ? (
          <div className="p-10 text-center border-2 border-dashed border-slate-200 m-4 rounded-xl">
            <p className="text-slate-400 font-medium">No validated scholarships yet.</p>
            <p className="text-slate-400 text-sm mt-1">New posts require admin approval before appearing here.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {scholarships.map(s => (
              <div key={s._id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-900">{s.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                      {s.academicLevelRequired}
                    </span>
                    {s.deadline && (
                      <span className="text-xs text-slate-500">
                        Deadline: {new Date(s.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
