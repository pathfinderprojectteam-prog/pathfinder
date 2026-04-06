import React from 'react';
import { dataService } from '../services/dataService';

export default function OpportunityCard({ opportunity, type }) {
  const handleApply = async () => {
    try {
      if (type === 'job') {
        await dataService.applyToJob(opportunity._id);
      } else if (type === 'freelance') {
        await dataService.applyToFreelance(opportunity._id);
      } else if (type === 'scholarship') {
        await dataService.applyToScholarship(opportunity._id);
      } else {
        throw new Error("Unknown opportunity type.");
      }
      alert("Application submitted successfully! Track it in the Applications tab.");
    } catch (err) {
      alert("Error applying. You might have already applied or missing critical profile items.");
      console.error(err);
    }
  };

  return (
    <div className="group bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
      
      {/* Decorative Gradient Line */}
      <div className={`absolute top-0 left-0 w-full h-1 ${type === 'job' ? 'bg-indigo-500' : type === 'freelance' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
      
      <div className="flex justify-between items-start mb-4 mt-2">
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{opportunity.title}</h3>
        <span className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded-md ${
          type === 'job' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 
          type === 'freelance' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 
          'bg-amber-50 text-amber-700 border border-amber-100'
        }`}>
          {type}
        </span>
      </div>
      
      {opportunity.description && (
        <p className="text-sm text-slate-600 mb-6 leading-relaxed line-clamp-3">
          {opportunity.description}
        </p>
      )}
      
      <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-500 mb-6 bg-slate-50 p-3 rounded-lg border border-slate-100">
        {opportunity.requiredExperience && (
           <div className="flex items-center gap-1">
             <span className="font-bold text-slate-700">Exp:</span> {opportunity.requiredExperience} yrs
           </div>
        )}
        {opportunity.difficulty && (
           <div className="flex items-center gap-1 ml-4 border-l pl-4 border-slate-300">
             <span className="font-bold text-slate-700">Level:</span> {opportunity.difficulty}
           </div>
        )}
        {opportunity.academicLevelRequired && (
           <div className="flex items-center gap-1 border-l pl-4 border-slate-300">
             <span className="font-bold text-slate-700">Target:</span> {opportunity.academicLevelRequired}
           </div>
        )}
      </div>

      <button 
        onClick={handleApply}
        className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-indigo-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center gap-2"
      >
        <span>Quick Apply</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}
