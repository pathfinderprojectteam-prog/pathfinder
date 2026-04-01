import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';

// ─── Section: Create Job Form ─────────────────────────────────────────────────
function CreateJobForm({ onJobCreated }) {
  const [form, setForm] = useState({ title: '', description: '', requiredExperience: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const res = await dataService.createJob({
        title: form.title,
        description: form.description,
        requiredExperience: Number(form.requiredExperience) || 0,
      });
      setSuccess(`Job "${res.data.title}" created successfully. Awaiting admin validation.`);
      setForm({ title: '', description: '', requiredExperience: '' });
      if (onJobCreated) onJobCreated(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 mb-4">Post a New Job</h2>

      {error && (
        <div className="mb-4 p-3 bg-rose-50 border-l-4 border-rose-500 text-rose-700 text-sm rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 text-sm rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Job Title *</label>
          <input
            name="title"
            required
            value={form.title}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. Senior Backend Engineer"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Description *</label>
          <textarea
            name="description"
            required
            rows={4}
            value={form.description}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            placeholder="Describe the role, responsibilities, and requirements..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Required Experience (years)
          </label>
          <input
            name="requiredExperience"
            type="number"
            min="0"
            value={form.requiredExperience}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. 3"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-lg text-sm transition-colors shadow-sm"
          >
            {loading ? 'Submitting...' : 'Post Job'}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Section: Applications Panel for a single job ────────────────────────────
function ApplicationsPanel({ job, onClose }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    dataService.getJobApplications(job._id)
      .then(res => setApplications(res.data || []))
      .catch(err => console.error('Error loading applications:', err))
      .finally(() => setLoading(false));
  }, [job._id]);

  const handleStatus = async (applicationId, status) => {
    setUpdatingId(applicationId);
    try {
      const res = await dataService.updateApplicationStatus(applicationId, status);
      // Optimistic update
      setApplications(prev =>
        prev.map(app => app._id === applicationId ? { ...app, status: res.data.status } : app)
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-900">
          Applicants — <span className="text-indigo-600">{job.title}</span>
        </h2>
        <button
          onClick={onClose}
          className="text-sm text-slate-500 hover:text-slate-800 underline"
        >
          ← Back to Jobs
        </button>
      </div>

      {loading ? (
        <p className="text-slate-500 text-sm animate-pulse">Loading applicants...</p>
      ) : applications.length === 0 ? (
        <p className="text-slate-500 text-sm py-6 text-center">No applications received yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-xs">Candidate</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-xs">Email</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-xs">Status</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-xs">Applied</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-xs">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map(app => (
                <tr key={app._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {app.student?.name || 'Unknown'}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{app.student?.email || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                      app.status === 'accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : app.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {app.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {app.status === 'pending' || !app.status ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatus(app._id, 'accepted')}
                          disabled={updatingId === app._id}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-md transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatus(app._id, 'rejected')}
                          disabled={updatingId === app._id}
                          className="px-3 py-1 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold rounded-md transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Decision made</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Section: My Jobs List ────────────────────────────────────────────────────
function MyJobsList({ user, refreshTrigger, onViewApplicants }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    dataService.getAllJobsRaw()
      .then(res => {
        const allJobs = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        // Filter to only jobs owned by the current company
        const myJobs = allJobs.filter(job =>
          job.company?._id === user._id || job.company === user._id
        );
        setJobs(myJobs);
      })
      .catch(err => console.error('Error loading jobs:', err))
      .finally(() => setLoading(false));
  }, [user._id, refreshTrigger]);

  if (loading) return <p className="text-slate-500 animate-pulse text-sm">Loading your jobs...</p>;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-900">My Job Posts</h2>
        <span className="text-xs text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
          Only validated posts are shown
        </span>
      </div>

      {jobs.length === 0 ? (
        <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
          <p className="text-slate-400 font-medium">No validated job posts yet.</p>
          <p className="text-slate-400 text-sm mt-1">Newly posted jobs require admin validation before appearing here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {jobs.map(job => (
            <div key={job._id} className="border border-slate-200 rounded-lg p-5 flex items-center justify-between hover:shadow-sm transition-shadow">
              <div>
                <h3 className="font-bold text-slate-900">{job.title}</h3>
                <p className="text-sm text-slate-500 mt-1 line-clamp-1">{job.description}</p>
                {job.requiredExperience > 0 && (
                  <span className="inline-block mt-2 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                    {job.requiredExperience} yrs experience
                  </span>
                )}
              </div>
              <button
                onClick={() => onViewApplicants(job)}
                className="ml-4 shrink-0 px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white text-sm font-bold rounded-lg transition-colors"
              >
                View Applicants
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main CompanyDashboard ────────────────────────────────────────────────────
export default function CompanyDashboard() {
  const { user } = useAuth();
  const [selectedJob, setSelectedJob] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleJobCreated = () => {
    // Trigger a refresh of the jobs list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="max-w-5xl flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Company Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Welcome, <span className="font-bold text-slate-700">{user?.name}</span>. Manage your job posts and applications below.
        </p>
      </div>

      {/* Create Job Form */}
      <CreateJobForm onJobCreated={handleJobCreated} />

      {/* Applications Panel or Jobs List */}
      {selectedJob ? (
        <ApplicationsPanel job={selectedJob} onClose={() => setSelectedJob(null)} />
      ) : (
        <MyJobsList
          user={user}
          refreshTrigger={refreshTrigger}
          onViewApplicants={setSelectedJob}
        />
      )}
    </div>
  );
}
