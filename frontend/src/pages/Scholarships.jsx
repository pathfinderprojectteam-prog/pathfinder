import { useEffect, useState } from 'react';
import { dataService } from '../services/dataService';
import OpportunityCard from '../components/OpportunityCard';

export default function Scholarships() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dataService.getScholarships()
      .then(res => setScholarships(res.data.data || res.data || []))
      .catch(err => console.error("Error fetching scholarships:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-slate-500 font-medium animate-pulse">Computing targeted academic grants...</div>;

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">University Scholarships</h1>
        <p className="text-slate-500 mt-2">Apply for structured academic grants scaling with your mapped UI metadata.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 items-start">
        {scholarships.length === 0 ? (
           <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white">
             <span className="text-slate-400 font-bold block mb-2 text-lg">No Active Scholarships</span>
             <span className="text-slate-500 text-sm">Academic cycles might be closed. Check back during registration frames.</span>
           </div>
        ) : scholarships.map(schol => (
          <OpportunityCard key={schol._id} opportunity={schol} type="scholarship" />
        ))}
      </div>
    </div>
  );
}
