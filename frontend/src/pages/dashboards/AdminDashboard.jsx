import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';

// Helper: safely extract a display string from a field that may be
// a populated MongoDB object { _id, name, email, role } OR a plain string/ObjectId
function ownerLabel(field) {
  if (!field) return 'UNKNOWN';
  if (typeof field === 'object') return field.name || field.email || String(field._id);
  return String(field);
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'validation' | 'users'
  const [pendingItems, setPendingItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackItem, setFeedbackItem] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [pendingRes, statsRes, activityRes, healthRes] = await Promise.all([
        dataService.getPendingValidations(),
        dataService.getAdminStats(),
        dataService.getRecentActivity(),
        dataService.getSystemHealth(),
      ]);

      const pData = pendingRes.data;
      const merged = [
        ...(pData.jobs || []).map(i => ({ ...i, itemType: 'Job' })),
        ...(pData.freelance || []).map(i => ({ ...i, itemType: 'Freelance' })),
        ...(pData.scholarships || []).map(i => ({ ...i, itemType: 'Scholarship' }))
      ];
      setPendingItems(merged);
      setStats(statsRes.data);
      setActivity(activityRes.data);
      setHealth(healthRes.data);
    } catch (err) {
      console.error('Admin data fetch failed', err);
      setError('System diagnostic failed. Please verify API availability.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleValidate = async (id, type, approve) => {
    if (!approve) {
       const confirmed = window.confirm(`Are you sure you want to REJECT this ${type}? This action will notify the owner.`);
       if (!confirmed) return;
    }
    try {
      if (approve) {
        await dataService.validateOpportunity(id, type);
      } else {
        await dataService.rejectOpportunity(id, type);
      }
      fetchData(); // Full refresh
    } catch (err) {
      alert(`Action failed: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleRequestChanges = async () => {
    if (!feedbackText.trim()) return alert('Feedback is required');
    try {
      await dataService.requestChanges(feedbackItem.id, feedbackItem.type, feedbackText);
      setShowFeedbackModal(false);
      setFeedbackText('');
      setFeedbackItem(null);
      fetchData();
    } catch (err) {
      alert(`Request failed: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading && !stats) return <div className="p-20 text-center animate-pulse text-slate-500 font-black">INITIALIZING SECURE ADMIN SESSION...</div>;

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-20">
      
      {/* FEEDBACK MODAL */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="text-xl font-black text-slate-900 mb-2">Request Changes</h3>
            <p className="text-slate-500 text-sm mb-6 font-medium">Explain what needs to be fixed. The provider will be notified and can resubmit.</p>
            <textarea 
              className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm font-medium mb-6"
              placeholder="e.g. Please provide a more detailed description and verify the deadline..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            />
            <div className="flex gap-3">
              <button 
                onClick={() => setShowFeedbackModal(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black rounded-xl text-xs uppercase tracking-widest transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleRequestChanges}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg shadow-indigo-200"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-rose-100 text-rose-800 text-[10px] font-black uppercase tracking-widest border border-rose-200 mb-2">
             Root Access
           </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Core Dashboard</h1>
          <p className="text-slate-500 mt-1 font-medium">Monitoring platform integrity and commercial payloads.</p>
        </div>
        
        <div className="bg-slate-100 p-1.5 rounded-2xl flex border border-slate-200 self-start shadow-inner">
          {['overview', 'validation', 'operators'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-white text-indigo-600 shadow-lg scale-105' : 'text-slate-500 hover:text-slate-900'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl font-bold">{error}</div>}

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* STATS GRID */}
            <div className="lg:col-span-2 space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Students', val: stats.totalStudents, color: 'text-indigo-600' },
                        { label: 'Companies', val: stats.totalCompanies, color: 'text-blue-600' },
                        { label: 'Clients', val: stats.totalClients, color: 'text-emerald-600' },
                        { label: 'Universities', val: stats.totalUniversities, color: 'text-amber-600' },
                        { label: 'Jobs', val: stats.totalJobs, color: 'text-slate-700' },
                        { label: 'Applications', val: stats.totalApplications, color: 'text-purple-600' },
                    ].map((s, i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</div>
                            <div className={`text-3xl font-black ${s.color}`}>{s.val ?? '—'}</div>
                        </div>
                    ))}
                </div>

                {/* RECENT ACTIVITY */}
                <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                    <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                        Recent Registrations
                    </h2>
                    <div className="space-y-3">
                        {(activity?.recentUsers || []).length === 0 ? (
                          <p className="text-slate-400 text-sm">No recent activity yet.</p>
                        ) : (activity?.recentUsers || []).map((u, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-xs shadow-sm border border-slate-200">
                                        {u.name?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-900">{u.name}</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase">{u.role} · {u.email}</div>
                                    </div>
                                </div>
                                <div className="text-[10px] font-medium text-slate-400">
                                    {new Date(u.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* SIDEBAR: HEALTH & PENDING COUNTS */}
            <div className="space-y-8">
                {/* SYSTEM HEALTH */}
                <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl sticky top-8">
                    <h2 className="text-xs font-black mb-6 uppercase tracking-widest text-slate-400">System Health</h2>
                    <div className="space-y-5">
                        {[
                            { name: 'Backend API', key: 'backend' },
                            { name: 'MongoDB', key: 'mongodb' },
                            { name: 'Gorse Engine', key: 'gorse' },
                            { name: 'Resume Parser', key: 'resumeParser' },
                        ].map((h, i) => {
                          const val = health?.[h.key] ?? 'checking...';
                          const isOk = ['online', 'connected', 'running'].includes(val);
                          return (
                            <div key={i} className="flex items-center justify-between">
                                <div className="text-sm font-bold text-slate-300">{h.name}</div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-black uppercase ${isOk ? 'text-emerald-400' : 'text-rose-400'}`}>{val}</span>
                                    <span className={`w-2.5 h-2.5 rounded-full ${isOk ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                                </div>
                            </div>
                          );
                        })}
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-800">
                         <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Pending Moderation</h2>
                         <div className="space-y-3">
                            {[
                                { label: 'Jobs', val: stats.pendingJobs },
                                { label: 'Freelance', val: stats.pendingFreelance },
                                { label: 'Scholarships', val: stats.pendingScholarships },
                            ].map((p, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-slate-400">{p.label}</span>
                                    <span className={`text-xl font-black ${p.val > 0 ? 'text-rose-400' : 'text-slate-500'}`}>{p.val ?? 0}</span>
                                </div>
                            ))}
                         </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* VALIDATION TAB */}
      {activeTab === 'validation' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm min-h-[400px]">
            <h2 className="text-2xl font-black text-slate-900 mb-8 border-b pb-6">Payload Access Control</h2>
            
            {loading ? (
              <div className="flex items-center gap-3 text-slate-500 font-medium py-10"><div className="w-5 h-5 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin" />Scanning moderation buffers...</div>
            ) : pendingItems.length === 0 ? (
              <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
                <span className="text-5xl block mb-4 animate-bounce">🛡️</span>
                <span className="block text-slate-400 font-black text-xl mb-2">Zero Threat Vectors</span>
                <p className="text-slate-500">All external listing data has been properly scrubbed and validated.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-4">
                  <thead>
                    <tr className="text-slate-400 font-black text-[10px] uppercase tracking-widest">
                      <th className="px-6 py-2">Module Type</th>
                      <th className="px-6 py-2">Payload Title</th>
                      <th className="px-6 py-2">Status</th>
                      <th className="px-6 py-2 text-right">Clearance Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingItems.map((item, idx) => (
                      <tr key={item._id || idx} className="bg-slate-50 hover:bg-indigo-50/30 transition-all group rounded-2xl">
                        <td className="px-6 py-5 rounded-l-2xl">
                          <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-md border
                            ${item.itemType === 'Job' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 
                              item.itemType === 'Freelance' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                              'bg-amber-50 text-amber-700 border-amber-200'}`}
                          >
                            {item.itemType}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="font-black text-slate-900">{item.title}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase">{ownerLabel(item.company || item.client || item.university)}</div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${item.status === 'changes_requested' ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                            {item.status || 'pending'}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right rounded-r-2xl space-x-2">
                          <button 
                            onClick={() => handleValidate(item._id, item.itemType, true)}
                            className="p-2.5 bg-slate-900 hover:bg-emerald-600 text-white font-black rounded-xl transition-all shadow-lg hover:shadow-emerald-200"
                            title="Approve"
                          >
                            ✅
                          </button>
                          <button 
                            onClick={() => {
                              setFeedbackItem({ id: item._id, type: item.itemType });
                              setFeedbackText(item.feedbackMessage || '');
                              setShowFeedbackModal(true);
                            }}
                            className="p-2.5 bg-white text-amber-600 border border-amber-200 hover:bg-amber-50 font-black rounded-xl transition-all"
                            title="Request Changes"
                          >
                            📝
                          </button>
                          <button 
                            onClick={() => handleValidate(item._id, item.itemType, false)}
                            className="p-2.5 bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 font-black rounded-xl transition-all"
                            title="Reject"
                          >
                            ❌
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>
      )}

      {/* OPERATORS TAB */}
      {activeTab === 'operators' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
           <h2 className="text-2xl font-black text-slate-900 mb-8">Operator Clearance</h2>
           <div className="flex items-center gap-8 p-10 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden group">
             {/* Decorative Background */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-indigo-500/20 transition-all duration-700" />
             
             <div className="h-24 w-24 rounded-3xl bg-gradient-to-tr from-rose-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-4xl shadow-2xl z-10 scale-110">
               {user?.name?.charAt(0).toUpperCase() || 'A'}
             </div>
             <div className="z-10">
               <div className="text-3xl font-black text-white mb-2">{user?.name}</div>
               <div className="text-slate-400 font-bold mb-4">{user?.email}</div>
               <div className="flex gap-2">
                  <span className="px-3 py-1 bg-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-rose-500/30">Master Key</span>
                  <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-500/30">System Admin</span>
               </div>
             </div>
           </div>
           <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Auth Module</div>
                    <div className="text-sm font-bold text-slate-700">JWT Session: ACTIVE</div>
                    <div className="text-xs text-slate-500 mt-1">Expiry in 7 days</div>
                </div>
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Audit Logs</div>
                    <div className="text-sm font-bold text-slate-700">All actions are recorded.</div>
                    <div className="text-xs text-slate-500 mt-1">Last successful validation: {new Date().toLocaleDateString()}</div>
                </div>
           </div>
        </div>
      )}
      
    </div>
  );
}
