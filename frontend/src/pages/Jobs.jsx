import { useEffect, useState } from 'react';
import { dataService } from '../services/dataService';
import OpportunityCard from '../components/OpportunityCard';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dataService.getJobs()
      .then(res => setJobs(res.data.data || res.data || []))
      .catch(err => console.error("Error fetching jobs:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-slate-500 font-medium animate-pulse">Syncing jobs database...</div>;

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Corporate Jobs Feed</h1>
        <p className="text-slate-500 mt-2">Filter standard employment positions verified by PathFinder.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 items-start">
        {jobs.length === 0 ? (
           <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white">
             <span className="text-slate-400 font-bold block mb-2 text-lg">No Live Postings</span>
             <span className="text-slate-500 text-sm">Our ML agents are fetching new positions. Check back shortly.</span>
           </div>
        ) : jobs.map(job => (
          <OpportunityCard key={job._id} opportunity={job} type="job" />
        ))}
      </div>
    </div>
  );
}
