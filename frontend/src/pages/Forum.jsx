import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, ThumbsUp, Send, Tag, PlusCircle } from 'lucide-react';
import axios from 'axios';

export default function Forum() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePost, setActivePost] = useState(null);
  
  const [newPostMode, setNewPostMode] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');

  const [commentContent, setCommentContent] = useState('');

  const fetchPosts = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/forum/posts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/forum/posts', {
        title: newTitle, content: newContent, tags: newTags
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewPostMode(false);
      setNewTitle(''); setNewContent(''); setNewTags('');
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpvote = async (e, postId) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/forum/posts/${postId}/upvote`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (activePost && activePost.id === postId) {
        setActivePost(prev => ({...prev, upvotes: prev.upvotes + 1}));
      }
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/forum/posts/${activePost.id}/comments`, {
        content: commentContent
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActivePost(prev => ({
        ...prev,
        comments: [...prev.comments, res.data]
      }));
      setCommentContent('');
      fetchPosts(); // to update comment count in list
    } catch (err) {
      console.error(err);
    }
  };

  const openPost = async (postId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/forum/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActivePost(res.data);
      setNewPostMode(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-background text-primary font-sans flex flex-col relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

      <header className="border-b border-border p-6 flex items-center justify-between relative z-10 bg-background/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 bg-surface border border-border hover:bg-surface-elevated rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Community Forum</h1>
            <p className="text-sm text-secondary">Ask questions, share experiences, help others</p>
          </div>
        </div>
        <button 
          onClick={() => {setNewPostMode(true); setActivePost(null);}}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold flex items-center gap-2 transition-colors"
        >
          <PlusCircle className="w-5 h-5" /> New Post
        </button>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-6 md:p-10 flex flex-col lg:flex-row gap-8 relative z-10">
        {/* Posts List */}
        <div className={`flex-1 flex flex-col gap-4 ${activePost || newPostMode ? 'hidden lg:flex' : 'flex'}`}>
          {loading ? (
            <div className="text-muted animate-pulse">Loading discussions...</div>
          ) : (
            posts.map(post => (
              <div 
                key={post.id}
                onClick={() => openPost(post.id)}
                className={`bg-surface border rounded-2xl p-6 cursor-pointer transition-all hover:bg-surface-elevated/80 ${activePost?.id === post.id ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'border-border hover:border-border-strong'}`}
              >
                <div className="flex gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <button onClick={(e) => handleUpvote(e, post.id)} className="p-2 bg-surface-elevated hover:bg-indigo-500/20 hover:text-indigo-400 rounded-lg transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-sm">{post.upvotes}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                    <p className="text-secondary text-sm line-clamp-2 mb-4">{post.content}</p>
                    <div className="flex items-center justify-between text-xs text-muted">
                      <div className="flex gap-2">
                        {post.tags?.split(',').map((tag, i) => (
                          <span key={i} className="px-2 py-1 bg-surface-elevated rounded-md text-indigo-300">{tag.trim()}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4">
                        <span>By {post.authorName}</span>
                        <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {post.comments ? post.comments.length : 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Pane: Post Viewer or Creator */}
        <div className="flex-[1.5] flex flex-col">
          {newPostMode && (
            <div className="bg-surface border border-border rounded-3xl p-8 animate-fade-in">
              <h2 className="text-2xl font-bold mb-6">Create a New Discussion</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-secondary mb-1">Title</label>
                  <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-indigo-500" placeholder="What's on your mind?" />
                </div>
                <div>
                  <label className="block text-sm text-secondary mb-1">Tags (Comma separated)</label>
                  <input type="text" value={newTags} onChange={e => setNewTags(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-indigo-500" placeholder="e.g. Aptitude, HR, TCS, Resume" />
                </div>
                <div>
                  <label className="block text-sm text-secondary mb-1">Content</label>
                  <textarea value={newContent} onChange={e => setNewContent(e.target.value)} className="w-full h-40 bg-background border border-border rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-indigo-500 resize-none" placeholder="Provide more details..."></textarea>
                </div>
                <div className="flex justify-end gap-4 mt-4">
                  <button onClick={() => setNewPostMode(false)} className="px-6 py-3 bg-surface-elevated hover:bg-neutral-700 rounded-xl font-bold">Cancel</button>
                  <button onClick={handleCreatePost} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold">Post Discussion</button>
                </div>
              </div>
            </div>
          )}

          {activePost && !newPostMode && (
            <div className="bg-surface border border-border rounded-3xl p-8 flex flex-col h-full animate-fade-in">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-fuchsia-500 rounded-full flex items-center justify-center font-bold text-lg">
                  {activePost.authorName.charAt(0)}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold leading-tight mb-2">{activePost.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-secondary">
                    <span className="font-medium text-indigo-300">{activePost.authorName}</span>
                    <span>{new Date(activePost.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-primary-muted leading-relaxed mb-6 whitespace-pre-wrap">
                {activePost.content}
              </div>
              
              <div className="flex gap-2 mb-8 pb-8 border-b border-border">
                {activePost.tags?.split(',').map((tag, i) => (
                  <span key={i} className="px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-bold text-secondary flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {tag.trim()}
                  </span>
                ))}
              </div>

              {/* Comments Section */}
              <div className="flex-1 overflow-y-auto mb-6 pr-2 space-y-6 custom-scrollbar">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" /> Responses ({activePost.comments?.length || 0})
                </h3>
                {activePost.comments?.length === 0 ? (
                  <p className="text-muted text-center py-4">No responses yet. Be the first to reply!</p>
                ) : (
                  activePost.comments?.map(comment => (
                    <div key={comment.id} className="bg-background border border-border rounded-2xl p-5">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-sm text-indigo-300">{comment.authorName}</span>
                        <span className="text-xs text-muted">{new Date(comment.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-primary-muted text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment */}
              <div className="flex gap-4 mt-auto">
                <textarea 
                  value={commentContent}
                  onChange={e => setCommentContent(e.target.value)}
                  className="flex-1 bg-background border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-indigo-500 resize-none h-14 custom-scrollbar"
                  placeholder="Write a response..."
                ></textarea>
                <button 
                  onClick={handleAddComment}
                  disabled={!commentContent.trim()}
                  className="px-6 bg-indigo-600 hover:bg-indigo-500 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {!activePost && !newPostMode && (
            <div className="hidden lg:flex flex-col items-center justify-center h-full text-muted border border-border border-dashed rounded-3xl bg-surface/30">
              <MessageSquare className="w-16 h-16 mb-4 text-neutral-700" />
              <p className="text-lg">Select a discussion to view details</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
