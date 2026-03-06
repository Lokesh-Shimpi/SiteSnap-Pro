import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProjectMonitor from './pages/ProjectMonitor';
import BlogFeed from './pages/BlogFeed';
import BlogEditor from './pages/BlogEditor';
import Features from './pages/Features';
import About from './pages/About';

import React, { useContext } from 'react';
import AuthContext from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
const ProtectedRoute = ({ children }) => {
  const { user, loading, authError } = useContext(AuthContext);
  if (loading) return <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] flex items-center justify-center text-indigo-500">Loading...</div>;
  if (authError) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] flex flex-col items-center justify-center text-center p-4">
        <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-xl max-w-md">
          <h2 className="text-xl font-bold text-red-500 mb-2">Connection Error</h2>
          <p className="text-red-200">{authError}</p>
          <p className="text-slate-400 text-sm mt-4">Database connection likely failed. Please check your .env configuration.</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="mt-6 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/features" element={<Features />} />
            <Route path="/about" element={<About />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/monitor/:id"
              element={
                <ProtectedRoute>
                  <ProjectMonitor />
                </ProtectedRoute>
              }
            />
            <Route path="/blogs" element={<BlogFeed />} />
            <Route path="/blogs/new" element={
              <ProtectedRoute>
                <BlogEditor />
              </ProtectedRoute>
            } />
            <Route path="/blogs/edit/:id" element={
              <ProtectedRoute>
                <BlogEditor />
              </ProtectedRoute>
            } />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}
export default App;
