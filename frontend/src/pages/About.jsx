import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function About() {
  return (
    <div className="bg-white min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      <Navbar />

      {/* Hero Section */}
      <header className="pt-16 pb-12 md:pt-24 md:pb-20 border-b border-slate-50 bg-slate-50/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">
            About <span className="text-indigo-600">PathFinder</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
            We are redefining the intersection of education and employment through the power of artificial intelligence.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-20 space-y-24">
        
        {/* What is PathFinder */}
        <section>
          <h2 className="text-3xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-base">?</span>
            What is PathFinder?
          </h2>
          <div className="text-slate-600 space-y-4 text-lg leading-relaxed">
            <p>
              PathFinder is an intelligent career ecosystem designed to align human potential with market demand. 
              Launched as a solution to the increasing complexity of the modern job market, we serve as a 
              navigational layer for students, freelancers, and institutions.
            </p>
            <p>
              By centralizing jobs, freelance missions, and scholarships into a single, AI-curated feed, we eliminate 
              the noise and focus on what truly matters: your growth and matching accuracy.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="bg-indigo-600 rounded-[40px] p-8 md:p-12 text-white shadow-2xl shadow-indigo-200">
          <h2 className="text-3xl font-black mb-6">Our Mission</h2>
          <p className="text-indigo-100 text-xl leading-relaxed font-medium italic">
            "To democratize career guidance and professional opportunity by providing every student with 
            an AI-powered Personal Career Strategist."
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
              <span className="font-black block mb-1">Empowerment</span>
              Giving users the tools to own their professional narrative.
            </div>
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
              <span className="font-black block mb-1">Accessibility</span>
              Breaking down barriers between learning and earning.
            </div>
          </div>
        </section>

        {/* AI Role */}
        <section>
          <h2 className="text-3xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            The Role of AI in PathFinder
          </h2>
          <div className="text-slate-600 space-y-6 text-lg leading-relaxed">
            <p>
              Unlike traditional job boards, PathFinder doesn't just store data; it understands it. Our 
              proprietary **Matching Matrix** analyzes over 50 data points per profile to ensure harmony 
              between user skills and employer requirements.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
              <div className="border-l-4 border-indigo-600 pl-6">
                <h4 className="font-black text-slate-900 mb-2">Quantifiable Matching</h4>
                <p className="text-sm">We provide an instant "Fit Score" so you know exactly why an opportunity is recommended for you.</p>
              </div>
              <div className="border-l-4 border-indigo-600 pl-6">
                <h4 className="font-black text-slate-900 mb-2">Predictive Pathways</h4>
                <p className="text-sm">Our Career Path Generator project future roles based on current industry trends and your trajectory.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits for Students */}
        <section className="pb-12">
          <h2 className="text-3xl font-black text-slate-900 mb-8 items-center gap-3 flex">
            Benefits for Students
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Automated, ATS-friendly CV generation in one click.",
              "Discovery of niche scholarships and freelance missions.",
              "Real-time status tracking for every application.",
              "Skill gap analysis and actionable learning paths."
            ].map((benefit, index) => (
              <div key={index} className="flex gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-slate-700 font-bold text-sm leading-snug">{benefit}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* CTA section */}
      <section className="bg-slate-900 py-16 text-center">
        <h3 className="text-2xl md:text-3xl font-black text-white mb-8">Ready to define your trajectory?</h3>
        <Link to="/register" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-lg font-black hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
          Join PathFinder Now
        </Link>
      </section>

      {/* Simple Footer */}
      <footer className="py-8 border-t border-slate-100 text-center text-slate-400 text-xs font-bold uppercase tracking-widest leading-none">
        © 2026 PathFinder Inc. All rights reserved.
      </footer>

    </div>
  );
}
