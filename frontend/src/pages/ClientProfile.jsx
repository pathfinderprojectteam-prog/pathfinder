import { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';

export default function ClientProfile() {
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    phone: '',
    location: { city: '', country: '', address: '' },
    bio: '',
    website: '',
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    dataService.getProfile()
      .then(res => {
        if (res.data) {
          setFormData({
            companyName: res.data.companyName || '',
            industry: res.data.industry || '',
            phone: res.data.phone || '',
            location: res.data.location || { city: '', country: '', address: '' },
            bio: res.data.bio || '',
            website: res.data.website || '',
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
      setMessage({ type: 'success', text: 'Client profile successfully updated.' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update client profile.' });
    }
  };

  if (loading) return <div className="p-10 text-xl font-semibold text-slate-500 animate-pulse text-center">Loading Client Profile...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight text-emerald-600">Client Profile</h1>
        <p className="text-slate-500 mt-2">Personalize your professional identity to post freelance projects and find the best partners.</p>
      </div>

      {message && (
        <div className={`mb-8 p-4 rounded-xl font-bold text-center border ${message.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10">
          <h2 className="text-xl font-black text-slate-900 mb-8 border-b pb-4">Personal/Company Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="md:col-span-2">
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">Professional or Company name</label>
              <input type="text" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="w-full border-slate-200 rounded-xl p-4 bg-slate-50 focus:ring-2 focus:ring-emerald-500 font-medium" placeholder="Jane Doe Inc. or Digital Solutions" />
            </div>
            <div>
               <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">Industry Area</label>
              <input type="text" value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} className="w-full border-slate-200 rounded-xl p-4 bg-slate-50 focus:ring-2 focus:ring-emerald-500 font-medium" placeholder="Graphic Design / Development" />
            </div>
            <div>
               <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">Contact Phone</label>
              <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border-slate-200 rounded-xl p-4 bg-slate-50 focus:ring-2 focus:ring-emerald-500 font-medium" placeholder="+1 (555) 000-0000" />
            </div>
            <div className="md:col-span-2">
               <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">Website / Portfolio</label>
              <input type="text" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} className="w-full border-slate-200 rounded-xl p-4 bg-slate-50 focus:ring-2 focus:ring-emerald-500 font-medium" placeholder="https://jane-doe.io" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10">
          <h2 className="text-xl font-black text-slate-900 mb-8 border-b pb-4">Location Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">City</label>
              <input type="text" value={formData.location.city} onChange={e => setFormData({...formData, location: {...formData.location, city: e.target.value}})} className="w-full border-slate-200 rounded-xl p-4 bg-slate-50 focus:ring-2 focus:ring-emerald-500 font-medium" placeholder="Austin" />
            </div>
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">Country</label>
              <input type="text" value={formData.location.country} onChange={e => setFormData({...formData, location: {...formData.location, country: e.target.value}})} className="w-full border-slate-200 rounded-xl p-4 bg-slate-50 focus:ring-2 focus:ring-emerald-500 font-medium" placeholder="USA" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">Bio / Reputation Statement</label>
              <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full border-slate-200 rounded-xl p-4 bg-slate-50 focus:ring-2 focus:ring-emerald-500 h-32 font-medium" placeholder="Introduce yourself or your enterprise to the freelance community..." />
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-6">
          <button type="submit" className="px-12 py-5 bg-emerald-600 hover:bg-emerald-700 text-white text-xl font-black rounded-2xl shadow-xl shadow-emerald-100 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 duration-200">
            Apply Identity Changes
          </button>
        </div>
      </form>
    </div>
  );
}
