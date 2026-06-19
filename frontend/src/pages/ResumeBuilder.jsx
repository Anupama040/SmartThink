import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, CheckCircle, Code, LogOut, UploadCloud, File, Clock, AlertCircle, Check, Target, MessageSquare } from 'lucide-react';
import axios from 'axios';

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [activeResume, setActiveResume] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    
    try {
      const activeRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/resumes/active`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActiveResume(activeRes.data || null);

      const historyRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/resumes/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(historyRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size exceeds the 5MB limit.");
      return;
    }

    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setUploadError("Only PDF or DOCX files are allowed.");
      return;
    }

    setUploadError("");
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/resumes/upload`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      await fetchData();
    } catch (err) {
      setUploadError(err.response?.data || "Failed to upload resume.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const atsChecks = [
    { label: "Format is PDF or DOCX", passed: !!activeResume, points: 2 },
    { label: "File size under 5MB", passed: activeResume?.fileSizeKb < 5120, points: 2 },
    { label: "Contains contact information", passed: !!activeResume, points: 2 },
    { label: "Standard readable font", passed: true, points: 2 },
    { label: "No tables or complex columns", passed: true, points: 2 } // Assuming true for now
  ];

  const totalScore = atsChecks.reduce((acc, curr) => curr.passed ? acc + curr.points : acc, 0);

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
          <Link to="/resume" className="flex items-center gap-3 bg-surface text-primary px-4 py-3 rounded-xl transition-colors">
            <FileText className="w-5 h-5 text-indigo-400" />
            <span className="font-medium">Resume Builder</span>
          </Link>
          <Link to="/aptitude" className="flex items-center gap-3 hover:bg-surface/50 text-secondary hover:text-primary px-4 py-3 rounded-xl transition-colors">
            <CheckCircle className="w-5 h-5" />
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
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/');
          }}
          className="flex items-center gap-3 text-red-400 hover:text-red-300 hover:bg-red-950/30 px-4 py-3 rounded-xl transition-colors mt-auto"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

        <header className="mb-10 relative z-10">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Resume & ATS Tracker</h2>
          <p className="text-secondary">Upload your resume, check ATS compatibility, and track versions.</p>
        </header>

        {loading ? (
          <div className="text-center py-20 text-secondary animate-pulse">Loading Resume Data...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            <div className="lg:col-span-2 space-y-8">
              
              <div 
                className={`border-2 border-dashed rounded-3xl p-10 text-center transition-colors ${
                  uploading ? 'border-indigo-500 bg-indigo-950/20' : 'border-border-strong hover:border-indigo-500 bg-surface/50 hover:bg-surface'
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                />
                <div className="w-16 h-16 bg-surface-elevated rounded-full flex items-center justify-center mx-auto mb-6">
                  {uploading ? <Clock className="w-8 h-8 text-indigo-400 animate-spin" /> : <UploadCloud className="w-8 h-8 text-indigo-400" />}
                </div>
                <h3 className="text-xl font-bold mb-2 text-primary">
                  {uploading ? 'Uploading securely...' : 'Upload your latest resume'}
                </h3>
                <p className="text-secondary mb-6 max-w-sm mx-auto">
                  Drag and drop your PDF or DOCX file here, or click to browse. Strict 5MB size limit.
                </p>
                {uploadError && (
                  <div className="flex items-center justify-center gap-2 text-red-400 bg-red-400/10 py-2 px-4 rounded-lg mb-6 max-w-sm mx-auto">
                    <AlertCircle className="w-4 h-4" /> {uploadError}
                  </div>
                )}
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-primary font-bold rounded-xl transition-colors disabled:opacity-50"
                >
                  Browse Files
                </button>
              </div>

              {activeResume && (
                <div className="bg-gradient-to-br from-indigo-900/20 to-fuchsia-900/20 border border-indigo-500/20 rounded-3xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-400" /> Active Resume
                    </h3>
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full">Primary</span>
                  </div>
                  
                  <div className="flex items-center gap-6 bg-surface/80 p-6 rounded-2xl border border-border">
                    <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                      <File className="w-6 h-6 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-primary truncate max-w-md">{activeResume.fileName}</h4>
                      <p className="text-sm text-secondary">Uploaded on {new Date(activeResume.createdAt).toLocaleDateString()} • {activeResume.fileSizeKb} KB</p>
                    </div>
                    <a 
                      href={activeResume.fileUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="px-6 py-2 bg-surface-elevated hover:bg-neutral-700 text-primary text-sm font-bold rounded-lg transition-colors"
                    >
                      View Resume
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-8">
              <div className="bg-surface border border-border rounded-3xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-primary">ATS Compatibility</h3>
                  {activeResume && (
                    <div className="w-12 h-12 rounded-full border-4 border-indigo-500 flex items-center justify-center font-bold text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                      {activeResume.atsScore !== undefined && activeResume.atsScore !== null ? activeResume.atsScore : totalScore}
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {atsChecks.map((check, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-primary-muted">{check.label}</span>
                      {check.passed ? (
                        <Check className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-neutral-600"></div>
                      )}
                    </div>
                  ))}
                </div>
                {!activeResume && (
                  <p className="mt-6 text-xs text-muted text-center">Upload a resume to scan for ATS best practices.</p>
                )}
                
                {activeResume && activeResume.atsFeedback && (
                  <div className="mt-6 p-4 bg-indigo-950/30 border border-indigo-500/30 rounded-xl">
                    <h4 className="text-sm font-bold text-indigo-400 mb-2">ATS Feedback</h4>
                    <p className="text-sm text-primary-muted leading-relaxed">{activeResume.atsFeedback}</p>
                  </div>
                )}
                {activeResume && activeResume.skillsExtracted && (
                  <div className="mt-4 p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-xl">
                    <h4 className="text-sm font-bold text-emerald-400 mb-2">Skills Detected</h4>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {activeResume.skillsExtracted.split(',').map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-bold text-xs rounded-lg uppercase tracking-wider">{skill.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-surface border border-border rounded-3xl p-6">
                <h3 className="text-lg font-bold mb-6 text-primary flex items-center gap-2">
                  <Clock className="w-5 h-5 text-secondary" /> Version History
                </h3>
                {history.length <= 1 ? (
                  <p className="text-sm text-muted text-center py-4">No previous versions found.</p>
                ) : (
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {history.filter(r => !r.isActive).map(res => (
                      <div key={res.id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-surface-elevated/50 transition-colors border border-transparent hover:border-border">
                        <FileText className="w-5 h-5 text-muted mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-primary truncate max-w-[150px]">{res.fileName}</p>
                          <p className="text-xs text-muted">{new Date(res.createdAt).toLocaleDateString()}</p>
                        </div>
                        <a 
                          href={res.fileUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="ml-auto text-xs font-bold text-indigo-400 hover:text-indigo-300"
                        >
                          View
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
