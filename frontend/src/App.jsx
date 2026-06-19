import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import UserProfile from './pages/UserProfile';
import AptitudeHub from './pages/AptitudeHub';
import AptitudeLearn from './pages/AptitudeLearn';
import AptitudeQuiz from './pages/AptitudeQuiz';
import ResumeBuilder from './pages/ResumeBuilder';
import AdminDashboard from './pages/AdminDashboard';
import HRHub from './pages/HRHub';
import HRInterview from './pages/HRInterview';
import Forum from './pages/Forum';
import CodingHub from './pages/CodingHub';
import CodingEnvironment from './pages/CodingEnvironment';
import Chatbot from './pages/Chatbot';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/resume" element={<ResumeBuilder />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/aptitude" element={<AptitudeHub />} />
        <Route path="/aptitude/learn/:topicId" element={<AptitudeLearn />} />
        <Route path="/aptitude/practice/:topicId" element={<AptitudeQuiz />} />
        <Route path="/aptitude/mock" element={<AptitudeQuiz />} />
        <Route path="/hr-interview" element={<HRHub />} />
        <Route path="/hr-interview/session" element={<HRInterview />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/coding" element={<CodingHub />} />
        <Route path="/coding/:id" element={<CodingEnvironment />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </Router>
  );
}

export default App;
