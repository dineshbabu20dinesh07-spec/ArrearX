import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, MessageSquare, PenTool, Image, Sparkles, User, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import StudyRoom from './pages/StudyRoom';
import Notes from './pages/Notes';
import SyllabusAnalyzer from './pages/SyllabusAnalyzer';
// ChatWidget removed as per request

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#fafafa] text-slate-800 font-sans selection:bg-primary/20 selection:text-primary pb-20 md:pb-0 md:pl-24 cyber-grid">
        <SidebarMain />
        <div className="max-w-7xl mx-auto px-6 py-10">
          <header className="flex justify-between items-center mb-10">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-all shadow-neon group-hover:shadow-[0_0_20px_rgba(37,99,235,0.2)]">
                <Sparkles className="text-primary w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tighter text-glow font-display">ALL<span className="text-primary">CLEAR</span></h1>
                <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-bold group-hover:text-primary/70 transition-colors">Engineering OS 2.0</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Gamification Stats */}
              <div className="flex items-center space-x-3 bg-white border-2 border-b-4 border-slate-200 rounded-2xl px-4 py-1.5 text-sm font-black select-none">
                <span className="flex items-center text-[#ff9600]"><span className="mr-1">🔥</span> 3 Days</span>
                <span className="text-slate-300">|</span>
                <span className="flex items-center text-[#1cb0f6]"><span className="mr-1">⚡</span> 350 XP</span>
              </div>
              
              <button className="hidden md:flex items-center space-x-2 bg-white border-2 border-b-4 border-slate-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all active:translate-y-[2px] active:border-b-2 text-slate-700">
                <Settings size={16} className="text-slate-550" />
                <span>Config</span>
              </button>
              
              <div className="w-10 h-10 rounded-full border-2 border-primary/40 p-0.5">
                <div className="w-full h-full bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white">
                  <User size={18} />
                </div>
              </div>
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.main 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Routes>
                <Route path="/"          element={<Landing />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/study"     element={<StudyRoom />} />
                <Route path="/notes"     element={<Notes />} />
                <Route path="/syllabus"  element={<SyllabusAnalyzer />} />
              </Routes>
            </motion.main>
          </AnimatePresence>
        </div>
        {/* ChatWidget removed */}
      </div>
    </Router>
  );
}

function SidebarMain() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/',          icon: BookOpen,    label: 'Mission Control' },
    { path: '/dashboard', icon: LayoutDashboard, label: 'Subject Hub' },
    { path: '/study',     icon: MessageSquare, label: 'Study Room' },
    { path: '/notes',     icon: PenTool,     label: 'Matrix Notes' },
    { path: '/syllabus',  icon: Image,       label: 'Syllabus AI' },
  ];

  return (
    <nav className="fixed bottom-0 w-full md:w-20 md:h-screen md:left-0 bg-white/95 backdrop-blur-3xl border-t md:border-t-0 md:border-r border-slate-200/60 flex md:flex-col justify-around md:justify-center items-center py-4 md:py-0 z-[100] shadow-[5px_0_30px_rgba(0,0,0,0.03)]">
      <div
        onClick={() => navigate('/')}
        className="md:absolute md:top-8 text-primary font-black text-3xl hidden md:block cursor-pointer select-none tracking-tighter font-display group"
      >
        <span className="text-glow group-hover:text-slate-900 transition-colors">AC</span><span className="animate-pulse text-primary">.</span>
      </div>

      <div className="flex md:flex-col space-x-6 md:space-x-0 md:space-y-8">
        {navItems.map(({ path, icon: Icon, label }) => (
          <div key={path} className="relative group">
            <button
              onClick={() => navigate(path)}
              className={`relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-100
                ${isActive(path)
                  ? 'text-white bg-primary border-b-4 border-[#3b8e01] scale-105 active:translate-y-[2px] active:border-b-2'
                  : 'text-slate-400 hover:text-primary hover:bg-slate-50'
                }`}
            >
              <Icon size={22} strokeWidth={isActive(path) ? 2.5 : 2} />
              {isActive(path) && (
                <motion.span 
                  layoutId="activeIndicator"
                  className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary rounded-full hidden md:block" 
                />
              )}
            </button>
            <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-primary border-b-4 border-[#3b8e01] px-3 py-1.5 rounded-xl text-[10px] font-black text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-all scale-75 group-hover:scale-100 whitespace-nowrap uppercase tracking-wider z-50">
              {label}
            </span>
          </div>
        ))}
      </div>
    </nav>
  );
}

export default App;
