import { useEffect, useState } from 'react';
import { dataService } from '../services/dataService';

export default function Recommendations() {
  const [jobs, setJobs] = useState([]);
  const [freelance, setFreelance] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dataService.getRecommendedJobs().catch(() => ({ data: [] })),
      dataService.getRecommendedFreelance().catch(() => ({ data: [] })),
      dataService.getRecommendedScholarships().catch(() => ({ data: [] }))
    ]).then(([jRes, fRes, sRes]) => {
      setJobs(jRes.data || []);
      setFreelance(fRes.data || []);
      setScholarships(sRes.data || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-indigo-600 font-bold animate-pulse text-lg">Performing Vector Matching Analysis...</div>;

  const renderSection = (title, items, colorTheme) => (
    <div className="mb-14">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-black text-slate-900">{title}</h2>
        <div className="h-px bg-slate-200 flex-1 ml-4"></div>
      </div>
      
      {items.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center">
            <p className="text-slate-500 font-medium">Insufficient metadata profile weight to compute secure matches for this dataset.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <div key={item._id || idx} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group">
               
               {/* Match Score Banner Badge */}
               <div className={`absolute top-0 right-0 font-black px-4 py-1.5 rounded-bl-xl shadow-sm ${colorTheme}`}>
                 {item.matchScore || 'N/A'}% MATCH V-SCORE
               </div>
               
               <h3 className="text-xl font-bold mt-4 mb-2 text-slate-800 pr-24 group-hover:text-indigo-600 transition-colors">{item.title}</h3>
               
               {item.matchReason && (
                 <div className="mt-5 p-4 rounded-xl text-sm bg-indigo-50/50 border border-indigo-100/50 relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-400 rounded-l-xl"></div>
                    <strong className="block mb-1.5 text-indigo-900 tracking-wide uppercase text-xs">AI Inference Pathway:</strong>
                    <span className="text-slate-700 leading-relaxed font-medium">{item.matchReason}</span>
                 </div>
               )}
               
               <button className="mt-6 w-full py-3 bg-slate-50 hover:bg-slate-900 hover:text-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-all shadow-sm group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600">
                  Inspect Parameter Details
               </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-10 gap-4">
        <div>
           <h1 className="text-4xl font-black tracking-tight text-slate-900">Intelligence Feed</h1>
           <p className="text-slate-500 mt-2">Personalized vector matches isolated by the PathFinder generative core.</p>
        </div>
        <span className="text-xs px-3 py-1.5 bg-indigo-100 text-indigo-700 font-black border border-indigo-200 rounded-full flex items-center gap-2 w-fit shadow-sm">
          <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
          MODELS ACTIVE
        </span>
      </div>
      
      {renderSection("Matched Market Jobs", jobs, "bg-indigo-500 text-white")}
      {renderSection("Matched Freelance Subcontracts", freelance, "bg-emerald-500 text-white")}
      {renderSection("Isolated Demographics Scholarships", scholarships, "bg-amber-500 text-white")}
    </div>
  );
}
