import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, BookOpen, Clock, ShieldAlert, Bell, Settings, Target, CheckCircle, Database, Search, Edit2, Trash2, Check, X, FileText, Activity } from 'lucide-react';

export const GlobalToast = ({ message, type = 'success' }) => {
  if (!message) return null;
  return (
    <div className="fixed bottom-8 right-8 bg-[#1a1a1a] border border-emerald-500/50 text-white px-6 py-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-center gap-4 z-[100] animate-fade-in pointer-events-none">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
            <CheckCircle className="w-5 h-5" />
        </div>
        <div>
            <h4 className="font-bold text-sm">{type === 'success' ? 'Action Successful' : 'Action Completed'}</h4>
            <p className="text-xs text-neutral-400">{message}</p>
        </div>
    </div>
  );
};

export const DashboardAnalytics = ({ analytics }) => {
    return (
        <div className="relative z-10 animate-fade-in max-w-6xl mx-auto">
            <header className="mb-10">
                <h2 className="text-4xl font-bold tracking-tight mb-2">Platform Overview</h2>
                <p className="text-muted text-lg">Real-time metrics for SmartThink Enterprise.</p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">
                    <p className="text-sm text-muted font-bold tracking-wider uppercase mb-2">Total Users</p>
                    <div className="text-4xl font-black text-primary">{analytics?.totalUsers || '4,281'}</div>
                    <p className="text-xs text-emerald-400 mt-2 font-medium">↑ 12% from last week</p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">
                    <p className="text-sm text-muted font-bold tracking-wider uppercase mb-2">Tests Attempted</p>
                    <div className="text-4xl font-black text-primary">{analytics?.totalAttempts || '18,392'}</div>
                    <p className="text-xs text-emerald-400 mt-2 font-medium">↑ 5% from last week</p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">
                    <p className="text-sm text-muted font-bold tracking-wider uppercase mb-2">Avg. Score</p>
                    <div className="text-4xl font-black text-primary">{Math.round(analytics?.overallAccuracy || 68)}%</div>
                    <p className="text-xs text-amber-400 mt-2 font-medium">Stable across cohorts</p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">
                    <p className="text-sm text-muted font-bold tracking-wider uppercase mb-2">Flagged Items</p>
                    <div className="text-4xl font-black text-red-400">12</div>
                    <p className="text-xs text-red-400 mt-2 font-medium">Requires moderation</p>
                </div>
            </div>

            <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-border pb-4">
                    <Activity className="w-5 h-5 text-indigo-400"/> Recent Admin Activity
                </h3>
                <div className="space-y-4">
                    {['Content Manager published "Advanced Recursion"', 'System broadcasted "Weekend Mega Contest"', 'Moderator banned User_492 for plagiarism', 'Admin updated platform theme settings'].map((log, i) => (
                        <div key={i} className="flex items-center gap-4 text-sm bg-surface-hover p-4 rounded-xl">
                            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                            <span className="text-primary">{log}</span>
                            <span className="text-muted ml-auto">2 hours ago</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const UserManagement = ({ showToast }) => {
    const [users, setUsers] = useState([
        { id: 101, name: 'Alex Johnson', email: 'alex@example.com', role: 'STUDENT', reg: '2026-05-12', streak: 12, status: 'Active' },
        { id: 102, name: 'Maria Garcia', email: 'maria@example.com', role: 'STUDENT', reg: '2026-05-20', streak: 5, status: 'Active' },
        { id: 103, name: 'David Smith', email: 'david@example.com', role: 'MODERATOR', reg: '2026-01-15', streak: 45, status: 'Active' },
        { id: 104, name: 'Sarah Connor', email: 'sarah@example.com', role: 'STUDENT', reg: '2026-06-01', streak: 0, status: 'Blocked' }
    ]);
    const [searchTerm, setSearchTerm] = useState("");

    const toggleStatus = (id) => {
        setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Blocked' : 'Active' } : u));
        showToast("User status updated successfully.");
    };

    const deleteUser = (id) => {
        setUsers(users.filter(u => u.id !== id));
        showToast("User account permanently deleted.");
    };

    const filtered = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const exportDirectory = () => {
        const headers = ['ID', 'Name', 'Email', 'Role', 'Registration Date', 'Streak', 'Status'];
        const activeUsers = users.filter(u => u.status === 'Active');
        const csvContent = [
            headers.join(','),
            ...activeUsers.map(u => `${u.id},"${u.name}","${u.email}",${u.role},${u.reg},${u.streak},${u.status}`)
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'active_users_directory.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast('Exporting active users to CSV...');
    };

    return (
        <div className="relative z-10 animate-fade-in max-w-6xl mx-auto">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-bold tracking-tight mb-2">User Management</h2>
                    <p className="text-muted text-lg">Manage accounts, assign roles, and review candidate progress.</p>
                </div>
                <div className="flex gap-3">
                    <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search users..." className="px-4 py-2 bg-surface border border-border rounded-lg text-sm text-primary focus:outline-none focus:border-indigo-500 w-64" />
                    <button onClick={exportDirectory} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold transition-colors">
                        Export Directory
                    </button>
                </div>
            </header>
            
            <div className="bg-card border border-border rounded-3xl shadow-2xl overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-5 bg-surface-hover border-b border-border font-bold text-xs text-muted uppercase tracking-wider">
                    <div className="col-span-3">Candidate Info</div>
                    <div className="col-span-2">System Role</div>
                    <div className="col-span-2">Registration</div>
                    <div className="col-span-2 text-center">Status</div>
                    <div className="col-span-3 text-right">Actions</div>
                </div>
                <div className="divide-y divide-border/50">
                    {filtered.length === 0 ? (
                        <div className="p-8 text-center text-muted">No users found matching "{searchTerm}".</div>
                    ) : filtered.map(user => (
                        <div key={user.id} className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-surface-hover transition-colors">
                            <div className="col-span-3">
                                <p className="font-bold text-primary text-sm">{user.name}</p>
                                <p className="text-xs text-muted">{user.email}</p>
                            </div>
                            <div className="col-span-2">
                                <span className={`px-2 py-1 text-[10px] font-bold rounded tracking-wider ${user.role === 'STUDENT' ? 'bg-surface border border-border text-muted' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'}`}>{user.role}</span>
                            </div>
                            <div className="col-span-2 text-muted text-sm">{user.reg}</div>
                            <div className="col-span-2 flex justify-center">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-400' : 'bg-red-400'}`}></div> {user.status}
                                </span>
                            </div>
                            <div className="col-span-3 flex justify-end gap-3">
                                <button onClick={() => toggleStatus(user.id)} className="text-amber-400 hover:text-amber-300 text-xs font-bold transition-colors">{user.status === 'Active' ? 'Block' : 'Unblock'}</button>
                                <button onClick={() => deleteUser(user.id)} className="text-red-400 hover:text-red-300 text-xs font-bold transition-colors">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const LearningContent = ({ showToast }) => {
    const [topics, setTopics] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newTopic, setNewTopic] = useState({ name: '', cat: 'Quantitative' });

    const fetchTopics = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/admin/management/data', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTopics(res.data.topics);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    const handleCreate = async () => {
        if (!newTopic.name) return;
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/admin/management/topics', newTopic, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsCreating(false);
            setNewTopic({ name: '', cat: 'Quantitative' });
            fetchTopics();
            showToast("New topic created as Draft.");
        } catch (err) {
            console.error(err);
        }
    };

    const toggleStatus = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/admin/management/topics/${id}/toggle`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTopics();
            showToast("Topic visibility updated.");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="relative z-10 animate-fade-in max-w-6xl mx-auto">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-bold tracking-tight mb-2">Learning Content</h2>
                    <p className="text-muted text-lg">Manage aptitude topics, formulas, and syllabus visibility.</p>
                </div>
                <button onClick={() => setIsCreating(!isCreating)} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all">
                    <BookOpen className="w-5 h-5" /> {isCreating ? 'Cancel' : 'New Topic'}
                </button>
            </header>
            
            {isCreating && (
                <div className="bg-card border border-border p-6 rounded-2xl mb-8 flex gap-4 items-end shadow-xl">
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-muted uppercase mb-2">Topic Name</label>
                        <input type="text" value={newTopic.name} onChange={e => setNewTopic({...newTopic, name: e.target.value})} className="w-full bg-surface border border-border rounded-lg p-3 text-primary focus:outline-none focus:border-emerald-500" placeholder="e.g. Permutations & Combinations" />
                    </div>
                    <div className="w-64">
                        <label className="block text-xs font-bold text-muted uppercase mb-2">Category</label>
                        <select value={newTopic.cat} onChange={e => setNewTopic({...newTopic, cat: e.target.value})} className="w-full bg-surface border border-border rounded-lg p-3 text-primary focus:outline-none focus:border-emerald-500">
                            <option>Quantitative</option>
                            <option>Reasoning</option>
                            <option>Verbal</option>
                        </select>
                    </div>
                    <button onClick={handleCreate} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors">Save Topic</button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topics.map(topic => (
                    <div key={topic.id} className="bg-card border border-border rounded-3xl p-6 shadow-xl hover:border-emerald-500/50 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <span className="px-2 py-1 bg-surface border border-border text-muted text-[10px] font-bold rounded uppercase tracking-wider">{topic.cat}</span>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded cursor-pointer ${topic.status === 'Published' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`} onClick={() => toggleStatus(topic.id)}>
                                {topic.status} (Toggle)
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-1 group-hover:text-emerald-400 transition-colors">{topic.name}</h3>
                        <p className="text-muted text-sm mb-6">{topic.questions} Questions in Bank</p>
                        <div className="flex gap-2">
                            <button onClick={() => showToast(`Opened content editor for ${topic.name}`)} className="flex-1 py-2 bg-surface hover:bg-surface-hover text-primary text-sm font-medium rounded-lg border border-border transition-colors">Edit Content</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const TestConfigs = ({ showToast }) => {
    const [tests, setTests] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const fetchTests = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/admin/management/data', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTests(res.data.tests);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTests();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newTest = {
            name: formData.get('name'),
            time: formData.get('time') + ' mins',
            marks: formData.get('marks'),
            rules: formData.get('rules')
        };
        
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/admin/management/tests', newTest, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowForm(false);
            fetchTests();
            showToast("New Test Configuration saved as Draft.");
        } catch (err) {
            console.error(err);
        }
    };

    const toggleStatus = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/admin/management/tests/${id}/toggle`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTests();
            showToast("Test status updated.");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="relative z-10 animate-fade-in max-w-6xl mx-auto">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-bold tracking-tight mb-2">Test Configurations</h2>
                    <p className="text-muted text-lg">Design and schedule mock assessments based on company patterns.</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-amber-600/20 transition-all">
                    {showForm ? 'Cancel' : 'Create Mock Test'}
                </button>
            </header>

            {showForm && (
                <form onSubmit={handleCreate} className="bg-card border border-border p-8 rounded-3xl mb-8 shadow-xl">
                    <h3 className="text-xl font-bold text-primary mb-6 border-b border-border pb-4">New Assessment Configuration</h3>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-xs font-bold text-muted uppercase mb-2">Assessment Name</label>
                            <input name="name" required type="text" className="w-full bg-surface border border-border rounded-lg p-3 text-primary focus:outline-none focus:border-amber-500" placeholder="e.g. Accenture Advanced Coding" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-muted uppercase mb-2">Duration (Minutes)</label>
                            <input name="time" required type="number" className="w-full bg-surface border border-border rounded-lg p-3 text-primary focus:outline-none focus:border-amber-500" placeholder="e.g. 45" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-muted uppercase mb-2">Total Marks</label>
                            <input name="marks" required type="number" className="w-full bg-surface border border-border rounded-lg p-3 text-primary focus:outline-none focus:border-amber-500" placeholder="e.g. 100" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-muted uppercase mb-2">Penalty Rules</label>
                            <select name="rules" className="w-full bg-surface border border-border rounded-lg p-3 text-primary focus:outline-none focus:border-amber-500">
                                <option>No Negative Marking</option>
                                <option>-0.25 Negative Marking</option>
                                <option>-1 Negative Marking</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-colors">Save Assessment Configuration</button>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tests.map(test => (
                    <div key={test.id} className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-primary">{test.name}</h3>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded ${test.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>{test.status}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted mb-6">
                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {test.time}</span>
                            <span className="flex items-center gap-1"><Target className="w-4 h-4" /> {test.marks} Marks</span>
                        </div>
                        <div className="text-xs text-muted bg-surface inline-block px-3 py-1.5 rounded-lg border border-border">{test.rules}</div>
                        <div className="mt-6 pt-4 border-t border-border flex justify-end gap-3">
                            <button onClick={() => setTests(tests.filter(t => t.id !== test.id))} className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors mr-auto">Archive</button>
                            <button onClick={() => toggleStatus(test.id)} className="text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors">Toggle Status</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const ForumModeration = ({ showToast }) => {
    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/admin/management/data', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts(res.data.forum);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleAction = async (id, action) => {
        try {
            const token = localStorage.getItem('token');
            if (action === 'delete') {
                await axios.delete(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/admin/management/forum/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                showToast('Post deleted and user warned.');
            } else {
                await axios.put(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/admin/management/forum/${id}/approve`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                showToast('Post approved and restored.');
            }
            fetchPosts();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="relative z-10 animate-fade-in max-w-6xl mx-auto">
            <header className="mb-10">
                <h2 className="text-4xl font-bold tracking-tight mb-2">Forum Moderation</h2>
                <p className="text-muted text-lg">Review flagged content and maintain community guidelines.</p>
            </header>
            <div className="grid grid-cols-1 gap-6">
                {posts.length === 0 ? (
                    <div className="bg-card border border-border rounded-3xl p-16 text-center shadow-xl">
                        <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4 opacity-50" />
                        <h3 className="text-2xl font-bold text-primary mb-2">Mod Queue Empty</h3>
                        <p className="text-muted">All flagged posts have been reviewed. The community is safe.</p>
                    </div>
                ) : posts.map(post => (
                    <div key={post.id} className="bg-card border border-border rounded-3xl p-6 shadow-xl flex gap-6 items-start">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 border border-red-500/20">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <span className="font-bold text-primary">{post.author}</span>
                                    <span className="text-xs text-muted ml-3">{post.date}</span>
                                </div>
                                <span className="px-2 py-1 bg-red-500/10 text-red-400 text-[10px] font-bold rounded uppercase tracking-wider border border-red-500/20">Reason: {post.flagReason}</span>
                            </div>
                            <div className="bg-surface border border-border rounded-xl p-4 text-sm text-primary mb-4 font-mono">
                                "{post.content}"
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => handleAction(post.id, 'delete')} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-lg transition-colors">Delete Post & Warn</button>
                                <button onClick={() => handleAction(post.id, 'approve')} className="px-4 py-2 bg-surface hover:bg-surface-hover text-primary text-sm font-medium rounded-lg border border-border transition-colors">Ignore / Approve</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const Notifications = ({ showToast }) => {
    const [history, setHistory] = useState([
        { id: 1, title: 'System Maintenance Notice', target: 'All Users', date: 'Yesterday' }
    ]);

    const handleSend = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const title = formData.get('title');
        if (!title) return;
        setHistory([{ id: Date.now(), title, target: formData.get('target'), date: 'Just now' }, ...history]);
        e.target.reset();
        showToast(`Broadcast "${title}" successfully sent!`);
    };

    return (
        <div className="relative z-10 animate-fade-in max-w-6xl mx-auto">
            <header className="mb-10">
                <h2 className="text-4xl font-bold tracking-tight mb-2">Broadcast Notifications</h2>
                <p className="text-muted text-lg">Send platform-wide alerts, reminders, and streak nudges.</p>
            </header>
            <div className="flex flex-col lg:flex-row gap-8">
                <form onSubmit={handleSend} className="flex-1 bg-card border border-border rounded-3xl p-8 shadow-2xl">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-border pb-4"><Bell className="w-5 h-5 text-yellow-400"/> Compose Alert</h3>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-muted text-sm uppercase tracking-wider font-bold mb-2">Target Audience</label>
                            <select name="target" className="w-full bg-surface border border-border rounded-xl p-3.5 text-primary focus:outline-none focus:border-yellow-500 transition-colors">
                                <option>All Registered Users</option>
                                <option>Students on 0-day Streaks (Nudge)</option>
                                <option>Top 10% Performers</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-muted text-sm uppercase tracking-wider font-bold mb-2">Message Title</label>
                            <input name="title" required type="text" className="w-full bg-surface border border-border rounded-xl p-3.5 text-primary focus:outline-none focus:border-yellow-500 transition-colors" placeholder="e.g. Weekend Mega Contest is Live!" />
                        </div>
                        <div>
                            <label className="block text-muted text-sm uppercase tracking-wider font-bold mb-2">Message Body</label>
                            <textarea required className="w-full bg-surface border border-border rounded-xl p-4 text-primary h-32 focus:outline-none focus:border-yellow-500 transition-colors" placeholder="Type your announcement here..."></textarea>
                        </div>
                        <button type="submit" className="w-full py-4 bg-yellow-600 hover:bg-yellow-500 text-black font-black tracking-widest uppercase rounded-xl transition-all shadow-[0_0_20px_rgba(202,138,4,0.3)] hover:shadow-[0_0_30px_rgba(202,138,4,0.5)]">
                            Send Broadcast Now
                        </button>
                    </div>
                </form>
                <div className="lg:w-[400px]">
                    <h3 className="text-lg font-bold mb-4 text-primary">Recent Broadcasts</h3>
                    <div className="space-y-4">
                        {history.map(item => (
                            <div key={item.id} className="bg-card border border-border rounded-2xl p-5">
                                <span className="text-[10px] text-muted font-bold uppercase mb-1 block">Sent: {item.date}</span>
                                <p className="font-bold text-primary text-sm mb-1">{item.title}</p>
                                <p className="text-xs text-muted">Sent to: {item.target}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const PlatformSettings = ({ showToast }) => {
    const [settings, setSettings] = useState({
        publicReg: true,
        maintenance: false,
        strictResume: true
    });

    const toggle = (key) => setSettings({...settings, [key]: !settings[key]});

    return (
        <div className="relative z-10 animate-fade-in max-w-4xl mx-auto">
            <header className="mb-10">
                <h2 className="text-4xl font-bold tracking-tight mb-2">Platform Settings</h2>
                <p className="text-muted text-lg">Configure global environment variables and access rules.</p>
            </header>
            <div className="bg-card border border-border rounded-3xl p-8 shadow-2xl">
                <div className="space-y-8">
                    <div className="flex items-center justify-between pb-6 border-b border-border">
                        <div>
                            <h4 className="font-bold text-primary text-lg">Public Registration</h4>
                            <p className="text-sm text-muted mt-1">Allow new users to sign up via the auth portal.</p>
                        </div>
                        <div onClick={() => toggle('publicReg')} className={`w-14 h-8 rounded-full flex items-center p-1 cursor-pointer transition-colors ${settings.publicReg ? 'bg-emerald-500' : 'bg-surface border border-border'}`}>
                            <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${settings.publicReg ? 'translate-x-6' : ''}`}></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pb-6 border-b border-border">
                        <div>
                            <h4 className="font-bold text-primary text-lg">Maintenance Mode</h4>
                            <p className="text-sm text-muted mt-1">Disable access for non-admin users temporarily.</p>
                        </div>
                        <div onClick={() => toggle('maintenance')} className={`w-14 h-8 rounded-full flex items-center p-1 cursor-pointer transition-colors ${settings.maintenance ? 'bg-red-500' : 'bg-surface border border-border'}`}>
                            <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${settings.maintenance ? 'translate-x-6' : ''}`}></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pb-6 border-b border-border">
                        <div>
                            <h4 className="font-bold text-primary text-lg">Strict Resume Verification</h4>
                            <p className="text-sm text-muted mt-1">Require users to upload a resume before accessing the Mock Interview portal.</p>
                        </div>
                        <div onClick={() => toggle('strictResume')} className={`w-14 h-8 rounded-full flex items-center p-1 cursor-pointer transition-colors ${settings.strictResume ? 'bg-emerald-500' : 'bg-surface border border-border'}`}>
                            <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${settings.strictResume ? 'translate-x-6' : ''}`}></div>
                        </div>
                    </div>
                </div>
                <div className="mt-8 flex justify-end">
                    <button onClick={() => showToast('Platform configuration saved securely.')} className="px-8 py-3 bg-primary text-card font-bold rounded-xl hover:opacity-80 transition-opacity">
                        Save Configuration
                    </button>
                </div>
            </div>
        </div>
    );
};
