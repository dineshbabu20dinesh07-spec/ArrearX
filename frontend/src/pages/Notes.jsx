import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Save, Plus, FileText, Clock, PenTool, Hash, Star, LayoutGrid, List, Sparkles, Loader, Edit2, Trash2, MoreVertical } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState({ title: '', content: '', subject: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [editingId, setEditingId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/notes`);
      setNotes(response.data.notes || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!activeNote.content.trim()) return;
    setIsSaving(true);
    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/api/notes/${editingId}`, activeNote);
      } else {
        await axios.post(`${API_BASE_URL}/api/notes`, activeNote);
      }
      setActiveNote({ title: '', content: '', subject: '' });
      setEditingId(null);
      fetchNotes();
    } catch (err) {
      console.error(err);
      alert("Oops macha! Saving failed. Backend check pannu!");
    }
    setIsSaving(false);
  };

  const handleEdit = (note) => {
    setActiveNote({ title: note.title, content: note.content, subject: note.subject });
    setEditingId(note.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note, macha?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/notes/${id}`);
      fetchNotes();
      if (editingId === id) {
        setActiveNote({ title: '', content: '', subject: '' });
        setEditingId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const downloadPDF = async (note) => {
    // We already have jsPDF in index.html via CDN
    const doc = new window.jspdf.jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text(`Subject: ${note.subject || 'ArrearX Study Note'}`, 10, 20);
    doc.setFont("helvetica", "normal");
    doc.text(`Title: ${note.title || 'Untitled'}`, 10, 30);
    doc.text(`Date: ${new Date(note.created_at).toLocaleDateString()}`, 10, 40);
    doc.line(10, 45, 200, 45);
    
    const lines = doc.splitTextToSize(note.content, 180);
    doc.text(lines, 10, 55);
    doc.save(`ArrearX_Note_${note.code || 'Export'}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-secondary font-black uppercase tracking-widest text-[10px] mb-2"
          >
            <PenTool size={14} className="animate-pulse" /> 
            Smart Knowledge Capture
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Matrix <span className="text-secondary italic">Notes.</span></h2>
          <p className="text-gray-500 font-medium">Capture high-yield insights – Auto-save & PDF Export ready.</p>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
           <button 
             onClick={() => setViewMode('grid')}
             className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-secondary text-white shadow-neon-pink' : 'text-slate-500 hover:text-slate-800'}`}
           >
             <LayoutGrid size={20} />
           </button>
           <button 
             onClick={() => setViewMode('list')}
             className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-secondary text-white shadow-neon-pink' : 'text-slate-500 hover:text-slate-800'}`}
           >
             <List size={20} />
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Section */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-8 border-secondary/20 shadow-[0_0_30px_rgba(217,70,239,0.1)] relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-[60px] pointer-events-none rounded-full" />
             
             <div className="space-y-4 mb-8">
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/50 group-focus-within:text-secondary transition-colors"><Hash size={16} /></span>
                  <input 
                    type="text" 
                    placeholder="SUBJECT CODE (e.g. CS3301)"
                    value={activeNote.subject}
                    onChange={e => setActiveNote({...activeNote, subject: e.target.value.toUpperCase()})}
                    className="w-full bg-slate-100 border border-slate-200 rounded-2xl pl-12 pr-6 py-4 outline-none focus:border-secondary/40 text-slate-800 font-black uppercase tracking-widest text-xs transition-all"
                  />
                </div>
                <input 
                  type="text" 
                  placeholder="Note Title..."
                  value={activeNote.title}
                  onChange={e => setActiveNote({...activeNote, title: e.target.value})}
                  className="w-full bg-transparent border-none text-2xl font-black text-slate-800 outline-none placeholder-slate-400 tracking-tight"
                />
             </div>

             <textarea 
               placeholder="Macha, Start writing your key points here... AI Friend buddy ready to help!"
               value={activeNote.content}
               onChange={e => setActiveNote({...activeNote, content: e.target.value})}
               className="w-full h-64 bg-slate-50 border border-slate-200 rounded-3xl p-6 outline-none focus:border-secondary/30 text-slate-700 font-medium leading-relaxed resize-none custom-scrollbar mb-6"
             />

             <button 
               onClick={handleSave}
               disabled={!activeNote.content.trim() || isSaving}
               className="w-full relative overflow-hidden bg-secondary px-6 py-5 rounded-2xl font-bold text-white shadow-[0_0_20px_rgba(217,70,239,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
             >
                <span className="flex items-center justify-center gap-3">
                   {isSaving ? <Loader className="animate-spin" /> : <Save size={20} />}
                   {editingId ? "UPDATE KNOWLEDGE BASE" : "SAVE TO KNOWLEDGE BASE"}
                </span>
             </button>
          </div>
          
          <div className="glass-card p-6 border-slate-200/60 bg-slate-50">
             <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 flex items-center gap-2">
               <Sparkles size={12} className="text-secondary" /> Auto-Sync Active
             </h5>
             <p className="text-xs text-slate-600 font-medium leading-relaxed italic">
               "Macha, notes eduthu vechuko. Arrear clear panna idhu dhaan help pannum. Direct-ah PDF download panna library mode use pannu."
             </p>
          </div>
        </div>

        {/* History Section */}
        <div className="lg:col-span-7">
           <AnimatePresence mode="popLayout">
             {notes.length === 0 ? (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card h-80 flex flex-col items-center justify-center grayscale opacity-30 cyber-grid">
                  <FileText size={60} className="text-slate-400 mb-4" />
                  <p className="font-black uppercase tracking-widest text-[10px]">Vault is currently empty</p>
               </motion.div>
             ) : (
               <motion.div 
                 layout
                 className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-4"}
               >
                 {notes.map((note, idx) => (
                   <motion.div 
                     layout
                     key={note.id}
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ delay: idx * 0.05 }}
                     className="glass-card p-6 flex flex-col group hover:border-secondary/40 transition-all border-slate-200/60 relative"
                   >
                     <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center border border-secondary/20 group-hover:shadow-[0_0_20px_rgba(217,70,239,0.2)] transition-all">
                              <PenTool size={18} className="text-secondary" />
                           </div>
                           <div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-secondary/60">{note.subject || 'No Subject'}</span>
                              <h4 className="text-lg font-black tracking-tight group-hover:text-secondary transition-colors">{note.title || 'Untitled Archive'}</h4>
                           </div>
                        </div>
                        <div className="relative">
                           <button 
                             onClick={() => setOpenMenuId(openMenuId === note.id ? null : note.id)}
                             className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-all text-slate-500 hover:text-slate-800"
                           >
                             <MoreVertical size={16} />
                           </button>
                           <AnimatePresence>
                             {openMenuId === note.id && (
                               <motion.div 
                                 initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                 animate={{ opacity: 1, scale: 1, y: 0 }}
                                 exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                 className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-2xl py-2 z-50"
                               >
                                  <button onClick={() => { handleEdit(note); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm text-slate-700 hover:text-slate-950 flex items-center gap-3">
                                     <Edit2 size={14} className="text-secondary" /> Rewrite Note
                                  </button>
                                  <button onClick={() => { downloadPDF(note); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm text-slate-700 hover:text-slate-950 flex items-center gap-3">
                                     <Download size={14} className="text-primary" /> Download PDF
                                  </button>
                                  <div className="border-t border-slate-100 my-1"></div>
                                  <button onClick={() => { handleDelete(note.id); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-600 hover:text-red-700 flex items-center gap-3">
                                     <Trash2 size={14} /> Delete Archive
                                  </button>
                               </motion.div>
                             )}
                           </AnimatePresence>
                        </div>
                     </div>

                     <p className="text-slate-500 text-sm font-medium line-clamp-3 mb-6 flex-1 italic leading-relaxed">
                       {note.content}
                     </p>
                     
                     <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center text-[10px] text-slate-400 font-black uppercase tracking-widest gap-2">
                           <Clock size={12} /> {new Date(note.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex -space-x-2">
                           <div className="w-6 h-6 rounded-full bg-emerald shadow-neon border-2 border-white" />
                           <div className="w-6 h-6 rounded-full bg-primary border-2 border-white" />
                        </div>
                     </div>
                   </motion.div>
                 ))}
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
