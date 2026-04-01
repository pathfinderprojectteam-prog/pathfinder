import { useEffect, useState, useRef } from 'react';
import { dataService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';

export default function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  
  const activeConversationRef = useRef(activeConversation);
  useEffect(() => { activeConversationRef.current = activeConversation; }, [activeConversation]);

  useEffect(() => {
    dataService.getConversations()
      .then(res => setConversations(res.data || []))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const fetchMessages = () => {
      const currentActive = activeConversationRef.current;
      if (!currentActive) return;
      dataService.getMessages(currentActive._id)
        .then(res => setMessages(res.data || []))
        .catch(err => console.error(err));
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [activeConversation]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim() || !activeConversation) return;
    try {
      const res = await dataService.sendMessage(activeConversation._id, content);
      setMessages(prev => [...prev, res.data]);
      setContent('');
    } catch (err) { console.error(err); }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Comms Hub</h1>
        <p className="text-slate-500 mt-1">Real-time secure messaging with path nodes.</p>
      </div>
      
      <div className="flex-1 flex gap-0 border-slate-200 border rounded-2xl shadow-sm bg-white overflow-hidden min-h-[500px]">
        {/* Left Pane: Conversations */}
        <div className="w-1/3 border-r border-slate-200 bg-slate-50 flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-white shadow-sm flex-none">
            <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider">Active Threads</h2>
          </div>
          <div className="overflow-y-auto flex-1">
            {conversations.length === 0 ? <p className="p-6 text-sm text-slate-500 text-center">No active connections.</p> : conversations.map(conv => {
              const isActive = activeConversation?._id === conv._id;
              return (
                <div 
                  key={conv._id} 
                  className={`p-5 border-b border-slate-200 cursor-pointer transition-colors flex items-center gap-3 relative ${isActive ? 'bg-white' : 'hover:bg-slate-100 hover:border-l-4 hover:border-l-indigo-300'}`}
                  onClick={() => setActiveConversation(conv)}
                >
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600"></div>}
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                    ID
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900 line-clamp-1">
                      Thread #{conv._id.substring(0,6).toUpperCase()}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">Secure End-to-End Chat...</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Messages */}
        <div className="w-2/3 flex flex-col bg-slate-50/50 relative">
          {!activeConversation ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
               </svg>
               <span className="font-medium text-lg">Select a conversation</span>
               <span className="text-sm">Initiate encryption tunnel handshake to begin.</span>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="h-16 px-6 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 shadow-sm z-10">
                <div className="font-bold text-slate-900">Thread #{activeConversation._id.substring(0,8).toUpperCase()}</div>
                <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               Encrypted Live
                </div>
              </div>
              
              {/* Chat Feed */}
              <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 relative">
                {messages.length === 0 ? <p className="text-center text-slate-400 mt-10">Thread established. Encrypted channel opened.</p> : messages.map(msg => {
                  const isMine = msg.sender?._id === user?._id || msg.sender === user?._id;
                  return (
                    <div key={msg._id} className={`max-w-[80%] p-4 rounded-2xl shadow-sm text-sm font-medium leading-relaxed ${isMine ? 'bg-indigo-600 text-white self-end rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 self-start rounded-bl-none'}`}>
                      {msg.content}
                    </div>
                  );
                })}
              </div>

              {/* Input Engine */}
              <div className="p-4 bg-white border-t border-slate-200 shrink-0">
                <form onSubmit={handleSend} className="flex gap-3">
                  <input 
                    type="text" 
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="Encode message payload..." 
                    className="flex-1 border border-slate-300 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 transition-shadow shadow-sm"
                  />
                  <button type="submit" disabled={!content.trim()} className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-md hover:shadow-lg flex items-center gap-2">
                    Send
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
