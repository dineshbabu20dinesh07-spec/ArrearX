import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, BookOpen, ExternalLink, ChevronRight, Hash, Star, Layout, Library, Compass } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const DEPARTMENTS = [
  "All", "CSE", "AI-DS", "IT", "ECE", "EEE", "Mechanical", "Civil"
];

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    setSearched(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/subjects/search?q=${query}`);
      setResults(response.data.results);
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Search Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black mb-4 tracking-tighter font-display"
          >
            ALL<span className="text-primary italic">CLEAR:</span> The Subject Core.
          </motion.h2>
          <p className="text-slate-500 font-medium italic">Precision Syllabus, Notes & Exam Guides for Regulation 2021 Warriors.</p>
        </div>

        <div className="max-w-3xl mx-auto relative group">
          <form onSubmit={handleSearch} className="relative z-10 flex items-center bg-white border-2 border-b-4 border-slate-200 rounded-2xl p-1.5 transition-all focus-within:border-secondary shadow-sm">
            <div className="pl-6 text-slate-400">
              <Search size={20} className="group-focus-within:text-primary transition-colors" />
            </div>
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Subject ID or Title (e.g., CS3301)"
              className="flex-1 bg-transparent border-none text-slate-800 px-5 py-3 outline-none text-base font-bold placeholder-slate-450"
            />
            <button 
              type="submit"
              className="duo-button-3d text-white font-black py-3 px-8 rounded-xl transition-all select-none uppercase tracking-wider text-xs"
            >
              Scan Data
            </button>
          </form>
          
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            {DEPARTMENTS.map(dept => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border-2 border-b-4
                  ${selectedDept === dept 
                    ? 'bg-primary/10 border-primary text-primary border-b-primary active:translate-y-[2px] active:border-b-2' 
                    : 'bg-white border-slate-250 text-slate-500 hover:bg-slate-50 hover:text-slate-800 active:translate-y-[2px] active:border-b-2'
                  }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 space-y-4"
            >
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin shadow-neon" />
              <p className="text-primary font-black uppercase tracking-widest text-xs animate-pulse">Syncing Regulation 2021 Database...</p>
            </motion.div>
          ) : searched && results.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {results
                .filter(s => selectedDept === "All" || s.dept === selectedDept || s.dept === "Common")
                .map((subject, idx) => (
                  <motion.div 
                    key={subject.code}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                  className="duo-card p-6 flex flex-col group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] pointer-events-none rounded-full" />
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/10 p-2.5 rounded-xl border-2 border-b-4 border-primary/20">
                        <Hash size={20} className="text-primary" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#777777]">Professional Subject ID</span>
                        <h3 className="text-xl font-black tracking-tight font-display">{subject.code}</h3>
                      </div>
                    </div>
                    <div className="bg-emerald/10 text-emerald text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border-2 border-b-4 border-emerald/20">
                      Regulation 2021
                    </div>
                  </div>

                    <h4 className="text-slate-800 text-base font-bold mb-6 flex-1 group-hover:text-primary transition-colors pr-8">
                      {subject.name}
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                      <a 
                        href={subject.syllabus} target="_blank" rel="noreferrer"
                        className="flex items-center justify-center space-x-2 bg-white border-2 border-b-4 border-slate-200 hover:bg-slate-50 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider text-slate-500 hover:text-primary transition-all active:translate-y-[2px] active:border-b-2"
                      >
                        <Download size={14} /> <span>Syllabus</span>
                      </a>
                      <a 
                        href={subject.notes} target="_blank" rel="noreferrer"
                        className="flex items-center justify-center space-x-2 bg-[#1CB0F6] border-b-4 border-[#1898d4] text-white py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all hover:bg-[#24c0ff] active:translate-y-[2px] active:border-b-2 active:shadow-none"
                      >
                        <Library size={14} /> <span>Get Notes</span>
                      </a>
                    </div>
                  </motion.div>
                ))}
            </motion.div>
          ) : searched ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="glass-card p-12 text-center border-dashed border-slate-300"
            >
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Compass size={40} className="text-slate-400 animate-spin-slow" />
              </div>
              <h3 className="text-2xl font-black mb-4">Subject code not found!</h3>
              <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">
                Searching officially for <span className="text-slate-800 font-bold">"{query}"</span>. AI Friend buddy ready to explain it live.
              </p>
              <button 
                onClick={() => handleSearch()}
                className="bg-slate-100 border border-slate-200 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 text-slate-700 transition-all"
              >
                Let AI Analyze Syllabus
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 opacity-40 grayscale group hover:grayscale-0 hover:opacity-100 transition-all pointer-events-none">
               <div className="glass-card h-40 cyber-grid" />
               <div className="glass-card h-40 cyber-grid" />
               <div className="glass-card h-40 cyber-grid" />
            </div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
