import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Rocket, ShieldCheck, Zap, ArrowRight, Sparkles, Binary } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] text-center relative">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/20 blur-[100px] rounded-full animate-pulse-neon pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full animate-float pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center space-x-2 px-6 py-2 rounded-full glass-card border-primary/20 mb-10 shadow-neon"
        >
          <Sparkles size={16} className="text-primary animate-pulse" />
          <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-700">Next-Gen Engineering OS 2.0</span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-black mb-12 leading-tight tracking-tighter drop-shadow-2xl font-display">
          ZERO ARREARS. <br/>
          <span className="text-shimmer bg-gradient-to-r from-primary via-cyan to-secondary animate-gradient-x underline decoration-primary/30 decoration-[3px] underline-offset-8">
            ALL CLEAR.
          </span>
        </h1>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="neon-button min-w-[210px] text-base py-4 px-8 rounded-xl group shadow-[0_0_35px_rgba(37,99,235,0.25)]"
          >
            <span className="flex items-center justify-center gap-3">
              INITIALIZE STUDY <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </span>
          </button>
          
          <button 
            className="px-8 py-4 rounded-xl glass-card border-slate-200/80 hover:border-primary/40 transition-all font-bold uppercase tracking-widest text-xs hover:bg-primary/5 flex items-center gap-3 group text-slate-700"
          >
            <Binary size={18} className="text-primary group-hover:rotate-180 transition-transform duration-500" />
            Access Database
          </button>
        </div>
      </motion.div>

      {/* Feature Grids */}
      <motion.div 
        className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <div className="glass-card p-8 group hover:border-primary/50 transition-all hover:bg-primary/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
            <Rocket size={80} />
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 border border-primary/20 shadow-neon">
            <Zap className="text-primary" size={24} fill="currentColor" />
          </div>
          <h3 className="text-xl font-black mb-3 tracking-tight">Instant Subject Hub</h3>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">Integrated Subject Database. Get Syllabus & Notes in <span className="text-slate-800 font-bold">0.2 seconds.</span></p>
        </div>

        <div className="glass-card p-8 group hover:border-secondary/50 transition-all hover:bg-secondary/5 relative overflow-hidden border-t-4 border-t-secondary">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
            <Binary size={80} />
          </div>
          <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-6 border border-secondary/20 shadow-[0_0_20px_rgba(2,132,199,0.2)]">
            <Sparkles className="text-secondary" size={24} fill="currentColor" />
          </div>
          <h3 className="text-xl font-black mb-3 tracking-tight">AI Buddy Mode</h3>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">No judgmental bots here. Talk to your college AI buddy in <span className="text-slate-800 font-bold">Tamil-English slang.</span></p>
        </div>

        <div className="glass-card p-8 group hover:border-cyan/50 transition-all hover:bg-cyan/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
            <ShieldCheck size={80} />
          </div>
          <div className="w-12 h-12 bg-cyan/10 rounded-xl flex items-center justify-center mb-6 border border-cyan/20 shadow-neon-cyan">
            <ShieldCheck className="text-cyan" size={24} fill="currentColor" />
          </div>
          <h3 className="text-xl font-black mb-3 tracking-tight">Verified Data</h3>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">Official Regulation 2021 curriculum for all <span className="text-slate-800 font-bold">Professional Departments.</span></p>
        </div>
      </motion.div>
    </div>
  );
}
