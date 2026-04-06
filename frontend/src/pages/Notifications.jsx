import { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await dataService.getNotifications();
      let notifs = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setNotifications(notifs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markAllRead = async () => {
    try {
      await dataService.markNotificationsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 font-bold text-slate-400 animate-pulse">Loading notifications...</div>;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Inbox</h1>
          <p className="text-slate-500 mt-1 font-medium">You have {unreadCount} unread system logs.</p>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={markAllRead}
            className="px-4 py-2 border border-slate-200 text-slate-600 bg-white rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors"
          >
            Mark All Read
          </button>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
         {notifications.length === 0 ? (
            <div className="p-16 text-center text-slate-500 font-bold">No notifications to display.</div>
         ) : (
            <ul className="divide-y divide-slate-100">
               {notifications.map(n => (
                 <li key={n._id} className={`p-6 flex gap-4 transition-colors hover:bg-slate-50 ${n.read ? 'bg-white' : 'bg-indigo-50/30'}`}>
                    <div className="shrink-0 mt-1">
                       {n.read ? (
                          <div className="w-3 h-3 rounded-full bg-slate-300 border border-slate-400"></div>
                       ) : (
                          <div className="w-3 h-3 rounded-full bg-indigo-600 shadow shadow-indigo-300 animate-pulse"></div>
                       )}
                    </div>
                    <div>
                       <span className={`text-sm block ${n.read ? 'text-slate-600 font-medium' : 'text-indigo-950 font-bold'}`}>
                         {n.message}
                       </span>
                       <span className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-widest block">
                         {new Date(n.createdAt).toLocaleString()}
                       </span>
                    </div>
                 </li>
               ))}
            </ul>
         )}
      </div>
    </div>
  );
}
