import { useEffect, useState } from 'react';
import { dataService } from '../services/dataService';

export default function CV() {
  const [cvContent, setCvContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [downloading, setDownloading] = useState(null); // 'pdf' | 'docx' | null
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const [viewMode, setViewMode] = useState('editor'); // 'editor' | 'preview' | 'upload'

  const fetchCV = () => {
    setLoading(true);
    dataService.getCV()
      .then(res => {
         const content = res.data && res.data.content ? res.data.content : (res.data ? JSON.stringify(res.data, null, 2) : '');
         setCvContent(content);
      })
      .catch(err => console.error('Error fetching CV', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCV(); }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await dataService.generateCV();
      fetchCV();
    } catch (err) {
      alert('AI failed to generate CV payload.');
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleUpdate = async (e) => {
    if (e) e.preventDefault();
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

  const handleDownload = async (format) => {
    setDownloading(format);
    try {
      const res = format === 'pdf' ? await dataService.downloadPDF() : await dataService.downloadDOCX();
      const blob = new Blob([res.data], {
        type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = format === 'pdf' ? 'cv.pdf' : 'cv.docx';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(`Failed to download ${format.toUpperCase()}. Ensure your profile is complete.`);
      console.error(err);
    } finally {
      setDownloading(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;
    setUploading(true);
    setUploadResult(null);
    try {
      const formData = new FormData();
      formData.append('cvFile', uploadFile);
      const res = await dataService.uploadCV(formData);
      setUploadResult({ success: true, data: res.data.parsedData });
      setUploadFile(null);
    } catch (err) {
      setUploadResult({ success: false, error: err.response?.data?.message || 'Parse failed.' });
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-8 text-indigo-600 font-bold animate-pulse text-lg text-center mt-20">Initializing ATS Processing Nodes...</div>;

  let parsedContent = null;
  try {
    parsedContent = typeof cvContent === 'string' ? JSON.parse(cvContent) : cvContent;
  } catch (e) {
    parsedContent = null;
  }

  return (
    <div className="h-full flex flex-col max-w-6xl mx-auto pb-10">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="print:hidden">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Professional Portfolio</h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">Export optimized career vouchers derived from your ML profile.</p>
        </div>
        
        <div className="flex items-center gap-3 print:hidden">
          <div className="bg-slate-100 p-1 rounded-xl flex border border-slate-200">
            <button 
              onClick={() => setViewMode('editor')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'editor' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Raw Data
            </button>
            <button 
              onClick={() => setViewMode('preview')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'preview' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Sleek Preview
            </button>
            <button 
              onClick={() => setViewMode('upload')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'upload' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Upload & Parse
            </button>
          </div>
          
          <button 
            onClick={handleGenerate} disabled={generating}
            className={`px-5 py-2.5 rounded-xl font-black text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2 border text-sm ${generating ? 'bg-slate-400 border-slate-500' : 'bg-slate-900 border-slate-800 hover:bg-indigo-600 hover:border-indigo-700'}`}
          >
            {generating ? 'Rebuilding...' : 'Magic Build'}
          </button>
          
          <button 
            onClick={() => handleDownload('pdf')}
            disabled={downloading === 'pdf'}
            className="px-5 py-2.5 bg-indigo-600 text-white font-black rounded-xl text-sm border border-indigo-700 shadow-md hover:bg-indigo-500 transition-all flex items-center gap-2 disabled:opacity-60"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {downloading === 'pdf' ? '...' : 'PDF'}
          </button>

          <button 
            onClick={() => handleDownload('docx')}
            disabled={downloading === 'docx'}
            className="px-5 py-2.5 bg-slate-700 text-white font-black rounded-xl text-sm border border-slate-800 shadow-md hover:bg-slate-600 transition-all flex items-center gap-2 disabled:opacity-60"
          >
            {downloading === 'docx' ? '...' : 'DOCX'}
          </button>
        </div>
      </div>

      {viewMode === 'upload' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-sm">
          <h2 className="text-xl font-black text-slate-900 mb-2">Upload & Auto-Parse CV</h2>
          <p className="text-slate-500 text-sm mb-6">Upload an existing PDF or DOCX resume. Our AI will parse it and extract your skills, education, and experience.</p>
          <form onSubmit={handleUpload} className="max-w-lg space-y-4">
            <label className="flex items-center gap-4 px-6 py-8 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-indigo-300 transition-colors bg-slate-50 hover:bg-indigo-50">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <div>
                <p className="font-bold text-slate-700 text-sm">{uploadFile ? uploadFile.name : 'Click to select a file'}</p>
                <p className="text-xs text-slate-400 mt-0.5">PDF or DOCX, max 5MB</p>
              </div>
              <input type="file" accept=".pdf,.docx" onChange={e => setUploadFile(e.target.files[0])} className="sr-only" />
            </label>
            <button
              type="submit"
              disabled={!uploadFile || uploading}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black rounded-xl shadow-lg transition-all text-sm"
            >
              {uploading ? 'Parsing...' : 'Parse Resume'}
            </button>
          </form>
          {uploadResult && (
            <div className={`mt-6 p-5 rounded-2xl border ${uploadResult.success ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
              {uploadResult.success ? (
                <div>
                  <p className="font-black text-emerald-800 mb-2">✓ Resume parsed successfully!</p>
                  <pre className="text-xs text-emerald-700 overflow-x-auto bg-white rounded-xl p-4 border border-emerald-100">{JSON.stringify(uploadResult.data, null, 2)}</pre>
                </div>
              ) : (
                <p className="font-bold text-rose-700">✗ {uploadResult.error}</p>
              )}
            </div>
          )}
        </div>
      )}

      {viewMode === 'editor' && (
        <form onSubmit={handleUpdate} className="flex-1 flex flex-col bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 min-h-[500px] print:hidden">
          <div className="bg-slate-800 border-b border-slate-700 px-6 py-3 flex items-center justify-between">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500 opacity-80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500 opacity-80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500 opacity-80"></div>
            </div>
            <p className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest leading-none">CV Payload Environment</p>
            <div className="w-10"></div>
          </div>

          <div className="flex-1 p-6 font-mono text-sm">
            <textarea 
              className="w-full h-full bg-transparent text-emerald-400 focus:outline-none resize-none leading-relaxed"
              value={cvContent}
              onChange={(e) => setCvContent(e.target.value)}
              spellCheck="false"
              placeholder="// Generate content to begin...&#10;{}"
            />
          </div>
          
          <div className="bg-slate-950 border-t border-slate-800 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-black rounded-lg shadow-md transition-all">
                 $ SAVE_CHANGES
               </button>
               {saveStatus === 'syncing' && <span className="text-amber-400 font-mono text-xs animate-pulse">Syncing...</span>}
               {saveStatus === 'success' && <span className="text-emerald-400 font-mono text-xs font-bold">[ OK ] Saved.</span>}
            </div>
            <span className="text-slate-700 font-mono text-[10px]">v1.4.2-STABLE</span>
          </div>
        </form>
      )}

      {viewMode === 'preview' && (
        <div className="flex-1 bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden print:shadow-none print:border-none">
           {!parsedContent ? (
              <div className="flex flex-col items-center justify-center p-20 text-slate-400">
                 <p className="font-bold text-lg mb-2">Invalid Payload Structure</p>
                 <p className="text-sm">Switch to editor to fix JSON syntax or rebuild with Magic Build.</p>
              </div>
           ) : (
              <div className="max-w-[800px] mx-auto p-12 sm:p-20 bg-white">
                 <div className="border-b-4 border-slate-900 pb-10 mb-10">
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase mb-2">
                       {parsedContent?.personalInfo?.name || 'Career Professional'}
                    </h2>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-slate-600 font-bold text-sm uppercase tracking-wide">
                        <span>{parsedContent?.personalInfo?.email || 'candidate@pathfinder.ai'}</span>
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full my-auto"></span>
                        <span>Tunis, Tunisia</span>
                    </div>
                 </div>
                 <div className="mb-12">
                    <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Professional Narrative</h3>
                    <p className="text-slate-700 text-lg leading-relaxed font-serif italic">
                       &ldquo;{parsedContent?.summary || 'No summary generated.'}&rdquo;
                    </p>
                 </div>
                 <div className="mb-12">
                    <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Core Competencies</h3>
                    <div className="flex flex-wrap gap-2 text-sm">
                       {(parsedContent?.skills || []).map((skill, i) => (
                          <span key={i} className="bg-slate-50 border border-slate-200 text-slate-800 px-3 py-1.5 rounded-lg font-bold">{skill}</span>
                       ))}
                    </div>
                 </div>
                 <div className="mb-12">
                    <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Professional Trajectory</h3>
                    <div className="space-y-8">
                       {(parsedContent?.experience || []).map((exp, i) => (
                          <div key={i} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-200">
                             <div className="absolute left-[-4px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-900"></div>
                             <h4 className="text-xl font-bold text-slate-900">{exp.title}</h4>
                             <div className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-2">{exp.company} | {exp.duration || '2023 - Present'}</div>
                             <p className="text-slate-600 text-sm leading-relaxed">{exp.description}</p>
                          </div>
                       ))}
                    </div>
                 </div>
                 <div className="mb-12">
                    <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Academic Foundation</h3>
                    <div className="space-y-6">
                       {(parsedContent?.education || []).map((edu, i) => (
                          <div key={i}>
                             <h4 className="text-lg font-bold text-slate-900">{edu.degree || edu.title}</h4>
                             <div className="text-slate-500 font-bold text-xs uppercase tracking-wider">{edu.school || edu.institution} | {edu.gradYear || '2024'}</div>
                          </div>
                       ))}
                    </div>
                 </div>
                 <div className="mt-20 pt-10 border-t border-slate-100 text-center">
                    <p className="text-[10px] text-slate-300 font-mono uppercase tracking-[0.3em]">Generated by PathFinder AI Oracle Core</p>
                 </div>
              </div>
           )}
        </div>
      )}
    </div>
  );
}
