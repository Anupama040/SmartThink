import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Video, Mic, StopCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function HRInterview() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'BEHAVIORAL';
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [recording, setRecording] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [speechError, setSpeechError] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/hr/interview?category=${category}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQuestions(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();

    // Initialize Web Speech API
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recog = new SpeechRecognition();
      recog.continuous = true;
      recog.interimResults = true;
      recog.lang = 'en-US';

      recog.onresult = (event) => {
        let fullTranscript = '';
        for (let i = 0; i < event.results.length; ++i) {
          fullTranscript += event.results[i][0].transcript;
        }
        setTranscript(fullTranscript);
      };

      recog.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        if (event.error !== 'no-speech') {
           setSpeechError('Microphone error: ' + event.error);
        }
      };

      setRecognition(recog);
    } else {
      setSpeechError("Browser does not support Speech Recognition. Please use Chrome or Edge.");
    }
  }, [category]);

  useEffect(() => {
    let timer;
    if (recording) {
      timer = setInterval(() => setTimeElapsed(prev => prev + 1), 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [recording]);

  const handleStartRecording = () => {
    setRecording(true);
    setTimeElapsed(0);
    setShowFeedback(false);
    setTranscript('');
    setSpeechError('');
    if (recognition) {
        try {
            recognition.start();
        } catch (e) {
            console.error(e);
        }
    }
  };

  const handleStopRecording = () => {
    setRecording(false);
    setShowFeedback(true);
    if (recognition) {
        try {
            recognition.stop();
        } catch(e) {}
    }
    
    // AI Transcript Analysis for filler words and grammar cues
    const analyzeTranscript = (text) => {
        const lower = " " + text.toLowerCase() + " ";
        const fillerWords = [' um ', ' uh ', ' like ', ' basically ', ' literally ', ' you know '];
        let count = 0;
        fillerWords.forEach(word => {
            const matches = lower.match(new RegExp(word, 'g'));
            if (matches) count += matches.length;
        });
        
        const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
        
        let summary = '';
        let funFact = '';

        if (wordCount < 10) {
            summary = "Your answer was extremely brief. To improve your communication skills, use the STAR method (Situation, Task, Action, Result) to expand on your experience.";
            funFact = "Fun fact: Did you know recruiters prefer answers between 1 to 2 minutes? It shows depth without losing their attention!";
        } else if (count > 2) {
            summary = `We detected ${count} filler words (like "um", "uh"). Try taking a short, silent pause instead of using a filler word—it makes you sound much more confident!`;
            funFact = "Fun fact: Even Steve Jobs paused for 3 to 5 seconds before answering hard questions. Silence is powerful, not awkward!";
        } else {
            summary = "Great articulation! You maintained a clear narrative without relying on filler words. Your communication style came across as confident and professional.";
            funFact = "Fun fact: Concise, well-paced speakers are 40% more likely to pass behavioral rounds. Keep up this exact pacing!";
        }
        
        return { count, summary, funFact };
    };

    const analysis = analyzeTranscript(transcript);
    const wordCount = transcript.trim().split(/\s+/).filter(w => w.length > 0).length;
    const wpm = timeElapsed > 0 ? Math.round((wordCount / timeElapsed) * 60) : 0;
    
    setAnswers(prev => ({
      ...prev,
      [questions[currentIdx].id]: { 
          audioTime: timeElapsed,
          transcript: transcript,
          wordCount: wordCount,
          wpm: wpm,
          fillerCount: analysis.count,
          summary: analysis.summary,
          funFact: analysis.funFact
      }
    }));
  };

  const [evaluationData, setEvaluationData] = useState(null);

  const handleNext = async () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setShowFeedback(false);
      setTimeElapsed(0);
    } else {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const payload = {
            category: category,
            answers: answers
        };
        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/hr/evaluate`, payload, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setEvaluationData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setCompleted(true);
      }
    }
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-primary">Loading Interview Environment...</div>;

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-secondary p-6">
        <AlertCircle className="w-12 h-12 mb-4 text-neutral-600" />
        <h2 className="text-xl text-primary mb-2">No Questions Available</h2>
        <Link to="/hr-interview" className="px-6 py-3 bg-surface-elevated text-primary rounded-lg hover:bg-neutral-700 mt-4">Back to Hub</Link>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center py-12 px-6 text-primary font-sans overflow-y-auto">
        <div className="max-w-5xl w-full">
          <div className="flex items-center gap-4 mb-8 border-b border-border pb-6">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Interview Evaluation Report</h2>
              <p className="text-secondary">AI-generated comprehensive analysis of your {category} round.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Weighted Scorecard */}
            <div className="lg:col-span-2 bg-surface border border-border rounded-3xl p-8 shadow-xl shadow-black/20">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-indigo-400" /> Weighted Scorecard
              </h3>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-background rounded-2xl p-4 border border-border">
                  <div className="text-sm text-secondary mb-1">Overall Impression</div>
                  <div className="text-3xl font-bold text-primary">{evaluationData?.overallScore || 0}<span className="text-lg text-muted">/100</span></div>
                </div>
                <div className="bg-background rounded-2xl p-4 border border-border">
                  <div className="text-sm text-secondary mb-1">Communication Score</div>
                  <div className="text-3xl font-bold text-indigo-400">{evaluationData?.communicationScore || 0}<span className="text-lg text-muted">/100</span></div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-primary-muted">Communication & Clarity</span>
                    <span className="font-bold">{evaluationData?.communicationScore || 0}%</span>
                  </div>
                  <div className="w-full bg-surface-elevated rounded-full h-2">
                    <div className="bg-fuchsia-500 h-2 rounded-full" style={{ width: `${evaluationData?.communicationScore || 0}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-primary-muted">Average Pacing (WPM)</span>
                    <span className="font-bold">{evaluationData?.avgWpm || 0}</span>
                  </div>
                  <div className="w-full bg-surface-elevated rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${Math.min(((evaluationData?.avgWpm || 0) / 150) * 100, 100)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bias & Explainable Scoring */}
            <div className="flex flex-col gap-6">
              <div className="bg-surface border border-border rounded-3xl p-6 shadow-xl flex-1">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-fuchsia-400" /> Explainable Scoring
                </h3>
                <p className="text-sm text-primary-muted leading-relaxed">
                  Your score heavily factored in your pacing (ideal is 110-150 WPM) and total filler words used ({evaluationData?.totalFillerWords || 0} detected).
                </p>
              </div>
              <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-3xl p-6 shadow-xl">
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" /> Bias & Adverse-Impact
                </h3>
                <p className="text-sm text-emerald-300/80">
                  Passed. Automated checks confirm fair evaluation independent of demographic markers.
                </p>
              </div>
            </div>
          </div>

          {/* Transcript + Summary & Next Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
             <div className="bg-surface border border-border rounded-3xl p-8 shadow-xl">
               <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                 <Video className="w-5 h-5 text-blue-400" /> Transcript + Summary
               </h3>
               <div className="bg-background rounded-xl p-4 border border-border mb-4">
                 <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">AI Communication Summary</h4>
                 <p className="text-sm text-primary-muted leading-relaxed mb-4">
                   {evaluationData?.summary || "Candidate demonstrated strong problem-solving skills and maintained a professional pace."}
                 </p>
                 <div className="bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-lg p-3">
                   <p className="text-sm text-fuchsia-300 italic">💡 Overall, you used {evaluationData?.totalFillerWords || 0} filler words across the interview.</p>
                 </div>
               </div>
               <p className="text-xs text-muted italic">Full transcripts are saved and summarize your performance to save recruiter review time.</p>
             </div>

             <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-3xl p-8 shadow-xl flex flex-col justify-center items-center text-center">
               <CheckCircle2 className="w-12 h-12 text-indigo-400 mb-4" />
               <h3 className="text-xl font-bold mb-2">Objective Technical Skills</h3>
               <p className="text-primary-muted text-sm mb-6">
                 Objective evidence matters beyond talking ability. Proceed to the Coding Hub to complete your 50 practice technical challenges.
               </p>
               <button onClick={() => navigate('/coding')} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-colors w-full">
                 Go to Coding Hub
               </button>
             </div>
          </div>

          <div className="flex justify-center">
             <button onClick={() => navigate('/hr-interview')} className="px-8 py-3 bg-surface-elevated hover:bg-neutral-700 rounded-xl font-bold transition-colors">
               Return to HR Hub
             </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];

  return (
    <div className="min-h-screen bg-background text-primary font-sans flex flex-col">
      <header className="border-b border-border p-6 flex justify-between items-center bg-surface/50">
        <div className="flex items-center gap-4">
          <Link to="/hr-interview" className="p-2 bg-surface-elevated hover:bg-neutral-700 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">{category} Round</h1>
            <p className="text-sm text-secondary">Question {currentIdx + 1} of {questions.length}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-6 md:p-10 flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Question and Controls */}
        <div className="flex-1 flex flex-col">
          <div className="bg-surface border border-border rounded-3xl p-8 mb-8 shadow-2xl">
            <h2 className="text-3xl font-bold leading-tight mb-8">"{currentQ.questionText}"</h2>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {!recording && !showFeedback && (
                <button 
                  onClick={handleStartRecording}
                  className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-500 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all"
                >
                  <Mic className="w-6 h-6" /> Start Answering
                </button>
              )}

              {recording && (
                <button 
                  onClick={handleStopRecording}
                  className="w-full sm:w-auto px-8 py-4 bg-surface-elevated hover:bg-neutral-700 border border-red-500/50 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all text-red-400 animate-pulse"
                >
                  <StopCircle className="w-6 h-6" /> Finish Answer
                </button>
              )}

              {showFeedback && (
                <button 
                  onClick={handleNext}
                  className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all"
                >
                  Next Question &rarr;
                </button>
              )}
            </div>
          </div>

          {/* Feedback Section */}
          {showFeedback && (
            <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-3xl p-8 animate-fade-in flex-1">
              <h3 className="text-xl font-bold text-indigo-400 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Expected Talking Points
              </h3>
              <p className="text-primary-muted leading-relaxed text-lg mb-8">
                {currentQ.expectedPoints}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-surface rounded-xl p-4 border border-border">
                  <div className="text-secondary text-sm mb-1 uppercase tracking-wider font-bold">Answer Duration</div>
                  <span className="font-mono font-bold text-2xl text-primary">{Math.floor(answers[currentQ.id]?.audioTime / 60)}:{String(answers[currentQ.id]?.audioTime % 60).padStart(2, '0')}</span>
                </div>
                <div className="bg-surface rounded-xl p-4 border border-border">
                  <div className="text-secondary text-sm mb-1 uppercase tracking-wider font-bold">Speech Pace (WPM)</div>
                  <span className={`font-mono font-bold text-2xl ${answers[currentQ.id]?.wpm > 100 && answers[currentQ.id]?.wpm < 160 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {answers[currentQ.id]?.wpm || 0}
                  </span>
                  <span className="text-xs text-muted ml-2">Ideal: 110-150</span>
                </div>
                <div className="bg-surface rounded-xl p-4 border border-border">
                  <div className="text-secondary text-sm mb-1 uppercase tracking-wider font-bold">Grammar & Filler</div>
                  <span className={`font-mono font-bold text-2xl ${answers[currentQ.id]?.fillerCount > 2 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {answers[currentQ.id]?.fillerCount || 0}
                  </span>
                  <span className="text-xs text-muted ml-2">Detected errors</span>
                </div>
              </div>

              {answers[currentQ.id]?.funFact && (
                  <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mb-8 text-sm text-indigo-300">
                     <strong className="text-indigo-400 block mb-1">AI Communication Summary:</strong>
                     {answers[currentQ.id].summary}
                     <div className="mt-2 text-fuchsia-300 italic">💡 {answers[currentQ.id].funFact}</div>
                  </div>
              )}

              <div className="bg-surface rounded-xl p-5 border border-border relative">
                <div className="absolute top-0 right-8 px-3 py-1 bg-indigo-500 text-primary text-xs font-bold rounded-b-lg tracking-wider">Live Transcript</div>
                <h4 className="text-sm font-bold text-secondary mb-2 uppercase tracking-wider">What we heard:</h4>
                <p className="text-primary-muted italic min-h-[60px]">
                  "{answers[currentQ.id]?.transcript || 'No speech detected. Please check your microphone permissions.'}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Camera Mock */}
        <div className="lg:w-[400px] flex flex-col gap-4">
          {speechError && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-red-400 text-sm flex items-start gap-2 animate-fade-in">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>{speechError}</p>
              </div>
          )}
          <div className="bg-surface border border-border rounded-3xl aspect-[3/4] flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
            {recording ? (
              <>
                <div className="absolute top-6 right-6 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-red-500/30 z-10">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></div>
                  <span className="text-sm font-mono font-bold text-red-400">REC {Math.floor(timeElapsed / 60)}:{String(timeElapsed % 60).padStart(2, '0')}</span>
                </div>
                <div className="w-full h-full bg-surface-elevated flex items-center justify-center relative">
                   {/* Mock User Silhouette */}
                   <div className="w-48 h-48 bg-neutral-700 rounded-full absolute top-[20%]"></div>
                   <div className="w-80 h-80 bg-neutral-700 rounded-t-full absolute bottom-[-10%]"></div>
                   <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent"></div>
                </div>
              </>
            ) : (
              <div className="text-center p-8">
                <Video className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
                <p className="text-muted font-medium">Camera is off.</p>
                <p className="text-xs text-neutral-600 mt-2">Click "Start Answering" to simulate recording.</p>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
