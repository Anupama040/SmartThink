import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Code, ArrowLeft, Terminal, LayoutDashboard, Brain, PlayCircle, Trophy, TrendingUp, FileText, CheckCircle } from 'lucide-react';
import axios from 'axios';

export default function CodingHub() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:8080/api/coding/problems', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProblems(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  return (
    <div className="min-h-screen bg-background text-primary flex font-sans overflow-hidden relative">
      <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-emerald-600 rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

      {/* Sidebar */}
      <aside className="w-64 border-r border-border p-6 flex flex-col hidden md:flex z-10 bg-background/80 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Code className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">SmartThink</h1>
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
          <Link to="/aptitude" className="flex items-center gap-3 hover:bg-surface/50 text-secondary hover:text-primary px-4 py-3 rounded-xl transition-colors">
            <Brain className="w-5 h-5" />
            <span className="font-medium">Aptitude Tests</span>
          </Link>
          <Link to="/coding" className="flex items-center gap-3 bg-surface text-primary px-4 py-3 rounded-xl transition-colors border border-border">
            <Code className="w-5 h-5 text-emerald-400" />
            <span className="font-medium">Coding Practice</span>
          </Link>
          <Link to="/hr-interview" className="flex items-center gap-3 hover:bg-surface/50 text-secondary hover:text-primary px-4 py-3 rounded-xl transition-colors">
            <Trophy className="w-5 h-5" />
            <span className="font-medium">Mock HR Interview</span>
          </Link>
          <Link to="/forum" className="flex items-center gap-3 hover:bg-surface/50 text-secondary hover:text-primary px-4 py-3 rounded-xl transition-colors">
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">Community Forum</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative z-10 bg-card">
        <div className="p-8 md:p-12 max-w-6xl mx-auto">
          {/* Header Stats similar to screenshot */}
          {(() => {
            const profileStr = localStorage.getItem('userProfileData');
            const isSonu = profileStr && JSON.parse(profileStr).name.includes('Sonu Diode');
            const isAnu = profileStr && JSON.parse(profileStr).name.includes('Anu');
            const isDemo = isSonu || isAnu;
            const attemptedCount = isDemo ? 15 : 0;
            const solvedCount = isDemo ? 12 : 0;

            return (
              <div className="flex flex-wrap items-center gap-10 mb-8 border-b border-border pb-6">
                <div>
                  <span className="text-secondary text-sm mr-2">Attempted</span>
                  <span className="font-bold text-lg">{attemptedCount} / {problems.length * 10}</span>
                </div>
                <div>
                  <span className="text-secondary text-sm mr-2">Solved</span>
                  <span className="font-bold text-lg">{solvedCount} / {problems.length * 10}</span>
                </div>
                <div>
                  <span className="text-secondary text-sm mr-2">Marks Scored</span>
                  <span className="font-bold text-lg">{solvedCount * 10} / {problems.length * 10}</span>
                </div>
              </div>
            );
          })()}

          <div className="bg-surface-hover border border-border rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-border text-sm font-bold text-primary bg-[#222222]">
              <div className="col-span-6">Question</div>
              <div className="col-span-2 text-center">Company</div>
              <div className="col-span-2 text-center">Difficulty</div>
              <div className="col-span-2 text-center">Action</div>
            </div>

            {loading ? (
              <div className="p-12 flex justify-center">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {problems.map((problem, idx) => {
                  const profileStr = localStorage.getItem('userProfileData');
                  const isSonu = profileStr && JSON.parse(profileStr).name.includes('Sonu Diode');
                  const isAnu = profileStr && JSON.parse(profileStr).name.includes('Anu');
                  const isDemo = isSonu || isAnu;

                  const isSolved = isDemo && idx < 12;
                  const isAttempted = isDemo && idx < 15 && idx >= 12;

                  return (
                    <div key={problem.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-surface-elevated transition-colors">
                      {/* Question Column */}
                      <div className="col-span-6">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-[15px]">{problem.title}</h3>
                          {/* Mock Checkmark and Bookmark */}
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${isSolved ? 'bg-emerald-500' : 'bg-neutral-600'}`}>
                            <CheckCircle className={`w-3 h-3 ${isSolved ? 'text-primary' : 'text-[#1a1a1a]'}`} />
                          </div>
                          <FileText className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="flex gap-2">
                          <span className="px-2 py-0.5 bg-pink-500/10 text-pink-400 border border-pink-500/20 rounded-full text-[10px] font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span> Code
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${isSolved ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                              isAttempted ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                            }`}>
                            Score: {isSolved ? '10' : isAttempted ? '5' : '0'} / 10
                          </span>
                          <span className="px-2 py-0.5 bg-surface-elevated text-secondary border border-border-strong rounded-full text-[10px] font-bold">
                            Attempts: {isSolved ? '1' : isAttempted ? '3' : '0'}
                          </span>
                        </div>
                      </div>

                      {/* Company Column */}
                      <div className="col-span-2 flex justify-center">
                        {idx % 2 === 0 ? (
                          <span className="text-xs text-muted font-medium">Google</span>
                        ) : (
                          <span className="text-xs text-muted font-medium">Amazon</span>
                        )}
                      </div>

                      {/* Difficulty Column */}
                      <div className="col-span-2 flex justify-center">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wider ${problem.difficulty === 'EASY' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            problem.difficulty === 'MEDIUM' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                              'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                          {problem.difficulty}
                        </span>
                      </div>

                      {/* Action Column */}
                      <div className="col-span-2 flex justify-center">
                        <Link
                          to={`/coding/${problem.id}`}
                          className="px-6 py-1.5 bg-transparent border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-primary rounded text-sm font-bold transition-colors"
                        >
                          Solve
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
