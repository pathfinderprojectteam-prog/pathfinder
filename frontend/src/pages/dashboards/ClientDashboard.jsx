import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';

export default function ClientDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('manage'); // 'manage' | 'post'
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [projectForm, setProjectForm] = useState({
    title: '', description: '', difficulty: 'Beginner', requiredSkills: '', budget: 0, timeline: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await dataService.getClientProjects(); 
      setProjects(res.data.data || res.data || []);
    } catch (err) {
      console.error('Failed to fetch freelance projects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handlePostProject = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...projectForm,
        requiredSkills: typeof projectForm.requiredSkills === 'string'
          ? projectForm.requiredSkills.split(',').map(s => s.trim()).filter(Boolean)
          : projectForm.requiredSkills
      };

      if (isEditing) {
        await dataService.updateFreelanceProject(editId, payload);
        alert('Project updated and resubmitted for validation!');
      } else {
        await dataService.postFreelanceProject(payload);
        alert('Freelance project posted pending admin validation!');
      }

      setProjectForm({ title: '', description: '', difficulty: 'Beginner', requiredSkills: '', budget: 0, timeline: '' });
      setIsEditing(false);
      setEditId(null);
      setActiveTab('manage');
      fetchProjects();
    } catch (err) {
      alert('Failed to save project.');
      console.error(err);
    }
  };

  const startEdit = (project) => {
    setProjectForm({
      title: project.title,
      description: project.description,
      difficulty: project.difficulty,
      requiredSkills: Array.isArray(project.requiredSkills) ? project.requiredSkills.join(', ') : project.requiredSkills,
      budget: project.budget || 0,
      timeline: project.timeline || ''
    });
    setEditId(project._id);
    setIsEditing(true);
    setActiveTab('post');
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-10">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Client Portal
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Welcome back, {user?.name}. Manage your independent contractors.
          </p>
        </div>
        
        <div className="bg-slate-100 p-1.5 rounded-xl flex border border-slate-200 self-start">
          <button 
            onClick={() => {
              setActiveTab('manage');
              setIsEditing(false);
              setProjectForm({ title: '', description: '', difficulty: 'Beginner', requiredSkills: '' });
            }}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'manage' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Manage Contracts
          </button>
          <button 
            onClick={() => {
              setActiveTab('post');
              setIsEditing(false);
              setProjectForm({ title: '', description: '', difficulty: 'Beginner', requiredSkills: '' });
            }}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'post' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Post Mission
          </button>
        </div>
      </div>

      {activeTab === 'post' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-black text-slate-900 mb-6">{isEditing ? 'Edit Freelance Mission' : 'Draft a New Freelance Mission'}</h2>
          <form onSubmit={handlePostProject} className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Project Title</label>
              <input 
                type="text" required value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="e.g. Develop a React Navigation System"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Scope & Details</label>
              <textarea 
                required rows="4" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                placeholder="Describe the deliverables..."
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Difficulty Level</label>
                <select 
                  required value={projectForm.difficulty} onChange={e => setProjectForm({...projectForm, difficulty: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Required Skills (Comma sep)</label>
                <input 
                  type="text" required value={projectForm.requiredSkills} onChange={e => setProjectForm({...projectForm, requiredSkills: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="Vue, Figma, SEO"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Budget (USD)</label>
                <input 
                  type="number" min="0" value={projectForm.budget}
                  onChange={e => setProjectForm({...projectForm, budget: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="e.g. 500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Timeline / Duration</label>
                <input 
                  type="text" value={projectForm.timeline}
                  onChange={e => setProjectForm({...projectForm, timeline: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="e.g. 2 weeks, 1 month"
                />
              </div>
            </div>
            <div className="pt-4">
              <button type="submit" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-lg transition-transform active:scale-95">
                {isEditing ? 'Save Changes' : 'Publish Mission'}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'manage' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm min-h-[400px]">
           <h2 className="text-xl font-black text-slate-900 mb-6">Active Contracts</h2>
           {loading ? (
             <div className="text-slate-500 font-medium animate-pulse">Loading active projects...</div>
           ) : projects.length === 0 ? (
             <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl">
               <span className="block text-slate-400 font-bold text-lg mb-2">No Active Missions</span>
               <p className="text-slate-500 text-sm">Post a mission to interact with freelance talent.</p>
             </div>
           ) : (
             <div className="grid gap-4">
               {projects.map(project => (
                 <div key={project._id} className="border border-slate-100 rounded-2xl p-6 bg-slate-50 flex flex-col transition-all hover:border-slate-200 hover:shadow-sm">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                     <div>
                       <div className="flex items-center gap-3 mb-1">
                         <h3 className="font-black text-slate-900 text-lg">{project.title}</h3>
                         <span className="px-2.5 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-widest rounded-md">
                           {project.difficulty}
                         </span>
                         <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-md border 
                          ${project.status === 'validated' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 
                            project.status === 'changes_requested' ? 'bg-amber-100 text-amber-800 border-amber-200' : 
                            project.status === 'rejected' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                            'bg-slate-100 text-slate-800 border-slate-200'}`}
                        >
                          {project.status === 'validated' ? 'Validated' : 
                           project.status === 'changes_requested' ? 'Changes Requested' : 
                           project.status === 'rejected' ? 'Rejected' : 'Pending Review'}
                        </span>
                       </div>
                       <p className="text-slate-500 text-sm font-medium line-clamp-1">{project.description}</p>
                     </div>
                     
                     <div className="flex items-center gap-3 shrink-0">
                       <button 
                        onClick={() => startEdit(project)}
                        className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-sm"
                       >
                         Edit
                       </button>
                       <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-sm">
                         Review Work
                       </button>
                     </div>
                   </div>

                   {project.status === 'changes_requested' && project.feedbackMessage && (
                    <div className="mt-2 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                      <div className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-1 flex items-center gap-1">
                        <span>Admin Feedback</span>
                        <div className="w-1 h-1 bg-amber-800 rounded-full animate-pulse" />
                      </div>
                      <p className="text-amber-900 text-xs font-medium leading-relaxed italic">
                        "{project.feedbackMessage}"
                      </p>
                    </div>
                  )}

                   <div className="mt-3 border-t pt-3 border-slate-200/50">
                      <span className="font-bold text-slate-500 text-[10px] uppercase mr-2">Submissions:</span>
                      <span className="font-black text-indigo-600 text-xs">{project.submissions?.length || 0}</span>
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
