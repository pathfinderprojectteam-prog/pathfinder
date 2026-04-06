import { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';

export default function UniversityProfile() {
  const [formData, setFormData] = useState({
    companyName: '',
    institutionType: 'Public',
    phone: '',
    location: { city: '', country: '', address: '' },
    bio: '',
    website: '',
    programs: [],
    accreditation: '',
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [newProgram, setNewProgram] = useState('');

  useEffect(() => {
    dataService.getProfile()
      .then(res => {
        if (res.data) {
          setFormData({
            companyName: res.data.companyName || '',
            institutionType: res.data.institutionType || 'Public',
            phone: res.data.phone || '',
            location: res.data.location || { city: '', country: '', address: '' },
            bio: res.data.bio || '',
            website: res.data.website || '',
            programs: res.data.programs || [],
            accreditation: res.data.accreditation || '',
          });
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await dataService.updateProfile(formData);
      setMessage({ type: 'success', text: 'University profile successfully updated.' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update university profile.' });
    }
  };

  const addProgram = () => {
    if (newProgram.trim()) {
      setFormData({...formData, programs: [...formData.programs, newProgram.trim()]});
      setNewProgram('');
    }
  };

  const removeProgram = (idx) => {
    setFormData({...formData, programs: formData.programs.filter((_, i) => i !== idx)});
  };

  if (loading) return <div className="p-10 text-xl font-semibold text-slate-500 animate-pulse text-center">Loading Institutional Profile...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight text-amber-600">University Profile</h1>
        <p className="text-slate-500 mt-2">Manage your institution's global standing to facilitate scholarship matching and academic growth.</p>
      </div>

      {message && (
        <div className={`mb-8 p-4 rounded-xl font-bold text-center border ${message.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10">
          <h2 className="text-xl font-black text-slate-900 mb-8 border-b pb-4 text-amber-700 uppercase tracking-tighter">Academic Institution Identity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="md:col-span-2">
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">University Name</label>
              <input type="text" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="w-full border-slate-200 rounded-xl p-4 bg-slate-50 focus:ring-2 focus:ring-amber-500 font-medium" placeholder="Harvard, MIT, or Oxford University" />
            </div>
            <div>
               <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">Institution Type</label>
               <select value={formData.institutionType} onChange={e => setFormData({...formData, institutionType: e.target.value})} className="w-full border-slate-200 rounded-xl p-4 bg-slate-50 focus:ring-2 focus:ring-amber-500 font-medium">
                <option value="Public">Public Institution</option>
                <option value="Private">Private Institution</option>
                <option value="Specialized">Specialized Center</option>
               </select>
            </div>
            <div>
               <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">Contact Phone (Registry)</label>
              <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border-slate-200 rounded-xl p-4 bg-slate-50 focus:ring-2 focus:ring-amber-500 font-medium" placeholder="+44 20 0000 0000" />
            </div>
            <div className="md:col-span-2">
               <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">Accreditation Info</label>
              <input type="text" value={formData.accreditation} onChange={e => setFormData({...formData, accreditation: e.target.value})} className="w-full border-slate-200 rounded-xl p-4 bg-slate-50 focus:ring-2 focus:ring-amber-500 font-medium" placeholder="Global University Network / Ministry of Higher Ed" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10">
          <h2 className="text-xl font-black text-slate-900 mb-8 border-b pb-4 text-amber-700 uppercase tracking-tighter">Academic Programs</h2>
          <div className="space-y-4 mb-4">
             <div className="flex gap-4">
              <input type="text" value={newProgram} onChange={e => setNewProgram(e.target.value)} className="flex-1 border-slate-200 rounded-xl p-4 bg-slate-50 focus:ring-2 focus:ring-amber-500 font-medium" placeholder="New Degree/Program Name..." />
              <button type="button" onClick={addProgram} className="px-6 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all">Add</button>
             </div>
             <div className="flex flex-wrap gap-2">
               {formData.programs.map((prog, i) => (
                 <span key={i} className="px-4 py-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-sm font-bold flex items-center gap-2">
                   {prog}
                   <button type="button" onClick={() => removeProgram(i)} className="text-amber-500 hover:text-rose-500 text-lg">×</button>
                 </span>
               ))}
             </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10">
          <h2 className="text-xl font-black text-slate-900 mb-8 border-b pb-4 text-amber-700 uppercase tracking-tighter">Campus & Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">City</label>
              <input type="text" value={formData.location.city} onChange={e => setFormData({...formData, location: {...formData.location, city: e.target.value}})} className="w-full border-slate-200 rounded-xl p-4 bg-slate-50 focus:ring-2 focus:ring-amber-500 font-medium" placeholder="London" />
            </div>
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">Country</label>
              <input type="text" value={formData.location.country} onChange={e => setFormData({...formData, location: {...formData.location, country: e.target.value}})} className="w-full border-slate-200 rounded-xl p-4 bg-slate-50 focus:ring-2 focus:ring-amber-500 font-medium" placeholder="UK" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">Institutional Vision Statement</label>
              <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full border-slate-200 rounded-xl p-4 bg-slate-50 focus:ring-2 focus:ring-amber-500 h-32 font-medium" placeholder="Define your university's mission for future scholars..." />
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-6">
          <button type="submit" className="px-12 py-5 bg-amber-600 hover:bg-amber-700 text-white text-xl font-black rounded-2xl shadow-xl shadow-amber-100 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 duration-200">
            Commit Identity Changes
          </button>
        </div>
      </form>
    </div>
  );
}
