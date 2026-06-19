import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, ShieldCheck, ArrowLeft, Video } from 'lucide-react';

export default function HRHub() {
  const navigate = useNavigate();

  const categories = [
    {
      id: 'BEHAVIORAL',
      title: 'Behavioral Interview',
      description: 'Focuses on your past experiences, teamwork, and conflict resolution.',
      icon: <Users className="w-8 h-8 text-indigo-400" />,
      color: 'from-indigo-500/20 to-indigo-500/5',
      borderColor: 'border-indigo-500/30 hover:border-indigo-500'
    },
    {
      id: 'MANAGERIAL',
      title: 'Managerial Round',
      description: 'Tests your career goals, ambition, and cultural fit within the company.',
      icon: <Briefcase className="w-8 h-8 text-fuchsia-400" />,
      color: 'from-fuchsia-500/20 to-fuchsia-500/5',
      borderColor: 'border-fuchsia-500/30 hover:border-fuchsia-500'
    },
    {
      id: 'SITUATIONAL',
      title: 'Situational & Ethics',
      description: 'Evaluates your decision-making skills in hypothetical workplace scenarios.',
      icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />,
      color: 'from-emerald-500/20 to-emerald-500/5',
      borderColor: 'border-emerald-500/30 hover:border-emerald-500'
    }
  ];

  return (
    <div className="min-h-screen bg-background text-primary font-sans flex flex-col relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

      <header className="border-b border-border p-6 flex items-center gap-4 relative z-10 bg-background/50 backdrop-blur-md">
        <Link to="/dashboard" className="p-2 bg-surface border border-border hover:bg-surface-elevated rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Mock HR Interviews</h1>
          <p className="text-sm text-secondary">Practice your communication and soft skills</p>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-10 relative z-10">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Video className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Master the Final Round</h2>
          <p className="text-secondary text-lg">
            Record yourself answering actual HR questions requested by top tech companies. Review your answers and check against our expected talking points.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div 
              key={cat.id}
              onClick={() => navigate(`/hr-interview/session?category=${cat.id}`)}
              className={`bg-gradient-to-br ${cat.color} border ${cat.borderColor} rounded-2xl p-8 cursor-pointer transition-all hover:scale-105 shadow-xl shadow-black/20`}
            >
              <div className="mb-6">{cat.icon}</div>
              <h3 className="text-2xl font-bold mb-3">{cat.title}</h3>
              <p className="text-secondary leading-relaxed mb-8">{cat.description}</p>
              <div className="flex items-center text-sm font-bold tracking-wider uppercase text-primary/70 group-hover:text-primary transition-colors">
                Start Session &rarr;
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
