import { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dataService.getJobs()
      .then(res => setJobs(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl">
      <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-6">Open Job Postings</h1>
      
      {loading ? (
        <div className="animate-pulse text-slate-500">Loading jobs...</div>
      ) : (
        <div className="grid gap-4">
          {jobs.length === 0 ? (
            <p className="text-slate-500 bg-slate-50 p-6 rounded-xl border border-slate-100">No jobs available right now.</p>
          ) : (
            jobs.map(job => (
              <div key={job._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{job.title}</h2>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{job.description}</p>
                </div>
                <button className="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-lg hover:bg-indigo-100 transition">
                  Apply Now
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
