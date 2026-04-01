import { useEffect, useState } from 'react';
import { dataService } from '../services/dataService';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = () => {
      dataService.getNotifications()
        .then(res => setNotifications(res.data.data || res.data || []))
        .catch(err => console.error("Error loading notifications:", err))
        .finally(() => setLoading(false));
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await dataService.markNotificationAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="p-8 text-slate-500 font-medium animate-pulse">Syncing network alert systems...</div>;

  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex items-end justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Alerts</h1>
          <p className="text-slate-500 mt-1">Review real-time application updates and network pings.</p>
        </div>
        <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full border border-slate-200">
          Polling Active
        </span>
      </div>
      
      <div className="flex flex-col gap-4">
        {notifications.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="text-slate-400 font-bold block mb-1">Silence</span>
            <span className="text-slate-500 text-sm">No new alert events detected in the matrix.</span>
          </div>
        ) : notifications.map(notif => (
          <div key={notif._id} className={`p-6 border rounded-xl flex justify-between items-center transition-all ${notif.isRead ? 'bg-white border-slate-200 opacity-60' : 'bg-indigo-50/50 border-indigo-200 shadow-sm relative overflow-hidden'}`}>
            
            {!notif.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-xl"></div>}
            
            <div className={`pl-${!notif.isRead ? '2' : '0'}`}>
              <div className="flex items-center gap-3 mb-1">
                {!notif.isRead && <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                </span>}
                <p className={`font-medium ${!notif.isRead ? 'text-indigo-900 font-bold' : 'text-slate-700'}`}>{notif.message}</p>
              </div>
              <p className="text-xs text-slate-500 font-medium ml-${!notif.isRead ? '5' : '0'} flex items-center gap-1 mt-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {new Date(notif.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            
            {!notif.isRead && (
              <button 
                onClick={() => handleMarkAsRead(notif._id)}
                className="text-xs font-bold text-indigo-700 px-4 py-2 bg-white border border-indigo-200 rounded-lg shadow-sm hover:bg-indigo-50 hover:shadow transition-all whitespace-nowrap ml-4 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Clear Alert
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
