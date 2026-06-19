import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Mail, Phone, ExternalLink, 
  Briefcase, GraduationCap, Code2, Award, Zap, 
  FileText, CheckCircle2, TrendingUp, BookOpen, Star, User, Edit2, Save, Plus, X, Trash2
} from 'lucide-react';
import axios from 'axios';

export default function UserProfile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);

  // Calculate dynamic completion percentage
  const calculateCompletion = (data) => {
    if (!data) return 0;
    let total = 0;
    let filled = 0;
    const check = (val) => {
      total++;
      if (val && (typeof val !== 'string' || val.trim() !== '') && (Array.isArray(val) ? val.length > 0 : true)) {
        filled++;
      }
    };

    check(data.targetRole);
    check(data.location);
    check(data.summary);
    check(data.bio);
    check(data.phone);
    check(data.linkedin);
    check(data.github);
    check(data.academics.college);
    check(data.academics.degree);
    check(data.academics.graduationYear);
    check(data.academics.careerGoals);
    check(data.skills.techStack);
    check(data.skills.aptitudeStrengths);
    check(data.projects);

    return Math.round((filled / total) * 100);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const dashRes = await axios.get('http://localhost:8080/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const dbData = dashRes.data;
        const savedProfile = localStorage.getItem('userProfileData');
        
        let initialData;
        if (savedProfile) {
          initialData = JSON.parse(savedProfile);
          initialData.name = `${dbData.firstName} ${dbData.lastName || ''}`.trim() || 'Student';
          initialData.progress.quizAverage = `${Math.round(dbData.accuracyToday || 0)}%`;
          initialData.progress.codingStreak = `${dbData.practiceStreak || 0} Days`;
          initialData.progress.completedModules = dbData.questionsSolvedToday || 0;
          if (dbData.highestStreak > 10 && !initialData.progress.badges.includes('Fire Learner')) {
             initialData.progress.badges.push('Fire Learner');
          }
        } else {
          const isSonu = dbData.firstName === 'Sonu';
          const isAnu = dbData.firstName === 'Anu';
          const isDemo = isSonu || isAnu;

          initialData = {
            name: `${dbData.firstName} ${dbData.lastName || ''}`.trim() || 'Student',
            targetRole: isDemo ? 'Full Stack Java Engineer' : '',
            location: isDemo ? (isAnu ? 'Seattle, WA' : 'Bangalore, India') : '',
            summary: isDemo ? 'Detail-oriented and passionate software engineer with hands-on experience in Java, Spring Boot, and React. Dedicated to building scalable, enterprise-grade applications and continuously expanding technical expertise. Ready to hit the ground running in a dynamic software engineering team.' : '',
            bio: isDemo ? 'I am a highly motivated computer science graduate who thrives on solving complex logic problems and architecting robust backends. I spend my free time exploring new technologies, participating in coding challenges, and contributing to open-source projects.' : '',
            email: isDemo ? `${dbData.firstName.toLowerCase()}@example.com` : '',
            phone: isDemo ? '+91 98765 43210' : '',
            linkedin: isDemo ? `linkedin.com/in/${dbData.firstName.toLowerCase()}dev` : '',
            github: isDemo ? `github.com/${dbData.firstName.toLowerCase()}dev` : '',
            portfolio: isDemo ? `${dbData.firstName.toLowerCase()}.dev` : '',
            academics: { 
              college: isDemo ? 'National Institute of Technology' : '', 
              degree: isDemo ? 'B.Tech in Computer Science' : '', 
              graduationYear: isDemo ? '2026' : '', 
              targetJobRole: isDemo ? 'Software Development Engineer (SDE-1)' : '', 
              careerGoals: isDemo ? 'To grow into a technical architect role within 5 years, specializing in highly scalable distributed systems and cloud-native architecture.' : '' 
            },
            skills: { 
              techStack: isDemo ? ['Java', 'Spring Boot', 'React', 'TailwindCSS', 'MySQL', 'PostgreSQL', 'Docker'] : [], 
              aptitudeStrengths: isDemo ? ['Quantitative Analysis', 'Logical Reasoning', 'Data Interpretation'] : [], 
              interests: isDemo ? ['Cloud Computing', 'System Design', 'AI/ML', 'Microservices'] : [], 
              certifications: isDemo ? ['AWS Cloud Practitioner', 'Oracle Certified Java Programmer'] : [], 
              learningTracks: isDemo ? ['Advanced Data Structures', 'System Design Basics'] : [] 
            },
            progress: {
              quizAverage: `${Math.round(dbData.accuracyToday || (isDemo ? 94 : 0))}%`,
              codingStreak: `${dbData.practiceStreak || (isDemo ? 14 : 0)} Days`,
              badges: isDemo ? ['Consistent Learner', 'Problem Solver', 'Top 5%', 'Fire Learner'] : ['Early Adopter'],
              completedModules: dbData.questionsSolvedToday || (isDemo ? 32 : 0),
              mockInterviews: isDemo ? 4 : 0
            },
            projects: isDemo ? [
              { name: 'SmartThink Hub', description: 'Enterprise-grade placement platform with real-time analytics, AI grading, and secure RBAC.', link: `github.com/${dbData.firstName.toLowerCase()}dev/SmartThink` },
              { name: 'MediSlot', description: 'Healthcare slot booking system featuring role-based dashboards and automated symptom matching.', link: `github.com/${dbData.firstName.toLowerCase()}dev/MediSlot` }
            ] : [],
            resume: { uploaded: isDemo, generated: isDemo }
          };
        }
        
        setProfileData(initialData);
        setEditForm(JSON.parse(JSON.stringify(initialData)));
        setLoading(false);
      } catch (err) {
        console.error("Failed to load profile data", err);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = () => {
    // Save to local storage until backend profile API is ready
    localStorage.setItem('userProfileData', JSON.stringify(editForm));
    setProfileData(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(JSON.parse(JSON.stringify(profileData)));
    setIsEditing(false);
  };

  const handleChange = (e, section, field) => {
    if (section) {
      setEditForm({ ...editForm, [section]: { ...editForm[section], [field]: e.target.value } });
    } else {
      setEditForm({ ...editForm, [e.target.name]: e.target.value });
    }
  };

  const handleArrayAdd = (section, field, value) => {
    if (!value.trim()) return;
    setEditForm({ ...editForm, [section]: { ...editForm[section], [field]: [...editForm[section][field], value.trim()] } });
  };

  const handleArrayRemove = (section, field, index) => {
    const newArr = [...editForm[section][field]];
    newArr.splice(index, 1);
    setEditForm({ ...editForm, [section]: { ...editForm[section], [field]: newArr } });
  };

  const handleProjectAdd = () => {
    setEditForm({ ...editForm, projects: [...editForm.projects, { name: '', description: '', link: '' }] });
  };

  const handleProjectChange = (index, field, value) => {
    const newProjects = [...editForm.projects];
    newProjects[index][field] = value;
    setEditForm({ ...editForm, projects: newProjects });
  };

  const handleProjectRemove = (index) => {
    const newProjects = [...editForm.projects];
    newProjects.splice(index, 1);
    setEditForm({ ...editForm, projects: newProjects });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-secondary font-medium tracking-widest uppercase text-sm">Loading Profile...</p>
        </div>
      </div>
    );
  }

  const p = isEditing ? editForm : profileData;

  const ArrayInput = ({ section, field, items, placeholder }) => {
    const [val, setVal] = useState('');
    return (
      <div className="space-y-2 mt-2">
        <div className="flex flex-wrap gap-2 mb-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1 px-2 py-1 bg-white/10 rounded text-xs text-white">
              {item}
              {isEditing && (
                <X className="w-3 h-3 cursor-pointer hover:text-red-400" onClick={() => handleArrayRemove(section, field, idx)} />
              )}
            </div>
          ))}
        </div>
        {isEditing && (
          <div className="flex gap-2">
            <input 
              type="text" 
              value={val}
              onChange={(e) => setVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleArrayAdd(section, field, val);
                  setVal('');
                }
              }}
              placeholder={placeholder}
              className="flex-1 bg-black/50 border border-white/20 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
            <button 
              type="button"
              onClick={() => {
                handleArrayAdd(section, field, val);
                setVal('');
              }}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded text-white text-sm"
            >
              Add
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-primary font-sans pb-20 relative">
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-indigo-900/30 to-transparent pointer-events-none"></div>

      <header className="border-b border-white/5 p-6 flex justify-between items-center bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4 max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-4 flex-1">
            <Link to="/dashboard" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10">
              <ArrowLeft className="w-5 h-5 text-neutral-300" />
            </Link>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">My Profile</h1>
          </div>
          
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button onClick={handleCancel} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-bold transition-colors">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                  <Save className="w-4 h-4" /> Save Profile
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                <Edit2 className="w-4 h-4" /> Edit Profile
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto w-full p-6 md:p-8 space-y-8 mt-4 relative z-10">
        
        {/* TOP CARD */}
        <div className="bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
          
          <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
            <div className="relative shrink-0">
              <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-fuchsia-600 rounded-full p-1 shadow-xl shadow-indigo-500/20">
                <div className="w-full h-full bg-black rounded-full flex items-center justify-center overflow-hidden">
                   <User className="w-16 h-16 text-neutral-400" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#111] p-1.5 rounded-full border border-white/10">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
            </div>

            <div className="flex-1 w-full">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-3">
                      <input type="text" name="name" value={p.name} onChange={(e) => handleChange(e)} className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-2xl font-black text-white focus:outline-none focus:border-indigo-500" placeholder="Full Name" />
                      <input type="text" name="targetRole" value={p.targetRole} onChange={(e) => handleChange(e)} className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-indigo-400 font-medium focus:outline-none focus:border-indigo-500" placeholder="Target Role (e.g. Full Stack Engineer)" />
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-neutral-500" />
                        <input type="text" name="location" value={p.location} onChange={(e) => handleChange(e)} className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-neutral-400 text-sm focus:outline-none focus:border-indigo-500" placeholder="Location" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-4xl font-black tracking-tight mb-1">{p.name}</h2>
                      <p className="text-xl text-indigo-400 font-medium mb-3">{p.targetRole}</p>
                      <div className="flex items-center gap-2 text-sm text-neutral-400 font-medium">
                        <MapPin className="w-4 h-4 text-neutral-500" /> {p.location}
                      </div>
                    </>
                  )}
                </div>
                
                <div className="bg-black/50 border border-white/10 rounded-2xl p-4 min-w-[200px] shrink-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Profile Completion</span>
                    <span className="text-sm font-black text-emerald-400">{calculateCompletion(p)}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full" style={{ width: `${calculateCompletion(p)}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                {isEditing ? (
                  <textarea name="summary" value={p.summary} onChange={(e) => handleChange(e)} rows={3} className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-neutral-300 text-sm focus:outline-none focus:border-indigo-500 resize-none" placeholder="Professional Summary" />
                ) : (
                  <p className="text-neutral-300 leading-relaxed text-sm md:text-base">
                    {p.summary}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN */}
          <div className="space-y-8 lg:col-span-1">
            
            {/* About and Contact */}
            <div className="bg-[#111] border border-white/10 rounded-3xl p-6 shadow-xl">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
                <User className="w-5 h-5 text-indigo-400" /> About & Contact
              </h3>
              {isEditing ? (
                <textarea name="bio" value={p.bio} onChange={(e) => handleChange(e)} rows={4} className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-neutral-300 text-sm mb-6 focus:outline-none focus:border-indigo-500 resize-none" placeholder="About Me (Bio)" />
              ) : (
                <p className="text-sm text-neutral-400 leading-relaxed mb-6">{p.bio}</p>
              )}
              
              <div className="space-y-4 text-sm font-medium">
                <div className="flex items-center gap-3 text-neutral-300 hover:text-white transition-colors cursor-pointer group">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors shrink-0"><Mail className="w-4 h-4 text-neutral-400 group-hover:text-white" /></div>
                  {isEditing ? <input type="text" name="email" value={p.email} onChange={(e) => handleChange(e)} className="flex-1 bg-black/50 border border-white/20 rounded px-3 py-1.5 focus:outline-none focus:border-indigo-500" placeholder="Email" /> : p.email}
                </div>
                <div className="flex items-center gap-3 text-neutral-300 hover:text-white transition-colors cursor-pointer group">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors shrink-0"><Phone className="w-4 h-4 text-neutral-400 group-hover:text-white" /></div>
                  {isEditing ? <input type="text" name="phone" value={p.phone} onChange={(e) => handleChange(e)} className="flex-1 bg-black/50 border border-white/20 rounded px-3 py-1.5 focus:outline-none focus:border-indigo-500" placeholder="Phone" /> : p.phone}
                </div>
                <div className="flex items-center gap-3 text-neutral-300 hover:text-indigo-400 transition-colors cursor-pointer group">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors shrink-0"><ExternalLink className="w-4 h-4 text-indigo-400" /></div>
                  {isEditing ? <input type="text" name="linkedin" value={p.linkedin} onChange={(e) => handleChange(e)} className="flex-1 bg-black/50 border border-white/20 rounded px-3 py-1.5 focus:outline-none focus:border-indigo-500" placeholder="LinkedIn URL" /> : p.linkedin}
                </div>
                <div className="flex items-center gap-3 text-neutral-300 hover:text-neutral-100 transition-colors cursor-pointer group">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/20 transition-colors shrink-0"><Code2 className="w-4 h-4 text-neutral-300" /></div>
                  {isEditing ? <input type="text" name="github" value={p.github} onChange={(e) => handleChange(e)} className="flex-1 bg-black/50 border border-white/20 rounded px-3 py-1.5 focus:outline-none focus:border-indigo-500" placeholder="GitHub URL" /> : p.github}
                </div>
              </div>
            </div>

            {/* Academic and Career */}
            <div className="bg-[#111] border border-white/10 rounded-3xl p-6 shadow-xl">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
                <GraduationCap className="w-5 h-5 text-fuchsia-400" /> Academics & Goals
              </h3>
              <div className="space-y-5">
                <div>
                  <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">College</div>
                  {isEditing ? <input type="text" value={p.academics.college} onChange={(e) => handleChange(e, 'academics', 'college')} className="w-full bg-black/50 border border-white/20 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500" /> : <div className="text-sm font-bold text-neutral-200">{p.academics.college}</div>}
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Degree & Year</div>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <input type="text" value={p.academics.degree} onChange={(e) => handleChange(e, 'academics', 'degree')} className="flex-1 bg-black/50 border border-white/20 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="Degree" />
                      <input type="text" value={p.academics.graduationYear} onChange={(e) => handleChange(e, 'academics', 'graduationYear')} className="w-24 bg-black/50 border border-white/20 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="Year" />
                    </div>
                  ) : <div className="text-sm font-medium text-neutral-300">{p.academics.degree} (Class of {p.academics.graduationYear})</div>}
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Target Role</div>
                  {isEditing ? <input type="text" value={p.academics.targetJobRole} onChange={(e) => handleChange(e, 'academics', 'targetJobRole')} className="w-full bg-black/50 border border-white/20 rounded px-3 py-1.5 text-sm text-fuchsia-400 focus:outline-none focus:border-indigo-500" /> : <div className="text-sm font-bold text-fuchsia-400">{p.academics.targetJobRole}</div>}
                </div>
                <div className="p-4 bg-fuchsia-500/5 border border-fuchsia-500/10 rounded-xl mt-4">
                  <div className="text-xs font-bold text-fuchsia-300/70 uppercase tracking-wider mb-2">Career Vision</div>
                  {isEditing ? <textarea value={p.academics.careerGoals} onChange={(e) => handleChange(e, 'academics', 'careerGoals')} rows={2} className="w-full bg-black/50 border border-white/20 rounded px-3 py-1.5 text-sm text-fuchsia-100/90 focus:outline-none focus:border-fuchsia-500 resize-none" placeholder="Career Goals" /> : <p className="text-sm text-fuchsia-100/90 italic">{p.academics.careerGoals}</p>}
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-8 lg:col-span-2">
            
            {/* Progress & Achievements */}
            <div className="bg-[#111] border border-white/10 rounded-3xl p-6 shadow-xl overflow-hidden relative">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl"></div>
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white relative z-10">
                <TrendingUp className="w-5 h-5 text-emerald-400" /> Progress & Achievements
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 relative z-10">
                <div className="bg-black/40 border border-white/5 rounded-2xl p-4 text-center hover:bg-black/60 transition-colors">
                  <div className="w-8 h-8 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center mb-2">
                    <Award className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-white mb-1">{p.progress.quizAverage}</div>
                  <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Quiz Avg</div>
                </div>
                <div className="bg-black/40 border border-white/5 rounded-2xl p-4 text-center hover:bg-black/60 transition-colors">
                  <div className="w-8 h-8 mx-auto bg-amber-500/10 rounded-full flex items-center justify-center mb-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-white mb-1">{p.progress.codingStreak}</div>
                  <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Streak</div>
                </div>
                <div className="bg-black/40 border border-white/5 rounded-2xl p-4 text-center hover:bg-black/60 transition-colors">
                  <div className="w-8 h-8 mx-auto bg-indigo-500/10 rounded-full flex items-center justify-center mb-2">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-black text-white mb-1">{p.progress.completedModules}</div>
                  <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Modules Done</div>
                </div>
                <div className="bg-black/40 border border-white/5 rounded-2xl p-4 text-center hover:bg-black/60 transition-colors">
                  <div className="w-8 h-8 mx-auto bg-rose-500/10 rounded-full flex items-center justify-center mb-2">
                    <User className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="text-2xl font-black text-white mb-1">{p.progress.mockInterviews}</div>
                  <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Mock Intvs</div>
                </div>
              </div>

              <div className="relative z-10">
                <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Earned Badges</div>
                <div className="flex flex-wrap gap-2">
                  {p.progress.badges.map((badge, i) => (
                    <div key={i} className="px-3 py-1.5 bg-gradient-to-r from-neutral-800 to-neutral-900 border border-neutral-700 rounded-lg text-xs font-bold text-amber-400 flex items-center gap-1.5 shadow-sm">
                      <Star className="w-3 h-3 fill-amber-400" /> {badge}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Skills & Learning */}
            <div className="bg-[#111] border border-white/10 rounded-3xl p-6 shadow-xl">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
                <Code2 className="w-5 h-5 text-blue-400" /> Skills & Expertise
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Tech Stack</div>
                  <ArrayInput section="skills" field="techStack" items={p.skills.techStack} placeholder="Add a skill (e.g. React)" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Aptitude Strengths</div>
                    <ArrayInput section="skills" field="aptitudeStrengths" items={p.skills.aptitudeStrengths} placeholder="Add a strength" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Interests & Tracks</div>
                    <ArrayInput section="skills" field="interests" items={p.skills.interests} placeholder="Add an interest" />
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Certifications</div>
                  <ArrayInput section="skills" field="certifications" items={p.skills.certifications} placeholder="Add a certification" />
                </div>
              </div>
            </div>

            {/* Resume & Projects */}
            <div className="bg-[#111] border border-white/10 rounded-3xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                  <Briefcase className="w-5 h-5 text-rose-400" /> Resume & Projects
                </h3>
                {isEditing && (
                  <button onClick={handleProjectAdd} className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                    <Plus className="w-4 h-4" /> Add Project
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-black/40 border border-white/5 rounded-2xl p-5 flex items-start gap-4">
                  <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-rose-400" />
                  </div>
                  <div>
                    <div className="font-bold text-white mb-1">Smart Resume</div>
                    <p className="text-xs text-neutral-400 mb-3">Generated by SmartThink based on your profile.</p>
                    <Link to="/resume" className="text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors">View / Edit Resume &rarr;</Link>
                  </div>
                </div>
                
                <div className="bg-black/40 border border-white/5 rounded-2xl p-5 flex flex-col justify-center border-dashed group hover:border-white/20 transition-colors cursor-pointer">
                   <div className="text-center">
                      <FileText className="w-6 h-6 text-neutral-500 mx-auto mb-2 group-hover:text-neutral-400 transition-colors" />
                      <div className="text-sm font-bold text-neutral-300">Upload Custom Resume</div>
                      <div className="text-xs text-neutral-500 mt-1">PDF max 5MB</div>
                   </div>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Highlighted Projects</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {p.projects.map((proj, i) => (
                    <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group relative">
                      {isEditing && (
                        <button onClick={() => handleProjectRemove(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                      <div className="flex justify-between items-start mb-2">
                        {isEditing ? (
                          <div className="flex flex-col gap-2 w-full">
                            <input type="text" value={proj.name} onChange={(e) => handleProjectChange(i, 'name', e.target.value)} className="w-full bg-black/50 border border-white/20 rounded px-2 py-1 text-sm font-bold text-white focus:outline-none focus:border-indigo-500" placeholder="Project Name" />
                            <input type="text" value={proj.link} onChange={(e) => handleProjectChange(i, 'link', e.target.value)} className="w-full bg-black/50 border border-white/20 rounded px-2 py-1 text-xs text-indigo-400 focus:outline-none focus:border-indigo-500" placeholder="Project Link" />
                            <textarea value={proj.description} onChange={(e) => handleProjectChange(i, 'description', e.target.value)} className="w-full bg-black/50 border border-white/20 rounded px-2 py-1 text-xs text-neutral-400 focus:outline-none focus:border-indigo-500 resize-none" rows="2" placeholder="Description" />
                          </div>
                        ) : (
                          <>
                            <div className="font-bold text-sm text-neutral-200 group-hover:text-white">{proj.name}</div>
                            <ExternalLink className="w-4 h-4 text-neutral-500 group-hover:text-indigo-400 transition-colors" />
                          </>
                        )}
                      </div>
                      {!isEditing && <p className="text-xs text-neutral-400">{proj.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
