import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CheckCircle2, XCircle, Timer, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function AptitudeQuiz() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);

  const isMock = window.location.pathname.includes('/mock');

  useEffect(() => {
    const fetchQuestions = async () => {
      const token = localStorage.getItem('token');
      try {
        let url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/aptitude/questions`;
        if (topicId) url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/aptitude/topics/${topicId}/practice`;
        if (isMock) url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/aptitude/mock`;
        
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (isMock) {
          setQuestions(res.data.questions);
          setTimeLeft(res.data.config.totalDurationMinutes * 60);
        } else {
          setQuestions(res.data);
          if (res.data.length > 0) {
            setTimeLeft(res.data.length * 60); // 1 minute per question
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [topicId, isMock]);

  useEffect(() => {
    if (timeLeft <= 0 || submitted || loading || questions.length === 0) return;
    const timerId = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerId);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, submitted, loading, questions.length]);

  const handleSelect = (option) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questions[currentIdx].id]: option
    }));
  };

  const handleFlag = () => {
    if (submitted) return;
    setFlagged(prev => ({
      ...prev,
      [questions[currentIdx].id]: !prev[questions[currentIdx].id]
    }));
  };

  const handleClear = () => {
    if (submitted) return;
    setSelectedAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[questions[currentIdx].id];
      return newAnswers;
    });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    try {
      const submitUrl = isMock ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/aptitude/submit?mode=MOCK` : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/aptitude/submit?mode=PRACTICE_ONLY`;
      const res = await axios.post(submitUrl, selectedAnswers, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResult(res.data);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-secondary">Loading Practice Module...</div>;
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-secondary p-6">
        <AlertCircle className="w-12 h-12 mb-4 text-neutral-600" />
        <h2 className="text-xl text-primary mb-2">No Questions Available</h2>
        <p className="mb-6 text-center">There are no practice questions uploaded for this topic yet.</p>
        <Link to="/aptitude" className="px-6 py-3 bg-surface-elevated text-primary rounded-lg hover:bg-neutral-700 transition-colors">Back to Hub</Link>
      </div>
    );
  }

  const currentQ = questions[currentIdx];

  return (
    <div className="min-h-screen bg-background text-primary font-sans flex flex-col relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

      {/* Header */}
      <header className="border-b border-border p-6 flex justify-between items-center relative z-10 bg-background/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link to="/aptitude" className="p-2 bg-surface border border-border hover:bg-surface-elevated rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Practice Mode</h1>
            <p className="text-sm text-secondary">Question {currentIdx + 1} of {questions.length}</p>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 bg-surface border rounded-full font-mono font-bold ${timeLeft < 60 ? 'text-red-400 border-red-500/50 animate-pulse' : 'text-indigo-400 border-border'}`}>
          <Timer className="w-4 h-4" /> 
          {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{Math.floor(timeLeft % 60).toString().padStart(2, '0')}
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        
        {/* Left Content Area */}
        <main className="flex-1 max-w-4xl mx-auto p-6 md:p-10 flex flex-col overflow-y-auto">
          {/* Question Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className={`inline-block px-3 py-1 border rounded-md text-xs font-bold ${
                currentQ.difficulty === 'EASY' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-500/30' :
                currentQ.difficulty === 'HARD' ? 'bg-red-950/30 text-red-400 border-red-500/30' :
                'bg-orange-950/30 text-orange-400 border-orange-500/30'
              }`}>
                {currentQ.difficulty || 'MEDIUM'}
              </span>
              
              {!submitted && (
                <div className="flex gap-2">
                  <button onClick={handleFlag} className={`px-4 py-1.5 rounded-lg text-sm font-bold border transition-colors ${flagged[currentQ.id] ? 'bg-orange-500/20 text-orange-400 border-orange-500/50' : 'bg-surface text-secondary border-border-strong hover:text-primary'}`}>
                    {flagged[currentQ.id] ? 'Unflag' : 'Flag for Review'}
                  </button>
                  <button onClick={handleClear} className="px-4 py-1.5 rounded-lg text-sm font-bold bg-surface text-secondary border border-border-strong hover:text-primary transition-colors">
                    Clear Response
                  </button>
                </div>
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold leading-tight">{currentQ.questionText}</h2>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-12 flex-1">
            {['A', 'B', 'C', 'D'].map((opt) => {
              const isSelected = selectedAnswers[currentQ.id] === opt;
              const isCorrect = submitted && currentQ.correctOption === opt;
              const isWrongAndSelected = submitted && isSelected && !isCorrect;

              let borderClass = "border-border hover:border-indigo-500/50 hover:bg-indigo-950/30";
              if (isSelected) borderClass = "border-indigo-500 bg-indigo-950/50 ring-1 ring-indigo-500";
              if (submitted) {
                if (isCorrect) borderClass = "border-emerald-500 bg-emerald-950/50 ring-1 ring-emerald-500";
                else if (isWrongAndSelected) borderClass = "border-red-500 bg-red-950/50 ring-1 ring-red-500";
                else borderClass = "border-border opacity-50";
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  disabled={submitted}
                  className={`w-full text-left p-5 rounded-2xl border transition-all flex items-center justify-between group ${borderClass}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm transition-colors ${
                      isSelected || isCorrect || isWrongAndSelected 
                        ? 'bg-transparent text-primary' 
                        : 'bg-surface-elevated text-secondary group-hover:bg-neutral-700'
                    }`}>
                      {opt}
                    </div>
                    <span className="text-lg">{currentQ[`option${opt}`]}</span>
                  </div>
                  {submitted && isCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                  {submitted && isWrongAndSelected && <XCircle className="w-6 h-6 text-red-500" />}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {submitted && currentQ.explanation && (
            <div className="mb-10 p-6 bg-indigo-950/20 border border-indigo-500/20 rounded-2xl animate-fade-in">
              <h4 className="text-indigo-400 font-bold mb-2">Explanation</h4>
              <p className="text-primary-muted leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {/* Footer Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-border mt-auto">
            <button
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="px-6 py-3 font-medium text-secondary hover:text-primary disabled:opacity-30 transition-colors"
            >
              Previous
            </button>
            
            <div className="flex gap-4">
              {!submitted && (
                <button
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-primary font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all"
                >
                  Submit Test
                </button>
              )}
              {currentIdx < questions.length - 1 && (
                <button
                  onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                  className="flex items-center gap-2 px-8 py-3 bg-white text-black hover:bg-neutral-200 font-bold rounded-xl transition-colors"
                >
                  Next <ArrowRight className="w-5 h-5" />
                </button>
              )}
              {submitted && (
                <Link
                  to="/aptitude"
                  className="flex items-center gap-2 px-8 py-3 bg-surface-elevated hover:bg-neutral-700 text-primary font-bold rounded-xl transition-colors"
                >
                  Exit Review
                </Link>
              )}
            </div>
          </div>
        </main>

        {/* Right Sidebar: Question Palette */}
        <aside className="w-80 border-l border-border bg-surface/30 p-6 hidden lg:flex flex-col overflow-y-auto">
          <h3 className="font-bold mb-4 text-primary">Question Palette</h3>
          <div className="grid grid-cols-5 gap-2 mb-8">
            {questions.map((q, idx) => {
              let bg = "bg-surface-elevated text-secondary border-transparent hover:bg-neutral-700";
              if (selectedAnswers[q.id]) bg = "bg-emerald-500/20 border-emerald-500/50 text-emerald-400";
              if (flagged[q.id]) bg = "bg-orange-500/20 border-orange-500/50 text-orange-400";
              
              let ring = currentIdx === idx ? "ring-2 ring-white ring-offset-2 ring-offset-neutral-950" : "";
              
              if (submitted) {
                const isCorrect = q.correctOption === selectedAnswers[q.id];
                const isAnswered = !!selectedAnswers[q.id];
                if (isAnswered && isCorrect) bg = "bg-emerald-500 text-primary border-emerald-600";
                else if (isAnswered && !isCorrect) bg = "bg-red-500 text-primary border-red-600";
                else bg = "bg-surface-elevated text-muted opacity-50";
              }

              return (
                <button 
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)} 
                  className={`w-full aspect-square rounded-lg border flex items-center justify-center font-bold text-sm transition-all ${bg} ${ring}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="mt-auto space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/50"></div>
              <span className="text-secondary">Answered</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-orange-500/20 border border-orange-500/50"></div>
              <span className="text-secondary">Flagged</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-surface-elevated"></div>
              <span className="text-secondary">Not Answered</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Result Overlay (pops up right after submission) */}
      {submitted && result && currentIdx === questions.length - 1 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <div className="bg-surface border border-border p-8 rounded-3xl shadow-2xl shadow-black max-w-sm w-full text-center animate-bounce-in pointer-events-auto">
            <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl font-bold text-indigo-400">{Math.round(result.percentage)}%</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Test Completed!</h3>
            <p className="text-secondary mb-6">You scored {result.score} out of {result.maxPossibleScore} total points.</p>
            <button 
              onClick={() => setResult(null)}
              className="w-full py-3 bg-surface-elevated hover:bg-neutral-700 text-primary font-bold rounded-xl transition-colors"
            >
              Review Answers
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
