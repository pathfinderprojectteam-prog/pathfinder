import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';

// ─── Path label map ───────────────────────────────────────────────────────────
const PATH_LABELS = {
  employment:      { label: 'Employment',      desc: 'Focus on finding corporate jobs.',         color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  freelance:       { label: 'Freelance',        desc: 'Pursue independent project contracts.',   color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  studies:         { label: 'Further Studies',  desc: 'Continue with academic qualifications.',  color: 'bg-amber-100 text-amber-800 border-amber-200' },
  hybrid:          { label: 'Hybrid Path',      desc: 'Balance work and studies simultaneously.', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  complete_profile:{ label: 'Complete Profile', desc: 'Add more data to unlock AI career suggestions.', color: 'bg-rose-100 text-rose-800 border-rose-200' },
};

// ─── Profile Completion Widget ────────────────────────────────────────────────
function ProfileCompletionCard({ completion }) {
  const pct = Math.min(Math.max(completion ?? 0, 0), 100);
  const color = pct >= 80 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-rose-500';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-slate-900">Profile Completion</h2>
        <span className="text-2xl font-black text-slate-800">{pct}%</span>
      </div>
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-slate-500 mt-2">
        {pct < 100
          ? 'Complete your profile to improve AI match accuracy.'
          : 'Your profile is fully optimised.'}
      </p>
    </div>
  );
}

// ─── Career Path Widget ───────────────────────────────────────────────────────
function CareerPathCard({ path }) {
  const meta = PATH_LABELS[path] ?? PATH_LABELS['complete_profile'];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-base font-bold text-slate-900 mb-3">AI Career Suggestion</h2>
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border font-bold text-sm ${meta.color}`}>
        {meta.label}
      </div>
      <p className="text-sm text-slate-500 mt-3 leading-relaxed">{meta.desc}</p>
      <Link to="/career-path" className="inline-block mt-3 text-xs font-bold text-indigo-600 hover:underline">
        View full trajectory →
      </Link>
    </div>
  );
}

// ─── Recommended Jobs Widget ──────────────────────────────────────────────────
function RecommendedJobsCard({ jobs }) {
  if (jobs.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-3">Top Job Matches</h2>
        <p className="text-sm text-slate-400">No matches yet. Complete your profile to unlock AI recommendations.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-slate-900">Top Job Matches</h2>
        <Link to="/recommendations" className="text-xs font-bold text-indigo-600 hover:underline">View all →</Link>
      </div>
      <div className="flex flex-col gap-3">
        {jobs.slice(0, 3).map((job, idx) => (
          <div key={job._id ?? idx} className="border border-slate-100 rounded-lg p-4 bg-slate-50 relative">
            {/* Match score badge */}
            {job.matchScore != null && (
              <span className="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-black px-2 py-0.5 rounded-md">
                {job.matchScore}%
              </span>
            )}
            <h3 className="font-bold text-slate-900 text-sm pr-14">{job.title}</h3>
            {job.matchReason && (
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{job.matchReason}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Notifications Preview Widget ─────────────────────────────────────────────
function NotificationsCard({ notifications }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-slate-900">Recent Notifications</h2>
        <Link to="/notifications" className="text-xs font-bold text-indigo-600 hover:underline">View all →</Link>
      </div>
      {notifications.length === 0 ? (
        <p className="text-sm text-slate-400">No new notifications.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {notifications.slice(0, 3).map((n, idx) => (
            <li
              key={n._id ?? idx}
              className={`flex items-start gap-3 p-3 rounded-lg border text-sm ${
                n.isRead ? 'bg-white border-slate-100 text-slate-500' : 'bg-indigo-50 border-indigo-100 text-slate-800 font-medium'
              }`}
            >
              <span className={`mt-1 shrink-0 w-2 h-2 rounded-full ${n.isRead ? 'bg-slate-300' : 'bg-indigo-500'}`} />
              <span className="leading-snug">{n.message}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Generate CV Quick Action ─────────────────────────────────────────────────
function GenerateCVButton() {
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'

  const handleGenerate = async () => {
    setStatus('loading');
    try {
      await dataService.generateCV();
      setStatus('success');
    } catch {
      setStatus('error');
    }
    setTimeout(() => setStatus(null), 4000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center justify-between gap-4">
      <div>
        <h2 className="text-base font-bold text-slate-900">Quick Action</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Let the AI assemble your profile data into a full CV export.
        </p>
        {status === 'success' && (
          <p className="text-xs text-emerald-600 font-bold mt-1">✓ CV generated. <Link to="/cv" className="underline">View it →</Link></p>
        )}
        {status === 'error' && (
          <p className="text-xs text-rose-600 font-bold mt-1">Failed. Ensure your profile has data.</p>
        )}
      </div>
      <button
        onClick={handleGenerate}
        disabled={status === 'loading'}
        className="shrink-0 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-sm rounded-lg transition-colors shadow-sm"
      >
        {status === 'loading' ? 'Generating...' : 'Generate CV'}
      </button>
    </div>
  );
}

// ─── Main StudentDashboard ────────────────────────────────────────────────────
export default function StudentDashboard() {
  const { user } = useAuth();

  const [completion, setCompletion] = useState(null);
  const [careerPath, setCareerPath] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dataService.getProfile().catch(() => ({ data: null })),
      dataService.getCareerPath().catch(() => ({ data: null })),
      dataService.getRecommendedJobs().catch(() => ({ data: [] })),
      dataService.getNotifications().catch(() => ({ data: [] })),
    ]).then(([profileRes, pathRes, jobsRes, notifRes]) => {
      // profileCompletion is on the user model (student discriminator)
      setCompletion(profileRes.data?.profileCompletion ?? 0);
      setCareerPath(pathRes.data?.careerPath ?? 'complete_profile');
      setJobs(Array.isArray(jobsRes.data) ? jobsRes.data : []);
      const notifData = notifRes.data;
      setNotifications(Array.isArray(notifData) ? notifData : (notifData?.data ?? []));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-slate-500 animate-pulse font-medium">Loading your dashboard...</div>;
  }

  return (
    <div className="max-w-5xl flex flex-col gap-6">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Welcome back, {user?.name?.split(' ')[0] ?? 'Student'}.
        </h1>
        <p className="text-slate-500 mt-1">Here is your PathFinder overview for today.</p>
      </div>

      {/* Row 1: Profile Completion + Career Path */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileCompletionCard completion={completion} />
        <CareerPathCard path={careerPath} />
      </div>

      {/* Row 2: Recommended Jobs (full width) */}
      <RecommendedJobsCard jobs={jobs} />

      {/* Row 3: Notifications + Generate CV */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NotificationsCard notifications={notifications} />
        <GenerateCVButton />
      </div>
    </div>
  );
}
