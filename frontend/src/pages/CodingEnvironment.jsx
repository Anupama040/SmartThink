import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, CheckCircle, XCircle, Terminal, Maximize2, Loader2 } from 'lucide-react';
import axios from 'axios';
import Editor from '@monaco-editor/react';

export default function CodingEnvironment() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [language, setLanguage] = useState('java');
  const [code, setCode] = useState('');
  
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState(null);
  
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProblem = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`http://localhost:8080/api/coding/problems/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProblem(res.data);
        setCode(res.data.skeletonCodeJava); // Default
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    if (problem) {
      if (lang === 'java') setCode(problem.skeletonCodeJava || '');
      if (lang === 'python') setCode(problem.skeletonCodePython || '');
      if (lang === 'cpp') setCode(problem.skeletonCodeCpp || '');
    }
  };

  const handleRunCode = async () => {
    setExecuting(true);
    setResult(null);
    setActiveTab('console');
    const token = localStorage.getItem('token');
    
    try {
      const res = await axios.post(`http://localhost:8080/api/coding/problems/${id}/submit`, {
        code,
        language
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setResult({ passed: false, status: "System Error", output: err.message });
    } finally {
      setExecuting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-primary"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;
  if (!problem) return <div className="min-h-screen bg-background flex items-center justify-center text-primary">Problem not found.</div>;

  return (
    <div className="h-screen bg-background text-primary flex flex-col font-sans overflow-hidden">
      {/* Top Navbar */}
      <header className="h-14 border-b border-border bg-surface flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/coding" className="text-secondary hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="font-bold text-lg flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-500" />
            {problem.title}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button onClick={() => handleRunCode()} disabled={executing} className="px-4 py-1.5 bg-surface-elevated hover:bg-neutral-700 text-primary rounded-lg flex items-center gap-2 font-medium transition-colors disabled:opacity-50 text-sm">
              <Play className="w-4 h-4 text-emerald-500" /> Run
            </button>
            <button onClick={() => handleRunCode()} disabled={executing} className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-primary rounded-lg flex items-center gap-2 font-bold transition-colors disabled:opacity-50 text-sm shadow-lg shadow-emerald-500/20">
              Submit
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout - Split View */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Pane: Description & Test Cases */}
        <div className="w-[40%] flex flex-col border-r border-border bg-background">
          <div className="flex border-b border-border bg-surface shrink-0">
            <button onClick={() => setActiveTab('description')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'description' ? 'border-emerald-500 text-emerald-400 bg-surface-elevated/50' : 'border-transparent text-secondary hover:text-primary hover:bg-surface-elevated/30'}`}>Description</button>
            <button onClick={() => setActiveTab('console')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'console' ? 'border-emerald-500 text-emerald-400 bg-surface-elevated/50' : 'border-transparent text-secondary hover:text-primary hover:bg-surface-elevated/30'}`}>Execution Console</button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {activeTab === 'description' && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    problem.difficulty === 'EASY' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                    problem.difficulty === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                    'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {problem.difficulty}
                  </span>
                </div>
                
                <div className="prose prose-invert prose-emerald max-w-none mb-8 whitespace-pre-wrap">
                  {problem.description}
                </div>

                <div className="space-y-6">
                  <h3 className="font-bold text-lg border-b border-border pb-2">Examples</h3>
                  {problem.sampleTestCases?.map((tc, i) => (
                    <div key={tc.id} className="bg-surface border border-border rounded-xl p-4 font-mono text-sm">
                      <div className="mb-2"><span className="text-muted">Input:</span> <span className="text-emerald-300">{tc.inputData}</span></div>
                      <div><span className="text-muted">Output:</span> <span className="text-indigo-300">{tc.expectedOutput}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'console' && (
              <div className="animate-fade-in h-full flex flex-col">
                {executing ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-muted space-y-4">
                    <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
                    <p className="font-mono text-sm">Executing against Judge0 Container...</p>
                  </div>
                ) : result ? (
                  <div className="flex-1">
                    <div className={`text-2xl font-bold mb-6 flex items-center gap-3 ${result.passed ? 'text-emerald-500' : 'text-red-500'}`}>
                      {result.passed ? <CheckCircle className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                      {result.status}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-surface border border-border rounded-xl p-4">
                        <div className="text-xs text-muted uppercase tracking-wider mb-1">Test Cases</div>
                        <div className="text-xl font-bold font-mono">
                          <span className={result.testCasesPassed === result.totalTestCases ? 'text-emerald-400' : 'text-red-400'}>
                            {result.testCasesPassed}
                          </span> / {result.totalTestCases}
                        </div>
                      </div>
                      <div className="bg-surface border border-border rounded-xl p-4">
                        <div className="text-xs text-muted uppercase tracking-wider mb-1">Runtime</div>
                        <div className="text-xl font-bold font-mono text-primary-muted">{result.executionTimeMs}</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-muted mb-1">Standard Output</div>
                        <div className="bg-[#1e1e1e] p-4 rounded-xl border border-border font-mono text-sm text-primary-muted whitespace-pre-wrap overflow-x-auto">
                          {result.output || 'No output'}
                        </div>
                      </div>
                      
                      {!result.passed && result.expectedOutput && (
                        <div>
                          <div className="text-sm text-muted mb-1">Expected Output</div>
                          <div className="bg-[#1e1e1e] p-4 rounded-xl border border-border font-mono text-sm text-emerald-400 whitespace-pre-wrap overflow-x-auto">
                            {result.expectedOutput}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-neutral-600">
                    <Terminal className="w-16 h-16 mb-4 opacity-50" />
                    <p>Run your code to see the output here.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Editor */}
        <div className="w-[60%] flex flex-col bg-[#1e1e1e]">
          <div className="h-10 border-b border-border bg-[#2d2d2d] flex items-center justify-between px-4 shrink-0">
            <select 
              value={language}
              onChange={handleLanguageChange}
              className="bg-transparent text-primary-muted text-sm font-medium focus:outline-none cursor-pointer"
            >
              <option value="java" className="bg-surface-elevated">Java</option>
              <option value="python" className="bg-surface-elevated">Python</option>
              <option value="cpp" className="bg-surface-elevated">C++</option>
            </select>
            <Maximize2 className="w-4 h-4 text-muted hover:text-primary cursor-pointer transition-colors" />
          </div>
          
          <div className="flex-1">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value)}
              options={{
                minimap: { enabled: false },
                fontSize: 15,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                lineHeight: 24,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on"
              }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
