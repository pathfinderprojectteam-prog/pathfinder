import { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';

export default function CompanyProfile() {
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    companySize: '',
    website: '',
    phone: '',
    location: { city: '', country: '', address: '' },
    bio: '',
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
            companySize: res.data.companySize || '',
            website: res.data.website || '',
            phone: res.data.phone || '',
            location: res.data.location || { city: '', country: '', address: '' },
            bio: res.data.bio || '',
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
      setMessage({ type: 'success', text: 'Company profile successfully updated.' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update company profile.' });
    }
  };

  if (loading) return <div className="p-10 text-xl font-semibold text-slate-500 animate-pulse text-center">Loading Enterprise Profile...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Company Profile</h1>
        <p className="text-slate-500 mt-2">Personalize your brand to attract top talent and maintain institutional standards.</p>
      </div>

      {message && (
        <div className={`mb-8 p-4 rounded-xl font-bold text-center border ${message.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10">
          <h2 className="text-xl font-black text-slate-900 mb-8 border-b pb-4">Corporate Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="md:col-span-2">
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">Official Company Name</label>
              <input type="text" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="w-full border-slate-200 rounded-xl p-4 bg-slate-50 focus:ring-2 focus:ring-indigo-500 transition-all font-medium" placeholder="Acme Corp International" />
            </div>
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">Industry Vertical</label>
              <input type="text" value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} className="w-full border-slate-200 rounded-xl p-4 bg-slate-50 focus:ring-2 focus:ring-indigo-500 transition-all font-medium" placeholder="Technology / Fintech" />
            </div>
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">Company Size</label>
              <select value={formData.companySize} onChange={e => setFormData({...formData, companySize: e.target.value})} className="w-full border-slate-200 rounded-xl p-4 bg-slate-50 focus:ring-2 focus:ring-indigo-500 transition-all font-medium">
                <option value="">Select Scale</option>
                <option value="1-10">1-10 Employees</option>
                <option value="11-50">11-50 Employees</option>
                <option value="51-200">51-200 Employees</option>
                <option value="201-500">201-500 Employees</option>
                <option value="500+">500+ Employees</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">Public Website</label>
              <input type="text" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} className="w-full border-slate-200 rounded-xl p-4 bg-slate-50 focus:ring-2 focus:ring-indigo-500 transition-all font-medium" placeholder="https://acme.org" />
            </div>
             <div>
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">Contact Phone</label>
              <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border-slate-200 rounded-xl p-4 bg-slate-50 focus:ring-2 focus:ring-indigo-500 transition-all font-medium" placeholder="+1 (555) 000-0000" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10">
          <h2 className="text-xl font-black text-slate-900 mb-8 border-b pb-4">Headquarters & Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">City</label>
              <input type="text" value={formData.location.city} onChange={e => setFormData({...formData, location: {...formData.location, city: e.target.value}})} className="w-full border-slate-200 rounded-xl p-4 bg-slate-50 focus:ring-2 focus:ring-indigo-500 font-medium" placeholder="Silicon Valley" />
            </div>
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">Country</label>
              <input type="text" value={formData.location.country} onChange={e => setFormData({...formData, location: {...formData.location, country: e.target.value}})} className="w-full border-slate-200 rounded-xl p-4 bg-slate-50 focus:ring-2 focus:ring-indigo-500 font-medium" placeholder="USA" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">Company Mission / Bio</label>
              <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full border-slate-200 rounded-xl p-4 bg-slate-50 focus:ring-2 focus:ring-indigo-500 h-32 font-medium" placeholder="Tell talent why they should join your mission..." />
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-6">
          <button type="submit" className="px-12 py-5 bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-black rounded-2xl shadow-xl shadow-indigo-100 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 duration-200">
            Save Enterprise Identity
          </button>
        </div>
      </form>
    </div>
  );
}
