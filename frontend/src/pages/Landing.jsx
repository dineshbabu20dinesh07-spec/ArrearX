import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Rocket, ShieldCheck, Zap, ArrowRight, Sparkles, Binary } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] relative px-4">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none animate-pulse" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-6xl w-full z-10 py-10 border-b border-slate-100">
        {/* Left Column: Mascot Illustration */}
        <motion.div 
          className="lg:col-span-5 flex justify-center order-last lg:order-first"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative group select-none">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-[3rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative bg-white border-2 border-b-4 border-slate-200 rounded-[3rem] p-4 shadow-md w-72 sm:w-80 overflow-hidden flex items-center justify-center"
            >
              {/* Custom Mascot Owl */}
              <img 
                src="file:///C:/Users/MI/.gemini/antigravity-ide/brain/44bc34ac-52c6-45d2-a6df-baa988347a90/duo_student_1781003476702.png" 
                alt="Clari Mascot" 
                className="w-full h-auto object-contain rounded-[2rem]"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Right Column: Hero Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 text-center lg:text-left flex flex-col justify-center items-center lg:items-start"
        >
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center space-x-2 px-5 py-1.5 rounded-full border-2 border-b-4 border-slate-200 bg-white mb-6 select-none"
          >
            <Sparkles size={16} className="text-primary animate-pulse" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#3c3c3c]">ALLCLEAR OS 2.0 ACTIVE</span>
          </motion.div>

          <h1 className="text-4xl sm:text-6xl font-black mb-6 leading-none tracking-tight font-display text-slate-800">
            ZERO ARREARS. <br/>
            <span className="text-shimmer bg-gradient-to-r from-primary via-secondary to-cyan">
              ALL CLEAR.
            </span>
          </h1>
          
          <p className="text-slate-500 font-bold text-base sm:text-lg mb-8 max-w-lg leading-relaxed">
            The fun, effective, and completely gamified way to study engineering. Scan syllabus, download notes, and learn with AI in Tamil & English!
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button 
              onClick={() => navigate('/dashboard')}
              className="duo-button-3d min-w-[200px] text-sm py-4 px-8 w-full sm:w-auto"
            >
              <span className="flex items-center justify-center gap-2">
                INITIALIZE STUDY <ArrowRight size={16} />
              </span>
            </button>
            
            <button 
              className="duo-button-gray-3d min-w-[200px] text-sm py-4 px-8 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Binary size={16} className="text-[#3c3c3c]" />
              Access Database
            </button>
          </div>
        </motion.div>
      </div>

      {/* Feature Grids */}
      <motion.div 
        className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <div className="duo-card p-6 flex flex-col items-center sm:items-start text-center sm:text-left relative overflow-hidden group">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border-2 border-b-4 border-green-600/30">
            <Zap className="text-primary" size={24} fill="currentColor" />
          </div>
          <h3 className="text-lg font-black mb-3 tracking-tight text-slate-800">Instant Subject Hub</h3>
          <p className="text-xs text-slate-500 font-bold leading-relaxed">Integrated Subject Database. Get Syllabus & Notes in <span className="text-slate-800 font-extrabold">0.2 seconds.</span></p>
        </div>

        <div className="duo-card p-6 flex flex-col items-center sm:items-start text-center sm:text-left relative overflow-hidden border-b-[#1CB0F6] group">
          <div className="w-12 h-12 bg-[#1CB0F6]/10 rounded-2xl flex items-center justify-center mb-6 border-2 border-b-4 border-sky-600/30">
            <Sparkles className="text-[#1CB0F6]" size={24} fill="currentColor" />
          </div>
          <h3 className="text-lg font-black mb-3 tracking-tight text-slate-800">AI Buddy Mode</h3>
          <p className="text-xs text-slate-500 font-bold leading-relaxed">No judgmental bots here. Talk to your college AI buddy in <span className="text-slate-800 font-extrabold">Tamil-English slang.</span></p>
        </div>

        <div className="duo-card p-6 flex flex-col items-center sm:items-start text-center sm:text-left relative overflow-hidden border-b-[#FF9600] group">
          <div className="w-12 h-12 bg-[#FF9600]/10 rounded-2xl flex items-center justify-center mb-6 border-2 border-b-4 border-orange-600/30">
            <ShieldCheck className="text-[#FF9600]" size={24} fill="currentColor" />
          </div>
          <h3 className="text-lg font-black mb-3 tracking-tight text-slate-800">Verified Data</h3>
          <p className="text-xs text-slate-500 font-bold leading-relaxed">Official Regulation 2021 curriculum for all <span className="text-slate-800 font-extrabold">Professional Departments.</span></p>
        </div>
      </motion.div>

      {/* Footer Disclaimer */}
      <footer className="mt-24 w-full border-t border-slate-200 pt-8 pb-6 text-center">
        <p className="text-xs text-slate-400 font-bold leading-relaxed">
          ALLCLEAR & ArrearX © 2026. Made for Anna University students.
        </p>
        <p className="text-[10px] text-slate-400 mt-2 max-w-2xl mx-auto italic font-semibold leading-relaxed">
          Legal Note: AllClear is an independent educational platform. Playful layout inspired by gamification system interfaces. Not affiliated with, endorsed by, or associated with Duolingo Inc.
        </p>
      </footer>
    </div>
  );
}
