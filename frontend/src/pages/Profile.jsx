import { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';

export default function Profile() {
  const [formData, setFormData] = useState({ bio: '', availability: '', avatar: '', cvFile: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    dataService.getProfile()
      .then(res => {
        if (res.data) {
          setFormData({
            bio: res.data.bio || '',
            availability: res.data.availability || '',
            avatar: res.data.avatar || '',
            cvFile: res.data.cvFile || ''
          });
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);
    
    try {
      const res = await dataService.uploadFile(data);
      setFormData(prev => ({ ...prev, [field]: res.data.path }));
      setMessage(`${field === 'avatar' ? 'Avatar' : 'CV'} uploaded and staged for synchronization.`);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage(`Failed to upload ${field}.`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await dataService.updateProfile(formData);
      setMessage("Profile synchronized automatically.");
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage("Failed to sync profile payload.");
    }
  };

  if (loading) return <div className="p-8 text-slate-500 animate-pulse font-medium">Loading profile context...</div>;

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Profile Settings</h1>
        <p className="text-slate-500 mt-2">Manage your foundational AI pipeline tracking variables.</p>
      </div>
      
      {message && (
        <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-md flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-emerald-800 font-medium text-sm">{message}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 sm:p-10 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-900">Personal Data Model</h2>
          <p className="text-sm text-slate-500 mt-1">This context is parsed heavily by the Recommendation engine vectors.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 sm:p-10 flex flex-col gap-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-bold text-slate-800 mb-1">Profile Picture</label>
              <p className="text-xs text-slate-500 leading-relaxed pr-4">Upload an image to be used across the platform and by the matching algorithms.</p>
            </div>
            <div className="md:col-span-2 flex items-center gap-6">
              <div className="shrink-0">
                {formData.avatar ? (
                  <img 
                    src={`http://localhost:5000${formData.avatar}`} 
                    alt="Avatar Preview" 
                    className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500 shadow-md"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center border-2 border-dashed border-slate-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'avatar')}
                className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
              />
            </div>
          </div>

          <hr className="border-slate-100" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-bold text-slate-800 mb-1">Algorithmic Bio</label>
              <p className="text-xs text-slate-500 leading-relaxed pr-4">Summary of your skills and targets parsed natively by the AI semantic net.</p>
            </div>
            <div className="md:col-span-2">
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="w-full border border-slate-300 p-4 rounded-xl h-40 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 transition-shadow shadow-sm resize-none"
                placeholder="I am an experienced Node.js developer..."
              />
            </div>
          </div>
          
          <hr className="border-slate-100" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-bold text-slate-800 mb-1">Availability Window</label>
              <p className="text-xs text-slate-500 leading-relaxed pr-4">What is your current hiring layout target? (e.g., Immediate, Next Month)</p>
            </div>
            <div className="md:col-span-2">
              <input
                type="text"
                value={formData.availability}
                onChange={(e) => setFormData({...formData, availability: e.target.value})}
                className="w-full border border-slate-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 transition-shadow shadow-sm"
                placeholder="Immediately available for remote work"
              />
            </div>
          </div>

          <hr className="border-slate-100" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-bold text-slate-800 mb-1">Resume / CV</label>
              <p className="text-xs text-slate-500 leading-relaxed pr-4">Provide your latest CV for the ATS verification system.</p>
            </div>
            <div className="md:col-span-2 flex flex-col gap-3">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileUpload(e, 'cvFile')}
                className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
              />
              {formData.cvFile && (
                <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-xs font-semibold truncate max-w-xs">{formData.cvFile.split('/').pop()}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4 pt-6 border-t border-slate-100">
            <button type="submit" className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Synchronize Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
