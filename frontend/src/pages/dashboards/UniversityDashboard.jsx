import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';

export default function UniversityDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('manage'); // 'manage' | 'post'
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  const [scholarshipForm, setScholarshipForm] = useState({
    title: '', academicLevelRequired: 'Bachelor', deadline: '', requiredSkills: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchScholarships = async () => {
    setLoading(true);
    try {
      const res = await dataService.getUniversityScholarships(); 
      setScholarships(res.data.data || res.data || []);
    } catch (err) {
      console.error('Failed to fetch scholarships', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchScholarships(); }, []);

  const handlePostScholarship = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...scholarshipForm,
        requiredSkills: typeof scholarshipForm.requiredSkills === 'string'
          ? scholarshipForm.requiredSkills.split(',').map(s => s.trim()).filter(Boolean)
          : scholarshipForm.requiredSkills
      };

      if (isEditing) {
        await dataService.updateScholarship(editId, payload);
        alert('Scholarship updated and resubmitted for validation!');
      } else {
        await dataService.postScholarship(payload);
        alert('Scholarship posted pending admin validation!');
      }

      setScholarshipForm({ title: '', academicLevelRequired: 'Bachelor', deadline: '', requiredSkills: '' });
      setIsEditing(false);
      setEditId(null);
      setActiveTab('manage');
      fetchScholarships();
    } catch (err) {
      alert('Failed to save scholarship.');
      console.error(err);
    }
  };

  const startEdit = (scholarship) => {
    setScholarshipForm({
      title: scholarship.title,
      academicLevelRequired: scholarship.academicLevelRequired,
      deadline: scholarship.deadline ? new Date(scholarship.deadline).toISOString().split('T')[0] : '',
      requiredSkills: Array.isArray(scholarship.requiredSkills) ? scholarship.requiredSkills.join(', ') : scholarship.requiredSkills
    });
    setEditId(scholarship._id);
    setIsEditing(true);
    setActiveTab('post');
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-10">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            University Portal
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Welcome back, Administrator. Support the next generation.
          </p>
        </div>
        
        <div className="bg-slate-100 p-1.5 rounded-xl flex border border-slate-200 self-start">
          <button 
            onClick={() => {
              setActiveTab('manage');
              setIsEditing(false);
              setScholarshipForm({ title: '', academicLevelRequired: 'Bachelor', deadline: '', requiredSkills: '' });
            }}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'manage' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Manage Grants
          </button>
          <button 
            onClick={() => {
              setActiveTab('post');
              setIsEditing(false);
              setScholarshipForm({ title: '', academicLevelRequired: 'Bachelor', deadline: '', requiredSkills: '' });
            }}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'post' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Issue Scholarship
          </button>
        </div>
      </div>

      {activeTab === 'post' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-black text-slate-900 mb-6">{isEditing ? 'Edit Academic Grant' : 'Create Academic Grant'}</h2>
          <form onSubmit={handlePostScholarship} className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Scholarship Title</label>
              <input 
                type="text" required value={scholarshipForm.title} onChange={e => setScholarshipForm({...scholarshipForm, title: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="e.g. Women in Code 2026 Foundation Grant"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Degree Requirement</label>
                <select 
                  required value={scholarshipForm.academicLevelRequired} onChange={e => setScholarshipForm({...scholarshipForm, academicLevelRequired: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
                >
                  <option value="High School">High School</option>
                  <option value="Bachelor">Bachelor</option>
                  <option value="Master">Master</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Application Deadline</label>
                <input 
                  type="date" required value={scholarshipForm.deadline} onChange={e => setScholarshipForm({...scholarshipForm, deadline: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Target Skills/Fields (Comma sep)</label>
              <input 
                type="text" required value={scholarshipForm.requiredSkills} onChange={e => setScholarshipForm({...scholarshipForm, requiredSkills: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Computer Science, Machine Learning"
              />
            </div>

            <div className="pt-4">
              <button type="submit" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-lg transition-transform active:scale-95">
                {isEditing ? 'Save Changes' : 'Issue Grant Listing'}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'manage' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm min-h-[400px]">
           <h2 className="text-xl font-black text-slate-900 mb-6">Active Scholarships</h2>
           {loading ? (
             <div className="text-slate-500 font-medium animate-pulse">Loading active grants...</div>
           ) : scholarships.length === 0 ? (
             <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl">
               <span className="block text-slate-400 font-bold text-lg mb-2">No Active Scholarships</span>
               <p className="text-slate-500 text-sm">Issue a new scholarship to support promising students.</p>
             </div>
           ) : (
             <div className="grid gap-4">
               {scholarships.map(scholarship => (
                 <div key={scholarship._id} className="border border-slate-100 rounded-2xl p-6 bg-slate-50 flex flex-col transition-all hover:border-slate-200 hover:shadow-sm">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                     <div>
                       <div className="flex items-center gap-3 mb-1">
                         <h3 className="font-black text-slate-900 text-lg">{scholarship.title}</h3>
                         <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-widest rounded-md">
                           Requires {scholarship.academicLevelRequired}
                         </span>
                         <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-md border 
                          ${scholarship.status === 'validated' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 
                            scholarship.status === 'changes_requested' ? 'bg-amber-100 text-amber-800 border-amber-200' : 
                            scholarship.status === 'rejected' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                            'bg-slate-100 text-slate-800 border-slate-200'}`}
                        >
                          {scholarship.status === 'validated' ? 'Validated' : 
                           scholarship.status === 'changes_requested' ? 'Changes Requested' : 
                           scholarship.status === 'rejected' ? 'Rejected' : 'Pending Review'}
                        </span>
                       </div>
                       <p className="text-slate-500 text-sm font-medium mt-2">
                         Deadline: <span className="font-bold text-slate-700">{scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString() : 'N/A'}</span>
                       </p>
                     </div>
                     
                     <div className="flex items-center gap-3 shrink-0">
                       <button 
                        onClick={() => startEdit(scholarship)}
                        className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-sm"
                       >
                         Edit
                       </button>
                       <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-sm">
                         Review Candidates
                       </button>
                     </div>
                   </div>

                   {scholarship.status === 'changes_requested' && scholarship.feedbackMessage && (
                    <div className="mt-2 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                      <div className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-1 flex items-center gap-1">
                        <span>Admin Feedback</span>
                        <div className="w-1 h-1 bg-amber-800 rounded-full animate-pulse" />
                      </div>
                      <p className="text-amber-900 text-xs font-medium leading-relaxed italic">
                        "{scholarship.feedbackMessage}"
                      </p>
                    </div>
                  )}

                   <div className="mt-3 border-t pt-3 border-slate-200/50 text-xs">
                      <span className="font-bold text-slate-500 mr-2 uppercase">Applications:</span>
                      <span className="font-black text-indigo-600">{scholarship.applications?.length || 0}</span>
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
