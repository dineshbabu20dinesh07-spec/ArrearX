import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, ChevronRight, AlertCircle, CheckCircle, Loader, Sparkles, Image as ImageIcon, Zap, Star } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function SyllabusAnalyzer() {
  const [image, setImage] = useState(null);
  const [b64, setB64] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setB64(reader.result.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeSyllabus = async () => {
    if (!b64) return;
    setIsAnalyzing(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/analyze-syllabus`, { image_b64: b64 });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setResult({ error: "Backend connectivity issue. Gemini API start aagiduchaa nu paaru da! (High-tech server ping failed)" });
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-primary font-black uppercase tracking-widest text-[10px] mb-2"
          >
            <Sparkles size={14} className="animate-pulse" /> 
            AI Vision Intelligence
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Syllabus <span className="text-primary italic">X-Ray.</span></h2>
          <p className="text-gray-500 font-medium">Upload syllabus photo – AI extracts Unit-wise 2 Marks & 14 Marks instantly.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Upload Section */}
        <div className="lg:col-span-5 space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="duo-card p-6 border-2 border-dashed border-slate-300 hover:border-primary/45 transition-all group relative overflow-hidden"
          >
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            
            <div className="flex flex-col items-center text-center py-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 border-2 border-b-4 border-primary/20 transition-all">
                {image ? <CheckCircle className="text-emerald" size={32} /> : <Upload className="text-primary" size={32} />}
              </div>
              <h4 className="text-lg font-bold mb-2">{image ? image.name : "Syllabus Image Drop Pannu"}</h4>
              <p className="text-slate-500 text-xs font-semibold">PNG, JPG, JPEG support. Photo edhuthaalum okay da!</p>
            </div>
          </motion.div>

          <button 
            onClick={analyzeSyllabus}
            disabled={!b64 || isAnalyzing}
            className="w-full duo-button-3d py-4 rounded-xl text-base disabled:opacity-50"
          >
            {isAnalyzing ? (
              <span className="flex items-center justify-center gap-3">
                <Loader className="animate-spin text-white" /> AI SCANNING...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-3">
                <Zap size={20} fill="currentColor" className="text-white" /> INITIATE AI ANALYSIS
              </span>
            )}
          </button>
          
          <div className="duo-card p-6 border-2 border-b-4 border-slate-200 bg-slate-50/50">
             <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 flex items-center gap-2">
               <Star size={12} className="text-primary fill-primary" /> Pro Tips for Accuracy
             </h5>
             <ul className="space-y-3 text-xs text-slate-600 font-medium">
               <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" /> Photo clear-ah edunga macha.</li>
               <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" /> Focus on Unit Titles and Topics.</li>
               <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" /> Regulation 2017 or 2021 okay!</li>
             </ul>
          </div>
        </div>

        {/* Right: Results Section */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div 
                key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="duo-card h-[460px] flex flex-col items-center justify-center p-6 border-2 border-b-4 border-slate-200 bg-white"
              >
                <img 
                  src="file:///C:/Users/MI/.gemini/antigravity-ide/brain/44bc34ac-52c6-45d2-a6df-baa988347a90/duo_studying_1781003495394.png" 
                  alt="Studying Mascot" 
                  className="w-40 h-40 object-contain mb-4 rounded-xl grayscale opacity-30 animate-pulse"
                />
                <p className="font-black uppercase tracking-wider text-xs text-slate-400">Waiting for Syllabus Scan...</p>
              </motion.div>
            ) : result.error ? (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-10 border-red-200 text-center bg-white">
                <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
                <h4 className="text-xl font-bold mb-2">Sync Error</h4>
                <p className="text-slate-600">{result.error}</p>
              </motion.div>
            ) : (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {result.units?.map((unit, idx) => (
                  <div key={idx} className="duo-card p-8 group border-2 border-b-4 border-slate-200 bg-white">
                    <div className="flex justify-between items-start mb-6">
                      <div className="bg-primary/10 p-2 rounded-lg border-2 border-b-4 border-primary/20 text-primary font-black text-xs uppercase px-3">
                        Unit {unit.unit_number}
                      </div>
                      <div className="flex space-x-2">
                        <Star className="text-yellow-500 fill-yellow-500" size={14} />
                      </div>
                    </div>
                    
                    <h4 className="text-2xl font-black mb-6 tracking-tight group-hover:text-primary transition-colors">{unit.unit_title}</h4>
                    
                    <div className="space-y-6">
                       <div>
                         <div className="text-[10px] font-black uppercase tracking-widest text-emerald mb-3 flex items-center gap-2">
                           <div className="w-2 h-2 bg-emerald rounded-full shadow-neon" /> 
                           Priority Topics (Expected Part B)
                         </div>
                         <div className="flex flex-wrap gap-2">
                           {unit.topics?.map((t, i) => (
                             <span key={i} className="text-xs bg-slate-100 px-4 py-2 rounded-xl text-slate-700 font-bold border border-slate-200 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                               {t}
                             </span>
                           ))}
                         </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                          <button className="flex items-center justify-center gap-3 bg-white border-2 border-b-4 border-slate-200 hover:bg-slate-50 transition-all py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-slate-500 hover:text-primary active:translate-y-[2px] active:border-b-2 active:shadow-none group">
                             <FileText size={16} /> <span>Get 2 Marks</span>
                          </button>
                          <button className="flex items-center justify-center gap-3 bg-[#1CB0F6] border-b-4 border-[#1898d4] text-white transition-all py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-[#24c0ff] active:translate-y-[2px] active:border-b-2 active:shadow-none group">
                             <Sparkles size={16} /> <span>AI Guide 14M</span>
                          </button>
                       </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
