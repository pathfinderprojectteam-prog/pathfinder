import { useState, useEffect, useRef } from 'react';
import { dataService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import { initSocket, getSocket } from '../services/socketService';

export default function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMsg, setSendingMsg] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState(new Set());
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    
    // Initialize socket connection
    const socket = initSocket(user._id);

    // Socket Event listeners
    socket.on('initial_online_users', (userIds) => {
      setOnlineUsers(new Set(userIds));
    });

    socket.on('user_status_change', ({ userId, status }) => {
      setOnlineUsers(prev => {
        const next = new Set(prev);
        if (status === 'online') next.add(userId);
        else next.delete(userId);
        return next;
      });
    });

    socket.on('receive_message', (newMsg) => {
      // If message belongs to active chat, append it and mark as read
      setActiveChat(currentActive => {
        if (currentActive && currentActive._id === newMsg.conversation) {
          setMessages(prev => [...prev, newMsg]);
          // Tell server I read it
          if (newMsg.sender._id !== user._id) {
            dataService.markConversationRead(newMsg.conversation).catch(console.error);
          }
        }
        return currentActive;
      });
      // Update conversations list latest message / unread count
      fetchConversations();
    });

    socket.on('messages_read', ({ conversationId, messageIds }) => {
      setActiveChat(currentActive => {
        if (currentActive && currentActive._id === conversationId) {
           setMessages(prev => prev.map(m => 
             messageIds.includes(m._id) ? { ...m, read: true } : m
           ));
        }
        return currentActive;
      });
    });

    socket.on('user_typing', ({ conversationId, userId, isTyping }) => {
      setActiveChat(currentActive => {
        if (currentActive && currentActive._id === conversationId) {
          setTypingUsers(prev => {
             const next = new Set(prev);
             if (isTyping) next.add(userId);
             else next.delete(userId);
             return next;
          });
        }
        return currentActive;
      });
    });

    return () => {
      // socket.off listeners to prevent dupes
      socket.off('initial_online_users');
      socket.off('user_status_change');
      socket.off('receive_message');
      socket.off('messages_read');
      socket.off('user_typing');
    };
  }, [user]);

  const fetchConversations = async () => {
    try {
      const res = await dataService.getConversations();
      setConversations(res.data || []);
    } catch (err) {
      console.error('Failed to load conversations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchConversations(); }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  const openChat = async (conversation) => {
    const socket = getSocket();
    if (activeChat) socket?.emit('leave_room', activeChat._id);
    
    setActiveChat(conversation);
    setMessages([]);
    setTypingUsers(new Set());
    
    socket?.emit('join_room', conversation._id);

    try {
      const res = await dataService.getMessages(conversation._id);
      setMessages(res.data || []);
      // Auto-mark as read
      await dataService.markConversationRead(conversation._id);
      fetchConversations(); // refresh unread count
    } catch (err) {
      console.error('Failed to load messages', err);
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    const socket = getSocket();
    if (!activeChat || !socket) return;
    
    socket.emit('typing_start', { conversationId: activeChat._id, userId: user._id });
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing_stop', { conversationId: activeChat._id, userId: user._id });
    }, 2000);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !activeChat) return;
    
    const socket = getSocket();
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socket?.emit('typing_stop', { conversationId: activeChat._id, userId: user._id });
    
    setSendingMsg(true);
    try {
      const res = await dataService.sendMessage(activeChat._id, message);
      setMessages(prev => [...prev, res.data]); // local echo
      setMessage('');
      fetchConversations();
    } catch (err) {
      console.error('Failed to send message', err);
    } finally {
      setSendingMsg(false);
    }
  };

  const currentOtherParticipant = activeChat ? (activeChat.participants || []).find(p => typeof p === 'object' && p._id !== user._id) : null;
  const isOtherOnline = currentOtherParticipant ? onlineUsers.has(currentOtherParticipant._id) : false;

  return (
    <div className="max-w-6xl mx-auto h-[75vh] flex gap-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      
      {/* Left Sidebar - Chat List */}
      <div className="w-1/3 flex flex-col border-r border-slate-100 pr-4">
        <h2 className="text-xl font-black text-slate-900 tracking-tight mb-4 px-2">Conversations</h2>
        
        <div className="flex-1 overflow-y-auto space-y-2">
          {loading ? (
            <div className="text-slate-400 font-bold text-sm animate-pulse px-2">Loading...</div>
          ) : conversations.length === 0 ? (
            <div className="text-slate-400 text-sm font-bold px-2">No conversations yet.</div>
          ) : conversations.map(chat => {
            const other = (chat.participants || []).find(p => typeof p === 'object' && p._id !== user._id);
            const displayName = other?.name || 'Unknown';
            const lastMsg = chat.lastMessage?.content || 'No messages yet';
            const isOnline = other ? onlineUsers.has(other._id) : false;
            // Rough unread calculation (if last msg is not from me and not read)
            const isUnread = chat.lastMessage && chat.lastMessage.sender !== user._id && !chat.lastMessage.read && activeChat?._id !== chat._id;

            return (
              <button
                key={chat._id}
                onClick={() => openChat(chat)}
                className={`w-full text-left p-4 rounded-2xl transition-all relative ${activeChat?._id === chat._id ? 'bg-indigo-600 shadow-md text-white' : 'hover:bg-slate-50 text-slate-900 border border-transparent hover:border-slate-100'}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                       <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs uppercase shrink-0 overflow-hidden">
                          {other?.avatar ? <img src={other.avatar} alt="avatar" /> : displayName.charAt(0)}
                       </div>
                       {isOnline && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>}
                    </div>
                    <span className="font-bold text-sm truncate">{displayName}</span>
                  </div>
                  {isUnread && <span className="w-2 h-2 rounded-full bg-rose-500"></span>}
                </div>
                <p className={`text-xs ml-10 truncate ${activeChat?._id === chat._id ? 'text-indigo-200' : (isUnread ? 'text-slate-800 font-bold' : 'text-slate-500')}`}>
                  {lastMsg}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right - Chat Interface */}
      <div className="w-2/3 flex flex-col bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden relative">
        {activeChat ? (
          <>
            <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center z-10 shadow-sm relative">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-black text-sm uppercase shrink-0">
                    {currentOtherParticipant?.name?.charAt(0) || '?'}
                 </div>
                 <div>
                    <h3 className="font-black text-slate-900">{currentOtherParticipant?.name || 'Chat'}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                       <span className={`w-1.5 h-1.5 rounded-full ${isOtherOnline ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                       <span className={`text-[10px] font-bold uppercase tracking-widest ${isOtherOnline ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {isOtherOnline ? 'Online' : 'Offline'}
                       </span>
                    </div>
                 </div>
              </div>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
              {messages.length === 0 ? (
                <div className="text-center text-xs text-slate-400 font-bold mt-auto mb-auto uppercase tracking-widest">Send a message to start</div>
              ) : messages.map((msg, i) => {
                const isMine = msg.sender?._id === user._id || msg.sender === user._id;
                return (
                  <div key={msg._id || i} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm shadow-sm ${isMine ? 'bg-indigo-600 rounded-tr-sm text-white' : 'bg-white border border-slate-200 rounded-tl-sm text-slate-700'}`}>
                      {msg.content}
                    </div>
                    {isMine && msg.read && (
                      <span className="text-[10px] font-bold text-indigo-400 mt-1 uppercase tracking-widest">Seen</span>
                    )}
                  </div>
                );
              })}
              
              {typingUsers.size > 0 && currentOtherParticipant && typingUsers.has(currentOtherParticipant._id) && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-sm shadow-sm flex gap-1">
                     <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                     <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                     <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={handleTyping}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 text-sm transition-colors"
                  disabled={sendingMsg}
                />
                <button
                  type="submit"
                  disabled={sendingMsg || !message.trim()}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl shadow-md font-bold transition-colors"
                >
                  {sendingMsg ? '...' : 'Send'}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 opacity-50">
            <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="font-bold text-lg">Select a conversation to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
}
