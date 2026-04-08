import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';

export default function CompanyDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('manage'); // 'manage' | 'post'
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Job Form State
  const [jobForm, setJobForm] = useState({
    title: '', description: '', requiredExperience: 0, requiredDegreeLevel: 'Any', requiredSkills: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchCompanyJobs = async () => {
    setLoading(true);
    try {
      const res = await dataService.getCompanyJobs(); 
      setJobs(res.data.data || res.data || []);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyJobs();
  }, []);

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...jobForm,
        requiredSkills: typeof jobForm.requiredSkills === 'string' 
          ? jobForm.requiredSkills.split(',').map(s => s.trim()).filter(Boolean)
          : jobForm.requiredSkills
      };

      if (isEditing) {
        await dataService.updateJob(editId, payload);
        alert('Job updated and resubmitted for validation!');
      } else {
        await dataService.postJob(payload);
        alert('Job successfully posted pending admin validation!');
      }

      setJobForm({ title: '', description: '', requiredExperience: 0, requiredDegreeLevel: 'Any', requiredSkills: '' });
      setIsEditing(false);
      setEditId(null);
      setActiveTab('manage');
      fetchCompanyJobs();
    } catch (err) {
      alert('Failed to save job.');
      console.error(err);
    }
  };

  const startEdit = (job) => {
    setJobForm({
      title: job.title,
      description: job.description,
      requiredExperience: job.requiredExperience,
      requiredDegreeLevel: job.requiredDegreeLevel || 'Any',
      requiredSkills: Array.isArray(job.requiredSkills) ? job.requiredSkills.join(', ') : job.requiredSkills
    });
    setEditId(job._id);
    setIsEditing(true);
    setActiveTab('post');
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Company Portal
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Welcome back, {user?.name}. Manage your talent pipeline.
          </p>
        </div>
        
        <div className="bg-slate-100 p-1.5 rounded-xl flex border border-slate-200 self-start">
          <button 
            onClick={() => {
              setActiveTab('manage');
              setIsEditing(false);
              setJobForm({ title: '', description: '', requiredExperience: 0, requiredSkills: '' });
            }}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'manage' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Manage Postings
          </button>
          <button 
            onClick={() => {
              setActiveTab('post');
              setIsEditing(false);
              setJobForm({ title: '', description: '', requiredExperience: 0, requiredSkills: '' });
            }}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'post' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Post New Job
          </button>
        </div>
      </div>

      {activeTab === 'post' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-black text-slate-900 mb-6">{isEditing ? 'Edit Job Listing' : 'Draft a New Listing'}</h2>
          <form onSubmit={handlePostJob} className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Job Title</label>
              <input 
                type="text" required value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="e.g. Senior Frontend Engineer"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Description & Responsibilities</label>
              <textarea 
                required rows="4" value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                placeholder="Describe the role..."
              />
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Required Experience (Years)</label>
                <input 
                  type="number" min="0" required value={jobForm.requiredExperience} onChange={e => setJobForm({...jobForm, requiredExperience: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Required Degree</label>
                <select
                  value={jobForm.requiredDegreeLevel} onChange={e => setJobForm({...jobForm, requiredDegreeLevel: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
                >
                  {['Any', 'High School', 'Bachelor', 'Master', 'PhD'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Required Skills (Comma separated)</label>
                <input 
                  type="text" required value={jobForm.requiredSkills} onChange={e => setJobForm({...jobForm, requiredSkills: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="React, JavaScript, AWS"
                />
              </div>
            </div>
            <div className="pt-4">
              <button type="submit" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-lg transition-transform active:scale-95">
                {isEditing ? 'Save Changes' : 'Publish Opening'}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'manage' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm min-h-[400px]">
          <h2 className="text-xl font-black text-slate-900 mb-6">Active Job Postings</h2>
          
          {loading ? (
             <div className="text-slate-500 font-medium animate-pulse">Loading active postings...</div>
          ) : jobs.length === 0 ? (
             <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl">
               <span className="block text-slate-400 font-bold text-lg mb-2">No active jobs</span>
               <p className="text-slate-500 text-sm">You haven't posted any jobs yet. Switch to the Post tab to create one.</p>
             </div>
          ) : (
            <div className="grid gap-4">
              {jobs.map(job => (
                <div key={job._id} className="border border-slate-100 rounded-2xl p-6 bg-slate-50 flex flex-col transition-all hover:border-slate-200 hover:shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-black text-slate-900 text-lg">{job.title}</h3>
                        <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-md border 
                          ${job.status === 'validated' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 
                            job.status === 'changes_requested' ? 'bg-amber-100 text-amber-800 border-amber-200' : 
                            job.status === 'rejected' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                            'bg-slate-100 text-slate-800 border-slate-200'}`}
                        >
                          {job.status === 'validated' ? 'Validated' : 
                           job.status === 'changes_requested' ? 'Changes Requested' : 
                           job.status === 'rejected' ? 'Rejected' : 'Pending Review'}
                        </span>
                      </div>
                      <p className="text-slate-500 text-sm font-medium line-clamp-1">{job.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-3 shrink-0">
                      <button 
                        onClick={() => startEdit(job)}
                        className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-sm"
                      >
                        Edit
                      </button>
                      <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-sm">
                        View Candidates
                      </button>
                      <button className="px-5 py-2.5 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-100 transition-colors">
                        Close Job
                      </button>
                    </div>
                  </div>

                  {job.status === 'changes_requested' && job.feedbackMessage && (
                    <div className="mt-2 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                      <div className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-1 flex items-center gap-1">
                        <span>Admin Feedback</span>
                        <div className="w-1 h-1 bg-amber-800 rounded-full animate-pulse" />
                      </div>
                      <p className="text-amber-900 text-xs font-medium leading-relaxed italic">
                        "{job.feedbackMessage}"
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 mt-3 border-t pt-3 border-slate-200/50">
                    <div className="flex items-center gap-1.5 opacity-70">
                        <span className="font-bold text-slate-500 text-[10px] uppercase">Applicants:</span>
                        <span className="font-black text-indigo-600 text-xs">{job.applications?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-70">
                        <span className="font-bold text-slate-500 text-[10px] uppercase">Experience:</span>
                        <span className="font-black text-slate-900 text-xs">{job.requiredExperience}+ yrs</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
