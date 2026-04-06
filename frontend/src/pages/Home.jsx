import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div className="bg-white min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      <Navbar />

      {/* Hero Section */}
      <header className="relative overflow-hidden pt-16 pb-24 md:pt-32 md:pb-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-8 animate-in fade-in slide-in-from-bottom-3 duration-700">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">AI-Powered Career Evolution</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6 max-w-4xl mx-auto">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Future Path</span> with Intelligence
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            PathFinder leverages advanced AI scoring to bridge the gap between your skills and global opportunities. Generate resumes, map career paths, and find jobs that actually fit.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl text-lg font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 active:scale-95">
              Get Started for Free
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl text-lg font-bold hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-95 shadow-sm">
              Sign In to Dashboard
            </Link>
          </div>

          {/* Decorative Gradients */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-gradient-to-r from-indigo-100/50 to-purple-100/50 blur-3xl opacity-50 -z-10 rounded-full"></div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Engineered for <span className="text-indigo-600">Fast-Track</span> Success
          </h2>
          <p className="text-slate-500 font-medium">Three core pillars that redefine the job-hunting experience.</p>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-10 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">AI Recommendations</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Our neural engine calculates a precise "Fit Score" for every opening, mapping your unique skillset to high-probability matches.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-10 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">CV Generator</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Transform your profile data into a high-converting, ATS-friendly resume in seconds. Stop formatting, start applying.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-10 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">Job Opportunities</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Access a curated marketplace of Jobs, Freelance missions, and Scholarships from verified global institutions.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8">
              The Blueprint for <span className="text-indigo-600">Your Journey</span>
            </h2>
            
            <div className="flex flex-col gap-8">
              {/* Step 1 */}
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-black flex items-center justify-center shrink-0 shadow-lg">1</div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-1">Create Your Profile</h4>
                  <p className="text-slate-500 text-sm font-medium">Detailed bio, skills, and history form your digital career foundation.</p>
                </div>
              </div>
              {/* Step 2 */}
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-black flex items-center justify-center shrink-0 shadow-lg shadow-indigo-200">2</div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-1">Get AI Recommendations</h4>
                  <p className="text-slate-500 text-sm font-medium">Our engine parses your data to suggest paths you never even considered.</p>
                </div>
              </div>
              {/* Step 3 */}
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-black flex items-center justify-center shrink-0 shadow-lg shadow-indigo-200 opacity-80">3</div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-1">Apply & Conquer</h4>
                  <p className="text-slate-500 text-sm font-medium">Finalize your applications and track status in real-time from the hub.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full flex items-center justify-center">
             <div className="w-full h-[400px] rounded-3xl bg-slate-100 border border-slate-200 relative overflow-hidden group">
               {/* Mock UI Element */}
               <div className="absolute top-10 left-10 right-10 bottom-10 bg-white rounded-2xl shadow-2xl border border-indigo-50 p-6">
                  <div className="w-20 h-4 bg-slate-100 rounded mb-4"></div>
                  <div className="w-full h-8 bg-slate-50 rounded mb-8"></div>
                  <div className="space-y-4">
                     <div className="w-full h-12 bg-indigo-600 rounded-xl flex items-center px-4">
                        <div className="w-32 h-2 bg-white/20 rounded"></div>
                     </div>
                     <div className="w-full h-12 bg-slate-50 rounded-xl border border-slate-200"></div>
                  </div>
               </div>
               <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-indigo-600 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
        <div className="w-full p-12 md:p-24 bg-slate-900 rounded-[40px] text-center relative overflow-hidden shadow-2xl shadow-slate-200">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
               Start your journey <span className="text-indigo-400">today</span>
            </h2>
            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
              Join thousands of students and companies leveraging AI to redefine the labor market.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl text-xl font-extrabold hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
                 Join PathFinder
              </Link>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600 rounded-full blur-[100px] opacity-20 translate-y-1/2 -translate-x-1/2"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-2">
            <span className="text-xl font-black text-slate-900 tracking-tight">
              Path<span className="text-indigo-600">Finder</span>
            </span>
          </div>
          <div className="flex items-center gap-8">
            <Link to="/about" className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">
              About Us
            </Link>
            <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              © 2026 PathFinder Inc. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
