import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Database, LogOut, Users, BookOpen, Clock, FileText, ShieldAlert, Bell, Settings } from 'lucide-react';
import axios from 'axios';

import { GlobalToast, DashboardAnalytics, UserManagement, LearningContent, TestConfigs, ForumModeration, Notifications, PlatformSettings } from '../components/admin/AdminModules';
import { QuestionBank, ReportsAnalytics, AuditLogs } from '../components/admin/AdminModulesPart2';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');
  const [analytics, setAnalytics] = useState(null);
  
  const [toastMessage, setToastMessage] = useState('');
  
  const showToast = (message) => {
      setToastMessage(message);
      setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    const fetchHub = async () => {
      const token = localStorage.getItem('token');
      try {
        const analyticsRes = await axios.get('http://localhost:8080/api/admin/analytics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAnalytics(analyticsRes.data);
      } catch (err) {
        if (err.response?.status === 403) {
            navigate('/dashboard');
        }
      }
    };
    fetchHub();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background text-primary flex font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 border-r border-border bg-card flex flex-col z-20 relative">
        <div className="p-8 border-b border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">Admin Hub</h1>
          </div>
          <p className="text-xs text-muted font-medium tracking-wider uppercase ml-13">System Management</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide">
          <div className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-2 mt-2 px-4">Overview</div>
          <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${activeTab === 'analytics' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-secondary hover:text-primary hover:bg-surface/50 border border-transparent'}`}><LayoutDashboard className="w-4 h-4" /> Dashboard</button>
          
          <div className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-2 mt-6 px-4">Users</div>
          <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${activeTab === 'users' ? 'bg-fuchsia-600/10 text-fuchsia-400 border border-fuchsia-500/20' : 'text-secondary hover:text-primary hover:bg-surface/50 border border-transparent'}`}><Users className="w-4 h-4" /> User Management</button>

          <div className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-2 mt-6 px-4">Content</div>
          <button onClick={() => setActiveTab('topics')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${activeTab === 'topics' ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20' : 'text-secondary hover:text-primary hover:bg-surface/50 border border-transparent'}`}><BookOpen className="w-4 h-4" /> Learning Content</button>
          
          <div className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-2 mt-6 px-4">Assessments</div>
          <button onClick={() => setActiveTab('questions')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${activeTab === 'questions' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-secondary hover:text-primary hover:bg-surface/50 border border-transparent'}`}><Database className="w-4 h-4" /> Question Bank</button>
          <button onClick={() => setActiveTab('tests')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${activeTab === 'tests' ? 'bg-amber-600/10 text-amber-400 border border-amber-500/20' : 'text-secondary hover:text-primary hover:bg-surface/50 border border-transparent'}`}><Clock className="w-4 h-4" /> Test Configs</button>
          <button onClick={() => setActiveTab('reports')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${activeTab === 'reports' ? 'bg-rose-600/10 text-rose-400 border border-rose-500/20' : 'text-secondary hover:text-primary hover:bg-surface/50 border border-transparent'}`}><FileText className="w-4 h-4" /> Reports & Analytics</button>

          <div className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-2 mt-6 px-4">Community</div>
          <button onClick={() => setActiveTab('forum')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${activeTab === 'forum' ? 'bg-red-600/10 text-red-400 border border-red-500/20' : 'text-secondary hover:text-primary hover:bg-surface/50 border border-transparent'}`}><ShieldAlert className="w-4 h-4" /> Forum Moderation</button>

          <div className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-2 mt-6 px-4">System</div>
          <button onClick={() => setActiveTab('notifications')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${activeTab === 'notifications' ? 'bg-yellow-600/10 text-yellow-400 border border-yellow-500/20' : 'text-secondary hover:text-primary hover:bg-surface/50 border border-transparent'}`}><Bell className="w-4 h-4" /> Broadcasts</button>
          <button onClick={() => setActiveTab('audit')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${activeTab === 'audit' ? 'bg-teal-600/10 text-teal-400 border border-teal-500/20' : 'text-secondary hover:text-primary hover:bg-surface/50 border border-transparent'}`}><FileText className="w-4 h-4" /> Audit Logs</button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${activeTab === 'settings' ? 'bg-gray-600/10 text-gray-400 border border-gray-500/20' : 'text-secondary hover:text-primary hover:bg-surface/50 border border-transparent'}`}><Settings className="w-4 h-4" /> Platform Settings</button>
        </nav>

        <div className="p-4 border-t border-border/50">
          <button onClick={() => navigate('/dashboard')} className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl font-bold transition-colors text-sm">
            <LogOut className="w-4 h-4" /> Exit Admin
          </button>
        </div>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto relative bg-[#050505]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

        {activeTab === 'analytics' && <DashboardAnalytics analytics={analytics} />}
        {activeTab === 'users' && <UserManagement showToast={showToast} />}
        {activeTab === 'topics' && <LearningContent showToast={showToast} />}
        {activeTab === 'questions' && <QuestionBank showToast={showToast} />}
        {activeTab === 'tests' && <TestConfigs showToast={showToast} />}
        {activeTab === 'reports' && <ReportsAnalytics showToast={showToast} analytics={analytics} />}
        {activeTab === 'forum' && <ForumModeration showToast={showToast} />}
        {activeTab === 'notifications' && <Notifications showToast={showToast} />}
        {activeTab === 'audit' && <AuditLogs showToast={showToast} />}
        {activeTab === 'settings' && <PlatformSettings showToast={showToast} />}
        
      </main>

      <GlobalToast message={toastMessage} />
    </div>
  );
}
