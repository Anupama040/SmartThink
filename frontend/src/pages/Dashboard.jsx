import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, FileText, CheckCircle, Code, Flame, Target, Clock, MessageSquare, Download, Bot } from 'lucide-react';
import axios from 'axios';

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [mistakes, setMistakes] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Generate streak data for the current month only
  const generateCurrentMonthStreak = () => {
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const currentDay = today.getDate();
    
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      if (i === currentDay) {
        // Real tracking for today!
        const solved = data?.questionsSolvedToday || 0;
        let level = 0;
        if (solved > 0 && solved <= 2) level = 1;
        else if (solved > 2 && solved <= 5) level = 2;
        else if (solved > 5 && solved <= 8) level = 3;
        else if (solved > 8) level = 4;
        days.push(level);
      } else {
        // We just launched today, so past and future days are empty
        days.push(0);
      }
    }
    return days;
  };
  const [streakData, setStreakData] = useState([]);

  useEffect(() => {
    if (data) {
      setStreakData(generateCurrentMonthStreak());
    }
  }, [data]);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);

        const roadmapRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/dashboard/roadmap', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRoadmap(roadmapRes.data);

        const mistakesRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/aptitude/analytics/mistakes', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMistakes(mistakesRes.data);
      } catch (err) {
        console.error("Failed to load dashboard", err);
        if (err.response?.status === 403) {
          localStorage.removeItem('token');
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleExportPDF = () => {
    // html2canvas does not support Tailwind v4's oklch() color spaces.
    // Native print is vastly superior and fully supports modern CSS.
    window.print();
  };

  const getStreakColor = (l) => {
     if (l === 0) return 'bg-[#ffffff] border border-neutral-300'; 
     if (l === 1) return 'bg-[#dc2626]'; // Red (very low)
     if (l === 2) return 'bg-[#ea580c]'; // Orange (little higher)
     if (l === 3) return 'bg-emerald-500'; // Light Green
     if (l >= 4) return 'bg-emerald-700'; // Dark Green
     return 'bg-[#ffffff] border border-neutral-300';
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonthName = monthNames[new Date().getMonth()];

  if (loading) {
    return <div className="min-h-screen bg-card text-primary flex items-center justify-center">Loading your dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-card text-primary font-sans flex print:bg-white print:text-black">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border p-6 flex flex-col hidden md:flex print:hidden bg-card">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4 text-primary" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">SmartThink</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          <Link to="/dashboard" className="flex items-center gap-3 bg-surface-hover border border-border text-primary px-4 py-3 rounded-xl transition-colors">
            <LayoutDashboard className="w-5 h-5 text-indigo-400" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link to="/resume" className="flex items-center gap-3 hover:bg-surface-hover text-secondary hover:text-primary px-4 py-3 rounded-xl transition-colors">
            <FileText className="w-5 h-5" />
            <span className="font-medium">Resume Builder</span>
          </Link>
          <Link to="/aptitude" className="flex items-center gap-3 hover:bg-surface-hover text-secondary hover:text-primary px-4 py-3 rounded-xl transition-colors">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Aptitude Tests</span>
          </Link>
          <Link to="/coding" className="flex items-center gap-3 hover:bg-surface-hover text-secondary hover:text-primary px-4 py-3 rounded-xl transition-colors">
            <Code className="w-5 h-5" />
            <span className="font-medium">Coding Practice</span>
          </Link>
          <Link to="/hr-interview" className="flex items-center gap-3 hover:bg-surface-hover text-secondary hover:text-primary px-4 py-3 rounded-xl transition-colors">
            <Target className="w-5 h-5" />
            <span className="font-medium">Mock HR Interview</span>
          </Link>
          <Link to="/chatbot" className="flex items-center gap-3 hover:bg-surface-hover text-secondary hover:text-primary px-4 py-3 rounded-xl transition-colors">
            <Bot className="w-5 h-5 text-blue-400" />
            <span className="font-medium">SmartBot AI</span>
          </Link>
          <Link to="/forum" className="flex items-center gap-3 hover:bg-surface-hover text-secondary hover:text-primary px-4 py-3 rounded-xl transition-colors">
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">Community Forum</span>
          </Link>
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-400 hover:text-red-300 hover:bg-red-950/30 px-4 py-3 rounded-xl transition-colors mt-auto print:hidden"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto relative bg-background">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
        
        <div id="dashboard-report-area" className="relative z-10">
          <header className="flex justify-between items-center mb-10 print:hidden">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-1">Welcome back, {data?.firstName || 'Student'}!</h2>
              <p className="text-secondary">Here is your daily preparation overview.</p>
            </div>
            
            <div className="flex items-center gap-4">
              <button onClick={handleExportPDF} className="bg-surface-hover border border-border hover:bg-[#222] text-primary-muted px-4 py-2 rounded-xl flex items-center gap-2 transition-colors text-sm font-bold">
                <Download className="w-4 h-4" /> Export PDF
              </button>
              {/* Streak Badge */}
              <div className="bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="font-bold text-orange-400">{data?.practiceStreak || 0} Day Streak</span>
              </div>
              <Link to="/profile" className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-fuchsia-500 rounded-full border border-border-strong flex items-center justify-center text-sm font-bold shadow-lg hover:shadow-indigo-500/50 transition-shadow cursor-pointer">
                {data?.firstName ? data.firstName.charAt(0) : 'S'}
              </Link>
            </div>
          </header>

          {/* Submission Streak Graph */}
          <div className="bg-surface-hover border border-border rounded-2xl p-6 shadow-xl shadow-black/20 mb-10 print:hidden">
            <h3 className="text-xl font-bold mb-6 text-primary border-b border-border pb-4">Activity for {currentMonthName}</h3>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {streakData.map((level, idx) => (
                <div 
                  key={idx} 
                  className={`w-10 h-10 rounded-md flex items-center justify-center text-xs font-bold ${getStreakColor(level)} ${level === 0 ? 'text-secondary' : 'text-primary'}`}
                  title={`Day ${idx + 1}`}
                >
                  {idx + 1}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-secondary">
               <span>No Practice</span>
               <div className="w-4 h-4 bg-white border border-neutral-300 rounded-sm"></div>
               <div className="w-4 h-4 bg-[#dc2626] rounded-sm"></div>
               <div className="w-4 h-4 bg-[#ea580c] rounded-sm"></div>
               <div className="w-4 h-4 bg-emerald-500 rounded-sm"></div>
               <div className="w-4 h-4 bg-emerald-700 rounded-sm"></div>
               <span className="ml-1">More Practice</span>
            </div>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-xl shadow-black/20 hover:border-border-strong transition-colors">
            <div className="text-secondary text-sm font-medium mb-4 flex items-center gap-2">
                <Target className="w-4 h-4" /> Today's Accuracy
            </div>
            <div className="text-4xl font-bold text-primary mb-2">{Math.round(data?.accuracyToday || 0)}%</div>
            <div className="text-muted text-sm">{data?.questionsSolvedToday || 0} questions solved</div>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 shadow-xl shadow-black/20 hover:border-border-strong transition-colors">
            <div className="text-secondary text-sm font-medium mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Time Spent Today
            </div>
            <div className="text-4xl font-bold text-primary mb-2">{data?.timeSpentMinutesToday || 0}m</div>
            <div className="text-muted text-sm">active practice time</div>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 shadow-xl shadow-black/20 hover:border-border-strong transition-colors">
            <div className="text-secondary text-sm font-medium mb-4 flex items-center gap-2">
                <Flame className="w-4 h-4 text-secondary" /> Highest Streak
            </div>
            <div className="text-4xl font-bold text-primary mb-2">{data?.highestStreak || 0}</div>
            <div className="text-muted text-sm">best consecutive days</div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500/10 to-fuchsia-500/10 border border-indigo-500/20 rounded-2xl p-6 shadow-xl shadow-indigo-500/5">
            <div className="text-indigo-300 text-sm font-medium mb-4">Resume ATS Match</div>
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400 mb-2 pb-1 pr-1">
              {data?.resumeAtsMatch > 0 ? `${data.resumeAtsMatch} / 10` : 'Pending'}
            </div>
            <div className="text-indigo-400/80 text-sm">
              {data?.resumeAtsMatch > 0 ? 'Good match for technical roles' : 'Upload resume to scan'}
            </div>
          </div>
        </div>

        {/* Roadmap preview */}
        <div className="bg-surface border border-border rounded-2xl p-6 relative z-10 shadow-xl shadow-black/20">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold">Your Personalized Roadmap</h3>
              <p className="text-sm text-secondary">Target Role: <span className="text-indigo-400 font-medium">{roadmap?.targetRole || 'Not Set'}</span></p>
            </div>
            <span className="text-sm text-secondary">Today's Tasks</span>
          </div>
          
          <div className="space-y-4">
            {roadmap?.todayTasks?.map((task, idx) => {
              let linkTo = '#';
              if (task.category === 'Aptitude') linkTo = '/aptitude';
              if (task.category === 'Coding') linkTo = '/coding';
              if (task.category === 'Interview') linkTo = '/hr-interview';

              return (
                <div key={idx} className="flex items-center gap-4 p-4 bg-indigo-950/30 rounded-xl border border-indigo-500/30 hover:border-indigo-500/50 transition-colors">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
                  <div className="flex-1">
                    <div className="font-medium text-indigo-100">{task.title}</div>
                    <div className="text-sm text-indigo-400">{task.description} • {task.category}</div>
                  </div>
                  <Link to={linkTo} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-primary text-sm font-medium rounded-lg transition-colors shrink-0">
                    Start Now
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mistake Analytics */}
        <div className="bg-surface border border-border rounded-2xl p-6 relative z-10 shadow-xl shadow-black/20 mt-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold">Mistake Log Analytics</h3>
              <p className="text-sm text-secondary">Categorized error analysis from your Mock Tests</p>
            </div>
            <div className="text-xl font-bold bg-red-500/10 text-red-400 px-4 py-2 rounded-xl border border-red-500/20">
              {mistakes?.totalMistakes || 0} Mistakes Tracked
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface-elevated/50 rounded-xl p-5 border border-border-strong/50">
                <div className="text-sm font-medium text-secondary mb-2 uppercase tracking-wider">Careless Errors</div>
                <div className="text-3xl font-bold text-yellow-400">{mistakes?.carelessCount || 0}</div>
                <div className="text-xs text-muted mt-2">Missed Easy difficulty questions</div>
            </div>
            <div className="bg-surface-elevated/50 rounded-xl p-5 border border-border-strong/50">
                <div className="text-sm font-medium text-secondary mb-2 uppercase tracking-wider">Conceptual Gaps</div>
                <div className="text-3xl font-bold text-blue-400">{mistakes?.conceptualCount || 0}</div>
                <div className="text-xs text-muted mt-2">Missed Hard difficulty questions</div>
            </div>
            <div className="bg-surface-elevated/50 rounded-xl p-5 border border-border-strong/50">
                <div className="text-sm font-medium text-secondary mb-2 uppercase tracking-wider">Time Pressure</div>
                <div className="text-3xl font-bold text-purple-400">{mistakes?.timePressureCount || 0}</div>
                <div className="text-xs text-muted mt-2">Missed Medium difficulty questions</div>
            </div>
          </div>
        </div>

        </div>
      </main>
    </div>
  );
}
