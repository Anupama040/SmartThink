import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Lightbulb, PlayCircle } from 'lucide-react';
import axios from 'axios';

export default function AptitudeLearn() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLearnContent = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/aptitude/topics/${topicId}/learn`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTopic(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLearnContent();
  }, [topicId]);

  if (loading) return <div className="min-h-screen bg-background text-primary flex items-center justify-center">Loading Content...</div>;

  return (
    <div className="min-h-screen bg-background text-primary font-sans p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-fuchsia-600 rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

      <Link to="/aptitude" className="inline-flex items-center gap-2 text-secondary hover:text-primary mb-8 transition-colors relative z-10">
        <ArrowLeft className="w-5 h-5" /> Back to Hub
      </Link>

      <div className="max-w-4xl mx-auto relative z-10">
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-sm font-bold rounded-full mb-4">
            <BookOpen className="w-4 h-4" /> Learn Mode
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">{topic?.name}</h1>
          <p className="text-lg text-secondary">{topic?.description}</p>
        </header>

        <div className="space-y-8">
          {topic?.formulaNotes && (
            <div className="bg-surface border border-border rounded-2xl p-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" /> Formulas & Rules
              </h2>
              <div className="text-primary-muted leading-relaxed whitespace-pre-wrap">{topic.formulaNotes}</div>
            </div>
          )}

          {topic?.shortTricks && (
            <div className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 rounded-2xl p-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-amber-400">
                <Lightbulb className="w-5 h-5" /> Short Tricks
              </h2>
              <div className="text-amber-100/80 leading-relaxed whitespace-pre-wrap">{topic.shortTricks}</div>
            </div>
          )}

          {topic?.solvedExamples && (
            <div className="bg-surface border border-border rounded-2xl p-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-emerald-400" /> Solved Examples
              </h2>
              <div className="text-primary-muted leading-relaxed whitespace-pre-wrap bg-background p-6 rounded-xl border border-border font-mono text-sm">
                {topic.solvedExamples}
              </div>
            </div>
          )}

          {(!topic?.formulaNotes && !topic?.shortTricks && !topic?.solvedExamples) && (
            <div className="text-center py-10 text-muted border border-dashed border-border rounded-2xl">
              No learn content uploaded for this topic yet.
            </div>
          )}
        </div>

        <div className="mt-12 text-center pb-20">
          <button 
            onClick={() => navigate(`/aptitude/practice/${topicId}`)}
            className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-colors shadow-xl shadow-white/10"
          >
            Start Practice Mode Now
          </button>
        </div>
      </div>
    </div>
  );
}
