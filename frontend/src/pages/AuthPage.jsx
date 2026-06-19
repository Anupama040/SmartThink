import { useState } from 'react';
import { Mail, Lock, User, Briefcase, ChevronRight, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', role: 'STUDENT'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}${endpoint}`, payload);
      const userRole = response.data.role;

      if (isAdminMode && userRole !== 'ADMIN') {
          setError('Access Denied. Your account does not have administrator privileges.');
          return;
      }
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', userRole);

      if (userRole === 'ADMIN') {
          navigate('/admin');
      } else {
          navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-primary flex overflow-hidden font-sans">
      
      {/* Left Branding Panel */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-16 relative border-r border-border">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
           <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-600 rounded-full blur-[120px] opacity-20"></div>
        </div>
        
        <div className="z-10 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-fuchsia-500 rounded-lg shadow-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">SmartThink</h1>
          </div>
        </div>

        <div className="z-10 relative max-w-lg">
          <h2 className="text-5xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Master your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">interviews</span> & land the dream job.
          </h2>
          <p className="text-secondary text-lg leading-relaxed">
            The all-in-one placement preparation platform. Practice coding, take aptitude mock tests, and get AI-driven feedback on your resume.
          </p>
        </div>
        
        <div className="z-10 relative text-sm text-muted font-medium">
          © 2026 SmartThink Platform. All rights reserved.
        </div>
      </div>

      {/* Right Auth Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        
        {/* Admin Login Toggle Button */}
        <button 
           onClick={() => { setIsAdminMode(!isAdminMode); setIsLogin(true); setError(''); }}
           className={`absolute top-8 right-8 p-3 rounded-full transition-all ${isAdminMode ? 'bg-indigo-600 text-primary shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'bg-surface text-muted hover:text-primary hover:bg-surface-elevated'}`}
           title="Admin Portal Access"
        >
           <Shield className="w-5 h-5" />
        </button>

        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-2 flex items-center justify-center gap-2">
              {isAdminMode ? <><Shield className="w-6 h-6 text-indigo-500" /> Admin Access</> : (isLogin ? 'Welcome back' : 'Create an account')}
            </h2>
            <p className="text-secondary">
              {isAdminMode ? 'Restricted access for system administrators only.' : (isLogin ? 'Enter your details to access your dashboard.' : 'Start your journey to placement success.')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            {!isLogin && (
              <div className="flex gap-4">
                <div className="space-y-2 flex-1">
                  <label className="text-sm font-medium text-primary-muted">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-muted" />
                    <input 
                      type="text" name="firstName" required
                      onChange={handleChange}
                      className="w-full bg-surface border border-border rounded-xl py-3 pl-10 pr-4 text-primary placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                      placeholder="John"
                    />
                  </div>
                </div>
                <div className="space-y-2 flex-1">
                  <label className="text-sm font-medium text-primary-muted">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-muted" />
                    <input 
                      type="text" name="lastName" required
                      onChange={handleChange}
                      className="w-full bg-surface border border-border rounded-xl py-3 pl-10 pr-4 text-primary placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-muted">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-muted" />
                <input 
                  type="email" name="email" required
                  onChange={handleChange}
                  className="w-full bg-surface border border-border rounded-xl py-3 pl-10 pr-4 text-primary placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-muted">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted" />
                <input 
                  type="password" name="password" required
                  onChange={handleChange}
                  className="w-full bg-surface border border-border rounded-xl py-3 pl-10 pr-4 text-primary placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-white text-black hover:bg-neutral-200 font-semibold rounded-xl py-3 px-4 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              {!loading && <ChevronRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-secondary">
            {!isAdminMode && (
              <>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                  onClick={() => { setIsLogin(!isLogin); setError(''); }} 
                  className="text-primary hover:text-indigo-400 font-medium transition-colors"
                >
                  {isLogin ? 'Sign up' : 'Log in'}
                </button>
              </>
            )}
            {isAdminMode && (
              <span className="text-muted">Authorized personnel only.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
