import { useEffect, useState } from 'react';
import { dataService } from '../services/dataService';
import OpportunityCard from '../components/OpportunityCard';

export default function Freelance() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dataService.getFreelance()
      .then(res => setProjects(res.data.data || res.data || []))
      .catch(err => console.error("Error fetching freelance:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-slate-500 font-medium animate-pulse">Syncing external subcontract feeds...</div>;

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Freelance Vault</h1>
        <p className="text-slate-500 mt-2">Filter active subcontracting parameters and open project bounties.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 items-start">
        {projects.length === 0 ? (
           <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white">
             <span className="text-slate-400 font-bold block mb-2 text-lg">No Live Subcontracts</span>
             <span className="text-slate-500 text-sm">Target scopes are currently saturated. Ping back later.</span>
           </div>
        ) : projects.map(proj => (
          <OpportunityCard key={proj._id} opportunity={proj} type="freelance" />
        ))}
      </div>
    </div>
  );
}
