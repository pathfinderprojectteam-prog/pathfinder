import { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';

// ─── Reusable pending items table ────────────────────────────────────────────
function PendingTable({ title, items, onApprove, approvingId, colorClass }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className={`px-6 py-4 flex items-center justify-between border-b border-slate-200 ${colorClass}`}>
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
        <span className="text-xs font-bold bg-white/70 text-slate-700 px-2 py-1 rounded-full border border-slate-200">
          {items.length} pending
        </span>
      </div>

      {items.length === 0 ? (
        <div className="py-10 text-center text-slate-400 text-sm font-medium">
          ✓ Queue empty — nothing to review.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Title</th>
                <th className="px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Submitted by</th>
                <th className="px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map(item => (
                <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 font-semibold text-slate-900 max-w-xs">
                    <div className="truncate">{item.title}</div>
                    {item.description && (
                      <div className="text-xs text-slate-500 mt-0.5 truncate font-normal">{item.description}</div>
                    )}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {item.company?.name || item.client?.name || item.university?.name || '—'}
                  </td>
                  <td className="px-5 py-4 text-slate-500">
                    {new Date(item.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => onApprove(item._id)}
                      disabled={approvingId === item._id}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                    >
                      {approvingId === item._id ? 'Approving...' : 'Approve'}
                    </button>
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

// ─── Main AdminDashboard ──────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [pending, setPending] = useState({ jobs: [], freelanceProjects: [], scholarships: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approvingId, setApprovingId] = useState(null);

  const fetchPending = () => {
    setLoading(true);
    dataService.getPendingItems()
      .then(res => setPending(res.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load moderation queue.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPending(); }, []);

  // Generic approve handler — removes item from local state on success (optimistic)
  const makeApproveHandler = (type, apiFn) => async (id) => {
    setApprovingId(id);
    try {
      await apiFn(id);
      setPending(prev => ({
        ...prev,
        [type]: prev[type].filter(item => item._id !== id),
      }));
    } catch (err) {
      alert(err.response?.data?.message || 'Approval failed.');
    } finally {
      setApprovingId(null);
    }
  };

  const totalPending =
    pending.jobs.length + pending.freelanceProjects.length + pending.scholarships.length;

  return (
    <div className="max-w-6xl flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Moderation</h1>
          <p className="text-slate-500 mt-1">Review and approve pending opportunity listings.</p>
        </div>
        <div className="flex items-center gap-3">
          {totalPending > 0 && (
            <span className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold rounded-xl">
              <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse"></span>
              {totalPending} items awaiting review
            </span>
          )}
          <button
            onClick={fetchPending}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg border border-slate-200 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 font-medium animate-pulse">
          Loading moderation queue...
        </div>
      ) : (
        <>
          <PendingTable
            title="Pending Job Posts"
            items={pending.jobs}
            onApprove={makeApproveHandler('jobs', dataService.validateJob)}
            approvingId={approvingId}
            colorClass="bg-indigo-50"
          />

          <PendingTable
            title="Pending Freelance Projects"
            items={pending.freelanceProjects}
            onApprove={makeApproveHandler('freelanceProjects', dataService.validateFreelanceProject)}
            approvingId={approvingId}
            colorClass="bg-emerald-50"
          />

          <PendingTable
            title="Pending Scholarships"
            items={pending.scholarships}
            onApprove={makeApproveHandler('scholarships', dataService.validateScholarship)}
            approvingId={approvingId}
            colorClass="bg-amber-50"
          />
        </>
      )}
    </div>
  );
}
