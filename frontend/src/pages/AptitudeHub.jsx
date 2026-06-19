import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckCircle, Code, FileText, LogOut, BookOpen, Brain, ChevronRight, Calculator, AlignLeft, MessageSquare, Target } from 'lucide-react';
import axios from 'axios';

export default function AptitudeHub() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState(null);

  useEffect(() => {
    const fetchHub = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }
      try {
        const res = await axios.get('http://localhost:8080/api/aptitude/hub', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHub();
  }, [navigate]);

  const getIcon = (name) => {
    if (name.includes('QUANTITATIVE')) return <Calculator className="w-6 h-6 text-indigo-400" />;
    if (name.includes('LOGICAL')) return <Brain className="w-6 h-6 text-fuchsia-400" />;
    return <AlignLeft className="w-6 h-6 text-emerald-400" />;
  };

  const getCategoryTitle = (name) => {
    if (name === 'QUANTITATIVE') return 'Quantitative Aptitude';
    if (name === 'LOGICAL_REASONING') return 'Logical Reasoning';
    if (name === 'VERBAL_ABILITY') return 'Verbal Ability';
    return name;
  };

  return (
    <div className="min-h-screen bg-background text-primary font-sans flex">
      <aside className="w-64 border-r border-border p-6 flex flex-col hidden md:flex">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4 text-primary" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">SmartThink</h1>
        </div>
        <nav className="flex-1 space-y-2">
          <Link to="/dashboard" className="flex items-center gap-3 hover:bg-surface/50 text-secondary hover:text-primary px-4 py-3 rounded-xl transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link to="/resume" className="flex items-center gap-3 hover:bg-surface/50 text-secondary hover:text-primary px-4 py-3 rounded-xl transition-colors">
            <FileText className="w-5 h-5" />
            <span className="font-medium">Resume Builder</span>
          </Link>
          <Link to="/aptitude" className="flex items-center gap-3 bg-surface text-primary px-4 py-3 rounded-xl transition-colors">
            <CheckCircle className="w-5 h-5 text-fuchsia-400" />
            <span className="font-medium">Aptitude Tests</span>
          </Link>
          <Link to="/coding" className="flex items-center gap-3 hover:bg-surface/50 text-secondary hover:text-primary px-4 py-3 rounded-xl transition-colors">
            <Code className="w-5 h-5" />
            <span className="font-medium">Coding Practice</span>
          </Link>
          <Link to="/hr-interview" className="flex items-center gap-3 hover:bg-surface/50 text-secondary hover:text-primary px-4 py-3 rounded-xl transition-colors">
            <Target className="w-5 h-5" />
            <span className="font-medium">Mock HR Interview</span>
          </Link>
          <Link to="/forum" className="flex items-center gap-3 hover:bg-surface/50 text-secondary hover:text-primary px-4 py-3 rounded-xl transition-colors">
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">Community Forum</span>
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-fuchsia-600 rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

        <header className="mb-10 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Aptitude Preparation Hub</h2>
            <p className="text-secondary">Master every placement topic with Learn & Practice modes.</p>
          </div>
          <button 
            onClick={() => navigate('/aptitude/mock')}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-primary font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
          >
            <Brain className="w-5 h-5" />
            Start Full Mock Test
          </button>
        </header>

        {loading ? (
          <div className="text-center py-20 text-secondary animate-pulse">Loading categories...</div>
        ) : (
          <div className="space-y-12 relative z-10">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-surface/50 border border-border rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-surface rounded-xl border border-border shadow-inner">
                    {getIcon(cat.name)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary">{getCategoryTitle(cat.name)}</h3>
                    <p className="text-sm text-secondary">{cat.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cat.topics.map((topic, idx) => {
                    // Mark some specific topics as completed for Sonu/Anu demo presentation
                    const profileStr = localStorage.getItem('userProfileData');
                    const isSonu = profileStr && JSON.parse(profileStr).name.includes('Sonu Diode');
                    const isAnu = profileStr && JSON.parse(profileStr).name.includes('Anu');
                    const isDemo = isSonu || isAnu;
                    const isCompleted = isDemo && (topic.name === 'Number System' || topic.name === 'Percentages' || topic.name === 'Blood Relations');

                    return (
                    <div 
                      key={topic.id} 
                      onClick={() => setSelectedTopic(topic)}
                      className="group cursor-pointer bg-surface hover:bg-indigo-950/30 border border-border hover:border-indigo-500/50 rounded-xl p-5 transition-all relative"
                    >
                      {isCompleted && (
                        <div className="absolute top-4 right-4 bg-emerald-500/10 rounded-full p-1 border border-emerald-500/20">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                        </div>
                      )}
                      <h4 className="text-lg font-bold text-primary mb-1 group-hover:text-indigo-400 transition-colors pr-6">{topic.name}</h4>
                      <div className="flex justify-between items-center mt-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded bg-surface-elevated ${
                          topic.difficultyLevel === 'EASY' ? 'text-emerald-400' : 
                          topic.difficultyLevel === 'MEDIUM' ? 'text-amber-400' : 'text-red-400'
                        }`}>
                          {topic.difficultyLevel}
                        </span>
                        <ChevronRight className="w-5 h-5 text-neutral-600 group-hover:text-indigo-400 transition-colors" />
                      </div>
                    </div>
                  )})}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedTopic && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedTopic(null)}>
            <div className="bg-surface border border-border rounded-2xl p-8 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
              <h3 className="text-2xl font-bold text-primary mb-2">{selectedTopic.name}</h3>
              <p className="text-secondary mb-8">{selectedTopic.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => navigate(`/aptitude/learn/${selectedTopic.id}`)}
                  className="flex flex-col items-center gap-3 bg-surface-elevated hover:bg-fuchsia-600/20 hover:border-fuchsia-500/50 border border-border-strong p-6 rounded-xl transition-all"
                >
                  <BookOpen className="w-8 h-8 text-fuchsia-400" />
                  <span className="font-bold text-primary">Learn Mode</span>
                  <span className="text-xs text-secondary text-center">Read formulas & tricks</span>
                </button>

                <button 
                  onClick={() => navigate(`/aptitude/practice/${selectedTopic.id}`)}
                  className="flex flex-col items-center gap-3 bg-surface-elevated hover:bg-indigo-600/20 hover:border-indigo-500/50 border border-border-strong p-6 rounded-xl transition-all"
                >
                  <CheckCircle className="w-8 h-8 text-indigo-400" />
                  <span className="font-bold text-primary">Practice Mode</span>
                  <span className="text-xs text-secondary text-center">Timed active quiz</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
