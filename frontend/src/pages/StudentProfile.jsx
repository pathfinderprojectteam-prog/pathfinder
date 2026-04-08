import { useState, useEffect, useMemo } from 'react';
import { dataService } from '../services/dataService';

export default function Profile() {
  const [formData, setFormData] = useState({
    phone: '',
    location: { city: '', country: '' },
    avatar: '',
    cvFile: '',
    bio: '',
    educations: [],
    skills: [],
    experiences: [],
    careerObjective: {
      targetJobTitle: '',
      preferredWorkType: '',
      desiredSalary: '',
      industries: []
    },
    // Academic details for scholarship eligibility
    gpa: '',
    fieldOfStudy: '',
    degreeLevel: '',
    yearsOfStudy: ''
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // Load from backend
  useEffect(() => {
    dataService.getProfile()
      .then(res => {
        if (res.data) {
          setFormData({
            phone: res.data.phone || '',
            location: res.data.location || { city: '', country: '' },
            avatar: res.data.avatar || '',
            cvFile: res.data.cvFile || '',
            bio: res.data.bio || '',
            educations: res.data.educations || [],
            skills: res.data.skills || [],
            experiences: res.data.experiences || [],
            careerObjective: res.data.careerObjective || { targetJobTitle: '', preferredWorkType: '', desiredSalary: '', industries: [] },
            gpa: res.data.gpa ?? '',
            fieldOfStudy: res.data.fieldOfStudy || '',
            degreeLevel: res.data.degreeLevel || '',
            yearsOfStudy: res.data.yearsOfStudy ?? ''
          });
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Compute real-time Profile Completion
  const completionPercentage = useMemo(() => {
    let score = 0;

    // 1. Personal (15%)
    if (formData.phone && formData.location.city && formData.location.country) {
      score += 15;
    }

    // 2. Education (15%)
    if (formData.educations.some(ed => ed.degree && ed.field && ed.institution && ed.yearOfGraduation)) {
      score += 15;
    }

    // 2.5. Academic Details (10%) — required for scholarship eligibility
    if (formData.gpa !== '' && formData.fieldOfStudy && formData.degreeLevel && formData.yearsOfStudy !== '') {
      score += 10;
    }

    // 3. Skills (20%)
    if (formData.skills.some(sk => sk.name && sk.level && sk.yearsExperience !== '')) {
      score += 20;
    }

    // 4. Experience (25%)
    if (formData.experiences.some(ex => ex.title && ex.company && ex.startDate && (ex.endDate || ex.isCurrent) && ex.description)) {
      score += 25;
    }

    // 5. Career Objective (15%)
    if (formData.careerObjective.targetJobTitle && formData.careerObjective.preferredWorkType && formData.careerObjective.desiredSalary && formData.careerObjective.industries.length > 0) {
      score += 15;
    }

    return score;
  }, [formData]);

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await dataService.updateProfile(formData);
      setMessage({ type: 'success', text: 'Profile successfully updated.' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    }
  };

  if (loading) return <div className="p-10 text-xl font-semibold text-slate-500 animate-pulse">Loading Identity Data...</div>;

  return (
    <div className="max-w-5xl pb-24">
      {/* HEADER & REALTIME COMPLETION */}
      <div className="sticky top-0 z-10 bg-slate-50/90 backdrop-blur pb-6 pt-2 border-b border-slate-200 mb-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Student Profile</h1>
            <p className="text-slate-500 mt-2">Manage your core identity to unlock optimal AI matching.</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Completion Status</div>
            <div className="flex items-center gap-3">
              <div className="w-48 h-3 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${completionPercentage === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span className={`text-2xl font-black ${completionPercentage === 100 ? 'text-emerald-600' : 'text-indigo-600'}`}>{completionPercentage}%</span>
            </div>
          </div>
        </div>
        {completionPercentage < 100 && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm font-medium flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Recommendations are blocked until profile reaches 100% completion.
          </div>
        )}
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl font-medium ${message.type === 'error' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-12">
        {/* SECTION 1: PERSONAL INFORMATION */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex justify-between">
            <span>1. Personal Information <span className="text-sm font-normal text-slate-500">(15%)</span></span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
              <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border-slate-300 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-indigo-500" placeholder="+1 234 567 8900" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">City</label>
              <input type="text" value={formData.location.city} onChange={e => setFormData({...formData, location: {...formData.location, city: e.target.value}})} className="w-full border-slate-300 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-indigo-500" placeholder="New York" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Country</label>
              <input type="text" value={formData.location.country} onChange={e => setFormData({...formData, location: {...formData.location, country: e.target.value}})} className="w-full border-slate-300 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-indigo-500" placeholder="USA" />
            </div>
          </div>
        </div>

        {/* SECTION 2: EDUCATION */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex justify-between items-center">
            <span>2. Education <span className="text-sm font-normal text-slate-500">(15%)</span></span>
            <button type="button" onClick={() => setFormData({...formData, educations: [...formData.educations, { degree: '', field: '', institution: '', yearOfGraduation: '', gpa: '' }]})} className="text-sm px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg font-bold transition">
              + Add Education
            </button>
          </h2>
          <div className="space-y-6">
            {formData.educations.map((ed, idx) => (
              <div key={idx} className="p-6 border border-slate-200 rounded-xl relative bg-slate-50 hover:bg-white transition-colors">
                <button type="button" onClick={() => setFormData({...formData, educations: formData.educations.filter((_, i) => i !== idx)})} className="absolute top-4 right-4 text-slate-400 hover:text-rose-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-xs font-bold mb-1">Degree Name</label><input type="text" value={ed.degree} onChange={e => { const newEds = [...formData.educations]; newEds[idx].degree = e.target.value; setFormData({...formData, educations: newEds}); }} className="w-full border-slate-200 rounded p-2 text-sm" placeholder="Bachelor of Science" /></div>
                  <div><label className="block text-xs font-bold mb-1">Field of Study</label><input type="text" value={ed.field} onChange={e => { const newEds = [...formData.educations]; newEds[idx].field = e.target.value; setFormData({...formData, educations: newEds}); }} className="w-full border-slate-200 rounded p-2 text-sm" placeholder="Computer Science" /></div>
                  <div><label className="block text-xs font-bold mb-1">Institution</label><input type="text" value={ed.institution} onChange={e => { const newEds = [...formData.educations]; newEds[idx].institution = e.target.value; setFormData({...formData, educations: newEds}); }} className="w-full border-slate-200 rounded p-2 text-sm" placeholder="University Name" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs font-bold mb-1">Grad Year</label><input type="number" value={ed.yearOfGraduation} onChange={e => { const newEds = [...formData.educations]; newEds[idx].yearOfGraduation = e.target.value; setFormData({...formData, educations: newEds}); }} className="w-full border-slate-200 rounded p-2 text-sm" placeholder="2024" /></div>
                    <div><label className="block text-xs font-bold mb-1">GPA (Opt)</label><input type="text" value={ed.gpa} onChange={e => { const newEds = [...formData.educations]; newEds[idx].gpa = e.target.value; setFormData({...formData, educations: newEds}); }} className="w-full border-slate-200 rounded p-2 text-sm" placeholder="3.8" /></div>
                  </div>
                </div>
              </div>
            ))}
            {formData.educations.length === 0 && <p className="text-slate-400 italic text-sm">No education entries added yet.</p>}
          </div>
        </div>

        {/* SECTION 2.5: ACADEMIC DETAILS */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-sm border border-amber-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <span>2.5. Academic Details</span>
            <span className="text-sm font-normal text-amber-600 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">10% — Required for Scholarships</span>
          </h2>
          <p className="text-sm text-slate-500 mb-6">These details are used to match you with eligible scholarships.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Current GPA <span className="text-slate-400 font-normal">(0.0 – 4.0)</span></label>
              <input
                type="number" min="0" max="4" step="0.1"
                value={formData.gpa}
                onChange={e => setFormData({...formData, gpa: e.target.value})}
                className="w-full border border-amber-200 rounded-lg p-3 bg-white focus:ring-2 focus:ring-amber-400 outline-none transition-all"
                placeholder="e.g. 3.5"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Field of Study</label>
              <select
                value={formData.fieldOfStudy}
                onChange={e => setFormData({...formData, fieldOfStudy: e.target.value})}
                className="w-full border border-amber-200 rounded-lg p-3 bg-white focus:ring-2 focus:ring-amber-400 outline-none transition-all"
              >
                <option value="">Select your field...</option>
                {['Computer Science','Engineering','Business','Medicine','Arts','Law','Education','Mathematics','Physics','Chemistry','Biology','Economics','Psychology','Architecture','Other'].map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Current Degree Level</label>
              <select
                value={formData.degreeLevel}
                onChange={e => setFormData({...formData, degreeLevel: e.target.value})}
                className="w-full border border-amber-200 rounded-lg p-3 bg-white focus:ring-2 focus:ring-amber-400 outline-none transition-all"
              >
                <option value="">Select degree level...</option>
                <option value="High School">High School</option>
                <option value="Bachelor">Bachelor</option>
                <option value="Master">Master</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Years of Study Completed</label>
              <input
                type="number" min="0" max="10" step="1"
                value={formData.yearsOfStudy}
                onChange={e => setFormData({...formData, yearsOfStudy: e.target.value})}
                className="w-full border border-amber-200 rounded-lg p-3 bg-white focus:ring-2 focus:ring-amber-400 outline-none transition-all"
                placeholder="e.g. 2"
              />
            </div>
          </div>
          {/* Eligibility Preview */}
          {(formData.gpa !== '' || formData.fieldOfStudy || formData.degreeLevel) && (
            <div className="mt-6 p-4 bg-white border border-amber-100 rounded-xl">
              <p className="text-xs font-black text-amber-700 uppercase tracking-widest mb-2">Scholarship Eligibility Preview</p>
              <div className="flex flex-wrap gap-2">
                {formData.gpa !== '' && <span className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-bold text-amber-800">GPA: {formData.gpa}</span>}
                {formData.fieldOfStudy && <span className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-bold text-amber-800">{formData.fieldOfStudy}</span>}
                {formData.degreeLevel && <span className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-bold text-amber-800">{formData.degreeLevel}</span>}
                {formData.yearsOfStudy !== '' && <span className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-bold text-amber-800">{formData.yearsOfStudy} yr{formData.yearsOfStudy != 1 ? 's' : ''} studied</span>}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 3: SKILLS */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex justify-between items-center">
            <span>3. Skills <span className="text-sm font-normal text-slate-500">(20%)</span></span>
            <button type="button" onClick={() => setFormData({...formData, skills: [...formData.skills, { name: '', level: 'Beginner', yearsExperience: '' }]})} className="text-sm px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg font-bold transition">
              + Add Skill
            </button>
          </h2>
          <div className="space-y-4">
            {formData.skills.map((sk, idx) => (
              <div key={idx} className="flex gap-4 items-end bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex-1">
                  <label className="block text-xs font-bold mb-1">Skill Name</label>
                  <input type="text" value={sk.name} onChange={e => { const newSkills = [...formData.skills]; newSkills[idx].name = e.target.value; setFormData({...formData, skills: newSkills}); }} className="w-full border-slate-200 rounded p-2 text-sm" placeholder="React.js" />
                </div>
                <div className="w-1/4">
                  <label className="block text-xs font-bold mb-1">Proficiency</label>
                  <select value={sk.level} onChange={e => { const newSkills = [...formData.skills]; newSkills[idx].level = e.target.value; setFormData({...formData, skills: newSkills}); }} className="w-full border-slate-200 rounded p-2 text-sm bg-white">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
                <div className="w-1/4">
                  <label className="block text-xs font-bold mb-1">Years Exp.</label>
                  <input type="number" value={sk.yearsExperience} onChange={e => { const newSkills = [...formData.skills]; newSkills[idx].yearsExperience = e.target.value; setFormData({...formData, skills: newSkills}); }} className="w-full border-slate-200 rounded p-2 text-sm" placeholder="2" />
                </div>
                <button type="button" onClick={() => setFormData({...formData, skills: formData.skills.filter((_, i) => i !== idx)})} className="text-rose-400 hover:text-rose-600 mb-2 ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                </button>
              </div>
            ))}
            {formData.skills.length === 0 && <p className="text-slate-400 italic text-sm">No skills added yet.</p>}
          </div>
        </div>

        {/* SECTION 4: EXPERIENCE */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex justify-between items-center">
            <span>4. Experience <span className="text-sm font-normal text-slate-500">(25%)</span></span>
            <button type="button" onClick={() => setFormData({...formData, experiences: [...formData.experiences, { title: '', company: '', startDate: '', endDate: '', isCurrent: false, description: '' }]})} className="text-sm px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg font-bold transition">
              + Add Experience
            </button>
          </h2>
          <div className="space-y-6">
            {formData.experiences.map((ex, idx) => (
              <div key={idx} className="p-6 border border-slate-200 rounded-xl relative bg-slate-50 hover:bg-white transition-colors">
                <button type="button" onClick={() => setFormData({...formData, experiences: formData.experiences.filter((_, i) => i !== idx)})} className="absolute top-4 right-4 text-slate-400 hover:text-rose-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-xs font-bold mb-1">Job Title</label><input type="text" value={ex.title} onChange={e => { const newEx = [...formData.experiences]; newEx[idx].title = e.target.value; setFormData({...formData, experiences: newEx}); }} className="w-full border-slate-200 rounded p-2 text-sm" placeholder="Software Engineer" /></div>
                  <div><label className="block text-xs font-bold mb-1">Company</label><input type="text" value={ex.company} onChange={e => { const newEx = [...formData.experiences]; newEx[idx].company = e.target.value; setFormData({...formData, experiences: newEx}); }} className="w-full border-slate-200 rounded p-2 text-sm" placeholder="Google" /></div>
                  <div><label className="block text-xs font-bold mb-1">Start Date</label><input type="date" value={ex.startDate ? ex.startDate.split('T')[0] : ''} onChange={e => { const newEx = [...formData.experiences]; newEx[idx].startDate = e.target.value; setFormData({...formData, experiences: newEx}); }} className="w-full border-slate-200 rounded p-2 text-sm" /></div>
                  <div className="flex gap-4">
                    <div className="flex-1"><label className="block text-xs font-bold mb-1">End Date</label><input type="date" disabled={ex.isCurrent} value={ex.endDate ? ex.endDate.split('T')[0] : ''} onChange={e => { const newEx = [...formData.experiences]; newEx[idx].endDate = e.target.value; setFormData({...formData, experiences: newEx}); }} className="w-full border-slate-200 rounded p-2 text-sm disabled:opacity-50" /></div>
                    <div className="pt-6"><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={ex.isCurrent} onChange={e => { const newEx = [...formData.experiences]; newEx[idx].isCurrent = e.target.checked; setFormData({...formData, experiences: newEx}); }} /> Present</label></div>
                  </div>
                  <div className="md:col-span-2"><label className="block text-xs font-bold mb-1">Description</label><textarea value={ex.description} onChange={e => { const newEx = [...formData.experiences]; newEx[idx].description = e.target.value; setFormData({...formData, experiences: newEx}); }} className="w-full border-slate-200 rounded p-2 text-sm h-24 resize-none" placeholder="Built scalable backend systems..." /></div>
                </div>
              </div>
            ))}
            {formData.experiences.length === 0 && <p className="text-slate-400 italic text-sm">No experience entries added yet.</p>}
          </div>
        </div>

        {/* SECTION 5: CAREER OBJECTIVE */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex justify-between">
            <span>5. Career Objective <span className="text-sm font-normal text-slate-500">(15%)</span></span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Target Job Title</label>
              <input type="text" value={formData.careerObjective.targetJobTitle} onChange={e => setFormData({...formData, careerObjective: {...formData.careerObjective, targetJobTitle: e.target.value}})} className="w-full border-slate-300 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-indigo-500" placeholder="Full-stack developer" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Preferred Work Type</label>
              <select value={formData.careerObjective.preferredWorkType} onChange={e => setFormData({...formData, careerObjective: {...formData.careerObjective, preferredWorkType: e.target.value}})} className="w-full border-slate-300 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-indigo-500">
                <option value="">Select Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Remote">Remote</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Desired Salary Range</label>
              <input type="text" value={formData.careerObjective.desiredSalary} onChange={e => setFormData({...formData, careerObjective: {...formData.careerObjective, desiredSalary: e.target.value}})} className="w-full border-slate-300 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-indigo-500" placeholder="$80,000 - $120,000" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Industries (comma separated)</label>
              <input type="text" value={formData.careerObjective.industries.join(', ')} onChange={e => setFormData({...formData, careerObjective: {...formData.careerObjective, industries: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)}})} className="w-full border-slate-300 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-indigo-500" placeholder="Tech, Finance, Healthcare" />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-black rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
            Save Complete Profile
          </button>
        </div>
      </form>
    </div>
  );
}
