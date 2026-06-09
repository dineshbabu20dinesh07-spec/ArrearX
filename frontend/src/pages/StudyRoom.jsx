import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Search, Play, Sparkles, MessageCircle, Info, Bookmark, ExternalLink, Loader2, MonitorPlay, Maximize2, ChevronLeft, X, Bot, Zap, Activity } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const SUGGESTED_TOPICS = [
  'Data Structures Tamil', 'Python Programming Tamil', 'Matrices Anna Univ',
  'Operating Systems Tamil', 'Computer Networks Tamil', 'SQL Tutorials Tamil'
];

export default function StudyRoom() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Macha! Enna topic padikkanum? Topic name search pannu, naane best video direct-ah kondu varen! 😊" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [searchTopic, setSearchTopic] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const searchAndEmbed = async (topic) => {
    const query = topic || searchTopic;
    if (!query.trim()) return;

    setIsSearching(true);
    setSearchResults([]);

    try {
      const response = await axios.get(`${API_BASE_URL}/api/yt?q=${query}`);
      const results = response.data.results || [];
      setSearchResults(results);
      
      if (results.length > 0) {
        // We don't auto-set active video anymore, user chooses from list
        setMessages(prev => [...prev, { 
          role: 'ai', 
          content: `Sema! Naan ${results.length} best video tutorials kandu puduchuten for "${query}". Topic-ah select panni padikka start pannu macha! 🦾` 
        }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          content: `Sorry macha, andha topic-ku direct videos kedaikala. Vera topic try pannu da! 😅` 
        }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: "Oops! YouTube search-la problem. Backend check pannu da! 🚧" 
      }]);
    }
    setIsSearching(false);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/chat`, { message: currentInput });
      setMessages(prev => [...prev, { role: 'ai', content: response.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: "Oops! Backend start aagiducha nu check pannu da. FastAPI is missing my requests! 🤖" 
      }]);
    }
    setIsTyping(false);
  };

  return (
    <div className="h-[85vh] relative overflow-hidden font-sans">
      <AnimatePresence mode="wait">
        {!isFullScreen ? (
          <motion.div 
            key="normal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col xl:flex-row gap-8 h-full"
          >
            {/* Left Col: Stream Interface */}
            <div className="flex-1 flex flex-col gap-6 overflow-hidden">
              <AnimatePresence mode="wait">
                {!activeVideoId ? (
                  <motion.div 
                    key="search-mode"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex-1 flex flex-col gap-6 overflow-hidden"
                  >
                    {/* Search Bar HUD */}
                    <div className="glass-card-advanced p-4 border-slate-200 bg-slate-50 shrink-0">
                      <div className="flex gap-4">
                        <div className="flex-1 relative group">
                          <input 
                            type="text" 
                            value={searchTopic}
                            onChange={(e) => setSearchTopic(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && searchAndEmbed()}
                            placeholder="Search topics to study... (e.g. Data Structures)"
                            className="w-full bg-white border border-slate-200/80 rounded-xl px-5 py-3.5 outline-none focus:border-primary/50 text-slate-800 font-bold transition-all text-sm group-hover:bg-slate-50 shadow-inner"
                          />
                          <button 
                            onClick={() => searchAndEmbed()}
                            disabled={isSearching}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary p-2.5 rounded-lg hover:scale-105 transition-all shadow-neon disabled:opacity-50"
                          >
                            {isSearching ? <Loader2 className="animate-spin text-white" size={18} /> : <Search size={18} className="text-white" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Full Grid Results */}
                    <div className="flex-1 glass-card-advanced p-6 border-slate-200/60 bg-white overflow-hidden flex flex-col shadow-inner">
                      <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-4">
                         <h5 className="text-[10px] font-display font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                           <MonitorPlay size={14} className="text-primary" /> Available Lessons
                         </h5>
                         {searchResults.length > 0 && (
                           <span className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/30">
                             {searchResults.length} Videos Found
                           </span>
                         )}
                      </div>
                      
                      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4">
                        {searchResults.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {searchResults.map((video, idx) => (
                              <motion.button 
                                whileHover={{ scale: 1.02, y: -5 }}
                                key={idx}
                                onClick={() => setActiveVideoId(video.id)}
                                className="group relative flex flex-col rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 hover:border-primary/30 hover:bg-white transition-all text-left shadow-sm"
                              >
                                <div className="relative aspect-video w-full overflow-hidden">
                                  <img src={video.thumbnail} alt="thumb" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-neon">
                                      <Play size={20} className="text-white ml-1" fill="currentColor" />
                                    </div>
                                  </div>
                                  <div className="absolute bottom-2 left-2 bg-black/70 text-[9px] font-black text-white px-2 py-1 rounded-lg">
                                    #{idx + 1}
                                  </div>
                                </div>
                                <div className="p-4">
                                  <p className="text-[11px] font-bold text-slate-800 line-clamp-2 group-hover:text-primary transition-colors mb-2">
                                    {video.title}
                                  </p>
                                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">{video.channel}</p>
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
                            <MonitorPlay size={64} className="mb-4" />
                            <p className="text-sm font-black uppercase tracking-widest text-center">Search for a topic to start your session</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="player-mode"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex-1 flex flex-col gap-6 overflow-hidden"
                  >
                    {/* Back Button Area */}
                    <div className="flex items-center justify-between">
                      <button 
                        onClick={() => setActiveVideoId(null)}
                        className="flex items-center gap-2 text-[10px] font-display font-black uppercase tracking-widest text-primary bg-primary/10 px-6 py-3 rounded-2xl border border-primary/30 hover:bg-primary/20 transition-all hover:shadow-neon group"
                      >
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Lessons
                      </button>
                      <button 
                        onClick={() => setIsFullScreen(true)}
                        className="flex items-center gap-2 text-[10px] font-display font-black uppercase tracking-widest text-slate-400 hover:text-slate-800 transition-colors"
                      >
                        <Maximize2 size={16} /> Wide Mode
                      </button>
                    </div>

                    {/* Active Stream Player */}
                    <div className="flex-1 glass-card-advanced relative overflow-hidden flex flex-col border-slate-200/60 bg-white">
                      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/40">
                            <Zap className="text-primary" size={16} fill="currentColor" />
                          </div>
                          <h3 className="font-display font-black text-[10px] uppercase tracking-[0.2em] text-slate-500">Digital Stream Active</h3>
                        </div>
                      </div>

                      <div className="flex-1 bg-black overflow-hidden relative">
                        <iframe
                          src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0`}
                          title="ALLCLEAR Player"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full border-none relative z-10"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Col: Advanced AI HUD Sidebar */}
            <div className="w-full xl:w-[420px] flex flex-col gap-6 shrink-0 h-full">
              <div className="glass-card-advanced flex-1 flex flex-col overflow-hidden border-slate-200 bg-white relative group shadow-lg">
                {/* HUD Header */}
                <div className="p-6 bg-gradient-to-br from-primary/5 via-transparent to-transparent border-b border-slate-200 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] -mr-16 -mt-16 animate-pulse"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/30 shadow-neon">
                        <Bot className="text-primary" size={24} />
                      </div>
                      <div>
                        <h4 className="font-display font-black tracking-tight text-slate-900 group-hover:text-primary transition-colors text-lg">ALLCLEAR AI</h4>
                        <div className="flex items-center text-[10px] text-emerald font-black uppercase tracking-[0.2em] mt-1">
                          <span className="w-2 h-2 bg-emerald rounded-full mr-2 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" /> SYNC_STABLE
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Buddy OS 4.0</span>
                       <div className="flex gap-1">
                          {[1,2,3].map(i => <div key={i} className="w-1 h-3 bg-primary/20 rounded-full"></div>)}
                       </div>
                    </div>
                  </div>
                </div>

                {/* HUD Chat Feed */}
                <div className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar bg-slate-50/50 cyber-grid">
                  <AnimatePresence>
                    {messages.map((m, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: m.role === 'user' ? 30 : -30, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        key={i} 
                        className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[85%] py-3 px-4 rounded-2xl text-[13px] font-medium leading-relaxed relative group/msg
                          ${m.role === 'user' 
                            ? 'bg-primary text-white rounded-br-none shadow-neon' 
                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                          }`}
                        >
                          {m.content}
                          {m.role === 'ai' && (
                            <div className="absolute -left-2 top-0 w-1 h-full bg-primary/40 rounded-full blur-[2px]"></div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                      <div className="bg-white border border-slate-200 p-5 rounded-2xl rounded-bl-none flex items-center space-x-3 shadow-sm">
                         <Loader2 className="animate-spin text-primary" size={16} />
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Processing Core...</span>
                      </div>
                    </motion.div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* HUD Input Bar */}
                <div className="p-6 bg-slate-50 border-t border-slate-200">
                  <div className="flex items-center bg-white border border-slate-200 rounded-xl focus-within:border-primary/50 transition-all p-1 shadow-md shadow-slate-100">
                    <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Input Request to AllClear AI..." 
                      className="flex-1 bg-transparent border-none text-slate-800 px-4 py-2.5 outline-none placeholder-slate-400 text-sm font-bold font-sans"
                    />
                    <button 
                      onClick={sendMessage}
                      disabled={!input.trim()}
                      className="bg-primary hover:bg-secondary disabled:bg-gray-200 p-2.5 rounded-lg text-white transition-all transform active:scale-95 flex items-center justify-center shadow-neon"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="full"
            initial={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
            className="fixed inset-0 z-[200] bg-[#050508] p-4 md:p-8 flex flex-col"
          >
            {/* Immersive HUD Header */}
            <div className="flex justify-between items-center mb-8 px-4">
              <div className="flex items-center space-x-6">
                <button 
                  onClick={() => setIsFullScreen(false)}
                  className="w-14 h-14 bg-white/5 hover:bg-primary/20 rounded-[1.5rem] flex items-center justify-center border border-white/10 transition-all group shadow-2xl backdrop-blur-md"
                >
                  <ChevronLeft className="text-white group-hover:-translate-x-1 transition-transform" size={28} />
                </button>
                <div>
                  <h3 className="text-white font-display font-black uppercase text-sm tracking-[0.2em] mb-1">TERMINATE_IMMERSION</h3>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse mr-3 shadow-neon"></div>
                    <p className="text-primary text-[10px] uppercase font-black tracking-[0.4em]">ALLCLEAR_LIVE_CORE_ACTIVE</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                 <div className="hidden md:flex flex-col items-end">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Visualization Stream</span>
                    <span className="text-xs font-black text-primary uppercase font-display italic">Macha Edition v1.0</span>
                 </div>
                 <div className="w-16 h-16 bg-primary/10 border border-primary/30 rounded-3xl flex items-center justify-center">
                    <MonitorPlay className="text-primary" size={32} />
                 </div>
              </div>
            </div>

            {/* Immersive Video Canvas */}
            <div className="flex-1 bg-black rounded-[3rem] overflow-hidden shadow-[0_0_120px_rgba(99,102,241,0.2)] border border-primary/20 relative group">
               <div className="absolute inset-0 border-[20px] border-white/[0.02] pointer-events-none rounded-[3rem] z-20"></div>
               <iframe
                src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0`}
                title="ALLCLEAR Stream Engine"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-none relative z-10"
              />
            </div>
            
            {/* Bottom HUD Bar */}
            <div className="mt-8 flex justify-center">
               <div className="px-10 py-3 glass-card rounded-full border-primary/20 flex items-center space-x-8">
                  <div className="flex items-center gap-2">
                     <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                     <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Decryption Stable</span>
                  </div>
                  <div className="w-px h-4 bg-white/10"></div>
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Audio Stream 44kHz</span>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
