import { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';

export default function Network() {
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({ followers: 0, following: 0 });
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [followingIds, setFollowingIds] = useState(new Set());

  const fetchAll = async () => {
    try {
      const [feedRes, statsRes, followingRes] = await Promise.all([
        dataService.getNetworkFeed(),
        dataService.getNetworkStats(),
        dataService.getFollowing(),
      ]);
      setPosts(feedRes.data || []);
      setStats(statsRes.data || { followers: 0, following: 0 });
      const ids = new Set((followingRes.data || []).map(u => u._id));
      setFollowingIds(ids);
    } catch (err) {
      console.error('Network feed error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    setPosting(true);
    try {
      const res = await dataService.createPost(newPost);
      setPosts(prev => [res.data, ...prev]);
      setNewPost('');
    } catch (err) {
      console.error('Post create error:', err);
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await dataService.likePost(postId);
      setPosts(prev => prev.map(p =>
        p._id === postId ? { ...p, likes: Array(res.data.likes).fill(null), _liked: res.data.liked } : p
      ));
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const handleFollow = async (userId) => {
    try {
      if (followingIds.has(userId)) {
        await dataService.unfollowUser(userId);
        setFollowingIds(prev => { const n = new Set(prev); n.delete(userId); return n; });
      } else {
        await dataService.followUser(userId);
        setFollowingIds(prev => new Set([...prev, userId]));
      }
    } catch (err) {
      console.error('Follow error:', err);
    }
  };

  if (loading) return <div className="p-8 font-bold text-slate-400 animate-pulse">Loading your network feed...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Professional Network</h1>
        <p className="text-slate-500 mt-1 font-medium">Connect with universities, companies, and top talent globally.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Main Feed */}
        <div className="flex-1 w-full space-y-6">
          {/* Create Post */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
            <form onSubmit={handlePost}>
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share an update, milestone, or ask for advice..."
                className="w-full min-h-[90px] border border-slate-200 rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
              />
              <div className="flex justify-end mt-3">
                <button
                  type="submit"
                  disabled={posting || !newPost.trim()}
                  className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-xl shadow-md hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
                >
                  {posting ? 'Publishing...' : 'Publish'}
                </button>
              </div>
            </form>
          </div>

          {/* Posts Feed */}
          {posts.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-white">
              <p className="text-slate-400 font-bold text-lg mb-2">Your feed is empty</p>
              <p className="text-slate-500 text-sm">Follow users to see their updates here, or create your first post above.</p>
            </div>
          ) : posts.map(post => (
            <div key={post._id} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-black shadow-sm shrink-0">
                    {post.author?.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-tight">{post.author?.name || 'Unknown'}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">{post.author?.role}</span>
                      <span className="text-xs text-slate-400 font-medium">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                {post.author?._id !== undefined && (
                  <button
                    onClick={() => handleFollow(post.author._id)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${
                      followingIds.has(post.author._id)
                        ? 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'
                        : 'text-indigo-600 border-indigo-100 hover:bg-indigo-50'
                    }`}
                  >
                    {followingIds.has(post.author._id) ? 'Unfollow' : '+ Follow'}
                  </button>
                )}
              </div>

              <p className="text-slate-700 text-sm leading-relaxed mb-4">{post.content}</p>

              {post.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">#{tag}</span>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center gap-6">
                <button
                  onClick={() => handleLike(post._id)}
                  className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  <span className="text-sm font-bold">{post.likes?.length || 0}</span>
                </button>
                <div className="flex items-center gap-2 text-slate-500">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="text-sm font-bold">{post.comments?.length || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-4">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <h3 className="font-black text-slate-900 mb-4 text-sm">Your Network</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-black text-slate-900">{stats.followers}</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">Followers</p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">{stats.following}</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">Following</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <h3 className="font-black text-slate-900 mb-3 text-sm uppercase tracking-widest">Trending Tags</h3>
            <div className="flex flex-wrap gap-2">
              {['#FrontendDev', '#PathFinder', '#Scholarship2026', '#ReactJS', '#AI'].map(tag => (
                <span key={tag} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100 hover:bg-indigo-100 cursor-pointer transition-colors">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
