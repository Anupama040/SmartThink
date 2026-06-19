import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, MessageSquare, Plus, HelpCircle, Code, Brain, Database, Send, User, LayoutDashboard, ArrowLeft } from 'lucide-react';
import axios from 'axios';

export default function Chatbot() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text) => {
    if (!text.trim()) return;
    
    // Add user message
    const newMsg = { text, sender: 'user' };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    // Mock AI Response based on keywords
    setTimeout(() => {
      let botReply = "I am SmartBot. I can help you with your coding, aptitude, or interview queries. However, my backend AI engine is currently in mock mode. Please try asking about 'java', 'sql', 'aptitude', 'quiz', or 'problem'.";
      
      const lowerText = text.toLowerCase();
      
      // SQL Logic
      if (lowerText.includes('sql') || lowerText.includes('database')) {
        botReply = "SQL (Structured Query Language) is used for managing relational databases. Some common commands are SELECT, INSERT, UPDATE, and DELETE. Would you like a practice query?";
      } else if (lowerText.includes('update')) {
        botReply = "The UPDATE statement is used to modify the existing records in a table. Syntax: \nUPDATE table_name \nSET column1 = value1, column2 = value2 \nWHERE condition;";
      } else if (lowerText.includes('select')) {
        botReply = "The SELECT statement is used to select data from a database. Syntax: \nSELECT column1, column2 FROM table_name;";
      
      // Java Logic
      } else if (lowerText.includes('java')) {
        botReply = "Java is a high-level, class-based, object-oriented programming language. Are you looking to practice Java coding scenarios or test your knowledge with a quiz?";
      
      // Aptitude Logic
      } else if (lowerText.includes('aptitude')) {
        botReply = "Aptitude tests usually cover Quantitative, Logical Reasoning, and Verbal Ability. Which topic do you want to master today? I can teach you shortcuts for Time and Work!";
      
      // Interview Logic
      } else if (lowerText.includes('interview') || lowerText.includes('hr')) {
        botReply = "For HR interviews, always use the STAR method (Situation, Task, Action, Result). Emphasize teamwork and problem-solving without blaming others.";
      
      // Quiz / Problem Logic
      } else if (lowerText.includes('quiz') || lowerText.includes('questions')) {
        botReply = "Sure! Here is a quick quiz question: What is the time complexity of binary search? \nA) O(1) \nB) O(n) \nC) O(log n) \nD) O(n^2) \nReply with your answer!";
      } else if (lowerText.includes('c)') || lowerText.includes('o(log n)')) {
        botReply = "Correct! Binary search halves the search space at each step, giving it an O(log n) time complexity. Great job!";
      } else if (lowerText.includes('problem') || lowerText.includes('coding')) {
        botReply = "Let's solve 'Two Sum'. Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You can try solving this in the Coding Practice module!";
      }

      setMessages(prev => [...prev, { text: botReply, sender: 'bot' }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleCardClick = (promptText) => {
    handleSend(promptText);
  };

  return (
    <div className="min-h-screen bg-background text-primary font-sans flex overflow-hidden">
      {/* Sidebar for Chat History */}
      <aside className="w-72 bg-card border-r border-border flex flex-col hidden md:flex">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">SmartBot</h1>
        </div>

        <div className="p-4">
          <button 
            onClick={() => setMessages([])}
            className="w-full flex items-center gap-2 justify-center bg-transparent border border-border-strong hover:border-neutral-500 hover:bg-surface-elevated text-primary px-4 py-3 rounded-xl transition-colors font-medium text-sm"
          >
            <Plus className="w-4 h-4" /> New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-1">
          <div className="text-xs font-bold text-muted uppercase tracking-wider px-3 mb-2 mt-4">Recent</div>
          <button className="w-full flex items-center gap-3 text-primary-muted hover:bg-surface-elevated px-3 py-2.5 rounded-lg transition-colors text-left text-sm truncate">
            <MessageSquare className="w-4 h-4 shrink-0 text-muted" />
            <span className="truncate">String comparison program...</span>
          </button>
          <button className="w-full flex items-center gap-3 text-primary-muted hover:bg-surface-elevated px-3 py-2.5 rounded-lg transition-colors text-left text-sm truncate">
            <MessageSquare className="w-4 h-4 shrink-0 text-muted" />
            <span className="truncate">Explain method overloading</span>
          </button>
          <div className="text-xs font-bold text-muted uppercase tracking-wider px-3 mb-2 mt-6">Older</div>
          <button className="w-full flex items-center gap-3 text-primary-muted hover:bg-surface-elevated px-3 py-2.5 rounded-lg transition-colors text-left text-sm truncate">
            <MessageSquare className="w-4 h-4 shrink-0 text-muted" />
            <span className="truncate">SQL Query Generator</span>
          </button>
          <button className="w-full flex items-center gap-3 text-primary-muted hover:bg-surface-elevated px-3 py-2.5 rounded-lg transition-colors text-left text-sm truncate">
            <MessageSquare className="w-4 h-4 shrink-0 text-muted" />
            <span className="truncate">Coding Problem Provider</span>
          </button>
        </div>

        <div className="p-4 border-t border-border">
           <Link to="/dashboard" className="flex items-center gap-3 text-secondary hover:text-primary px-3 py-2 rounded-lg transition-colors text-sm">
             <ArrowLeft className="w-4 h-4" /> Back to Dashboard
           </Link>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative bg-background">
        {messages.length === 0 ? (
          // Welcome Screen
          <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center">
            <div className="text-center mb-12 animate-fade-in">
              <div className="w-20 h-20 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(37,99,235,0.15)]">
                <Bot className="w-10 h-10 text-blue-500" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Hi, Student 👋</h2>
              <p className="text-secondary">Let's continue learning with your AI-based SmartBot.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl w-full">
              <button onClick={() => handleCardClick("I have a doubt regarding my code. Can you help resolve my query?")} className="bg-[#151515] hover:bg-surface-hover border border-border hover:border-border-strong p-6 rounded-2xl transition-all text-left group">
                <div className="w-10 h-10 bg-pink-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <HelpCircle className="w-5 h-5 text-pink-500" />
                </div>
                <h3 className="font-bold text-lg mb-1 flex items-center gap-2">Resolve Query <span className="text-neutral-600 transition-transform group-hover:translate-x-1">&rarr;</span></h3>
                <p className="text-sm text-muted">Resolve your code related doubts</p>
              </button>

              <button onClick={() => handleCardClick("I want to learn and practice some new programming concepts.")} className="bg-[#151515] hover:bg-surface-hover border border-border hover:border-border-strong p-6 rounded-2xl transition-all text-left group">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Database className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="font-bold text-lg mb-1 flex items-center gap-2">Learn Concepts <span className="text-neutral-600 transition-transform group-hover:translate-x-1">&rarr;</span></h3>
                <p className="text-sm text-muted">Learn and Practice concepts</p>
              </button>

              <button onClick={() => handleCardClick("Provide me some quiz questions.")} className="bg-[#151515] hover:bg-surface-hover border border-border hover:border-border-strong p-6 rounded-2xl transition-all text-left group">
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Brain className="w-5 h-5 text-purple-500" />
                </div>
                <h3 className="font-bold text-lg mb-1 flex items-center gap-2">Take Quiz <span className="text-neutral-600 transition-transform group-hover:translate-x-1">&rarr;</span></h3>
                <p className="text-sm text-muted">Provide me quiz questions</p>
              </button>

              <button onClick={() => handleCardClick("Give me a challenging coding problem to solve.")} className="bg-[#151515] hover:bg-surface-hover border border-border hover:border-border-strong p-6 rounded-2xl transition-all text-left group">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Code className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="font-bold text-lg mb-1 flex items-center gap-2">Coding Problem <span className="text-neutral-600 transition-transform group-hover:translate-x-1">&rarr;</span></h3>
                <p className="text-sm text-muted">Give me a coding question</p>
              </button>
            </div>
          </div>
        ) : (
          // Active Chat
          <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-surface-elevated' : 'bg-blue-600'}`}>
                    {msg.sender === 'user' ? <User className="w-5 h-5 text-secondary" /> : <Bot className="w-5 h-5 text-primary" />}
                  </div>
                  <div className={`px-5 py-3.5 rounded-2xl max-w-[80%] text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-surface-elevated text-primary rounded-tr-none' : 'bg-transparent border border-border text-neutral-200 rounded-tl-none'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div className="px-5 py-3.5 rounded-2xl bg-transparent border border-border rounded-tl-none flex items-center gap-1">
                    <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 bg-background border-t border-neutral-900">
          <div className="max-w-3xl mx-auto relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend(input);
              }}
              placeholder="Ask me anything about coding, aptitudes, or interviews..."
              className="w-full bg-[#151515] border border-border focus:border-neutral-600 focus:ring-0 text-primary rounded-2xl pl-6 pr-14 py-4 outline-none transition-colors"
            />
            <button 
              onClick={() => handleSend(input)}
              className="absolute right-3 w-10 h-10 bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center justify-center transition-colors shadow-lg"
            >
              <Send className="w-4 h-4 text-primary ml-0.5" />
            </button>
          </div>
          <p className="text-center text-xs text-neutral-600 mt-3">SmartBot can make mistakes. Verify important information.</p>
        </div>
      </main>
    </div>
  );
}
