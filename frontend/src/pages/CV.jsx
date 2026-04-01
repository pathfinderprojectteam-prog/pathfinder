import { useEffect, useState } from 'react';
import { dataService } from '../services/dataService';

export default function CV() {
  const [cvContent, setCvContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const fetchCV = () => {
    setLoading(true);
    dataService.getCV()
      .then(res => {
         const content = res.data && res.data.content ? res.data.content : (res.data ? JSON.stringify(res.data, null, 2) : '');
         setCvContent(content);
      })
      .catch(err => console.error("Error fetching CV", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCV(); }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await dataService.generateCV();
      fetchCV();
    } catch (err) {
      alert("AI failed to generate CV payload.");
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaveStatus('syncing');
    try {
      await dataService.updateCV(cvContent);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      setSaveStatus('error');
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-indigo-600 font-bold animate-pulse text-lg">Initializing ATS Processing Nodes...</div>;

  return (
    <div className="h-full flex flex-col max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">ATS Resume Compiler</h1>
          <p className="text-slate-500 mt-2 text-lg">Generate structured export payloads automatically derived from Profile ML matrices.</p>
        </div>
        <button 
          onClick={handleGenerate} disabled={generating}
          className={`shrink-0 px-6 py-3 rounded-xl font-bold text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2 border ${generating ? 'bg-slate-400 border-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-500 to-teal-500 border-emerald-600 hover:from-emerald-600 hover:to-teal-600'}`}
        >
          {generating ? (
            <>
               <svg className="animate-spin -ml-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
               Compiling Tensor Nodes...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              Flash Build CV
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleUpdate} className="flex-1 flex flex-col bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
        
        {/* Terminal Header */}
        <div className="bg-slate-800 border-b border-slate-700 px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500 box-shadow-sm"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500 box-shadow-sm"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500 box-shadow-sm"></div>
          </div>
          <p className="text-xs font-mono text-slate-400 font-bold uppercase tracking-widest">Compiler Output - Raw Payload Editor</p>
          <div className="w-10"></div>{/* Spacer for flex center alignment */}
        </div>

        {/* Console Body */}
        <div className="flex-1 p-6 relative group">
          <div className="absolute top-8 right-8 pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity">
            <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded bg-blur border border-indigo-400/30 text-xs font-mono">EDIT MODE</span>
          </div>
          <textarea 
            className="w-full h-full bg-transparent text-emerald-400 font-mono text-sm leading-relaxed focus:outline-none resize-none scrollbar-thin scrollbar-thumb-slate-700"
            value={cvContent}
            onChange={(e) => setCvContent(e.target.value)}
            spellCheck="false"
            placeholder="// Terminal resting...&#10;// Generate a CV or paste schema here."
          />
        </div>
        
        {/* CLI Footer Bar */}
        <div className="bg-slate-950 border-t border-slate-800 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
             <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-colors focus:ring-2 focus:ring-indigo-400">
               $ COMMIT_UPDATE
             </button>
             {saveStatus === 'syncing' && <span className="text-amber-400 font-mono text-sm flex items-center gap-1"><span className="animate-spin w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full"></span> Pushing...</span>}
             {saveStatus === 'success' && <span className="text-emerald-400 font-mono text-sm font-bold">[ OK ] Synchronized successfully.</span>}
             {saveStatus === 'error' && <span className="text-rose-400 font-mono text-sm font-bold">[ ERR ] Failed payload push.</span>}
          </div>
          <span className="text-slate-600 font-mono text-xs">UTF-8 / JSON Serialization</span>
        </div>
      </form>
    </div>
  );
}
