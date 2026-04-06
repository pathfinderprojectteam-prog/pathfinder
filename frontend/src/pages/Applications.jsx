import { useEffect, useState } from 'react';
import { dataService } from '../services/dataService';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dataService.getUserApplications()
      .then(res => setApplications(res.data.data || res.data || []))
      .catch(err => console.error("Error fetching applications:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-slate-500 font-medium animate-pulse">Syncing personal tracking logs...</div>;

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Application Tracker</h1>
        <p className="text-slate-500 mt-2">Monitor all dispatched ML profile packets submitted into the ecosystem.</p>
      </div>

      <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Target Opportunity</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Pipeline Status</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-sm text-slate-500 font-medium">
                    No active application history detected. Find jobs in the Opportunities market.
                  </td>
                </tr>
              ) : applications.map(app => (
                <tr key={app._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="font-bold text-slate-900 border-b border-dashed border-slate-300 w-fit pb-1">
                      {app.job?.title || 'Unknown Position'}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border
                      ${app.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                        app.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                        'bg-rose-50 text-rose-700 border-rose-200'}`
                    }>
                      {app.status === 'pending' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>}
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm font-medium text-slate-600">
                      {new Date(app.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-3 py-1.5 rounded-md hover:bg-indigo-100">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
