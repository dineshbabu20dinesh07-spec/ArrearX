import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, Settings, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello! I am your ArrearX Academic Assistant. How can I assist you with your studies or exam preparation today?' }
  ]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini');
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeys, setApiKeys] = useState(() => {
    const saved = localStorage.getItem('kingmaker_api_keys');
    return saved ? JSON.parse(saved) : { gemini: '', grok: '', claude: '', deepseek: '' };
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    localStorage.setItem('kingmaker_api_keys', JSON.stringify(apiKeys));
  }, [apiKeys]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const sendMessage = async () => {
    if (!input.trim() && !imagePreview) return;
    
    const userMsg = { role: 'user', content: input, image: imagePreview };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    
    // Extract base64 string from data URL
    let image_b64 = null;
    if (imagePreview) {
       image_b64 = imagePreview.split(',')[1];
    }
    
    // Reset image state
    removeImage();

    try {
      const response = await axios.post(`${API_BASE_URL}/api/chat`, { 
        message: userMsg.content || "Analyze this image.", 
        model: selectedModel,
        image_b64: image_b64,
        custom_keys: apiKeys
      });
      setMessages(prev => [...prev, { 
        role: 'ai',  
        content: response.data.reply,
        ai_image: response.data.ai_image
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: "An error occurred while connecting to the backend server." 
      }]);
    }
    setIsTyping(false);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white shadow-[0_4px_30px_rgba(99,102,241,0.5)] z-50 overflow-hidden group border-2 border-white/10"
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <MessageSquare size={28} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 w-[90vw] md:w-[400px] h-[550px] max-h-[80vh] bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-primary/80 to-secondary/80 flex justify-between items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="flex items-center space-x-3 relative z-10">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30">
                  <Sparkles className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">AI Guide</h3>
                  <div className="flex items-center space-x-2 relative mt-0.5">
                    <p className="text-green-300 text-[10px] flex items-center uppercase tracking-wider font-bold">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                      Online
                    </p>
                    <div className="h-3 w-px bg-white/20"></div>
                    <button 
                      onClick={() => setShowModelMenu(!showModelMenu)}
                      className="text-xs bg-black/40 hover:bg-black/60 text-white border border-white/20 rounded-md px-2 py-0.5 outline-none flex items-center space-x-1 transition-colors"
                    >
                      <span className="capitalize">{selectedModel === 'grok' ? 'Grok (xAI)' : selectedModel === 'claude' ? 'Claude' : selectedModel === 'deepseek' ? 'DeepSeek' : 'Gemini'}</span>
                      <ChevronDown size={12} className={`transition-transform ${showModelMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Custom Model Dropdown Menu */}
                    <AnimatePresence>
                      {showModelMenu && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 mt-2 w-48 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                        >
                          {['gemini', 'grok', 'claude', 'deepseek'].map((modelName) => (
                            <button
                              key={modelName}
                              onClick={() => { setSelectedModel(modelName); setShowModelMenu(false); }}
                              className="w-full text-left px-3 py-2.5 text-sm text-gray-200 hover:bg-white/10 flex items-center justify-between transition-colors"
                            >
                              <span className="capitalize">{modelName === 'grok' ? 'Grok (xAI)' : modelName === 'claude' ? 'Claude 3.5' : modelName}</span>
                              {selectedModel === modelName && <Check size={14} className="text-primary" />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1 relative z-10">
                <button 
                  onClick={() => setShowSettings(!showSettings)}
                  className={`text-white/80 hover:text-white p-2 rounded-full transition-colors ${showSettings ? 'bg-primary/40' : 'hover:bg-white/10'}`}
                >
                  <Settings size={18} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Settings Panel Overlay */}
            <AnimatePresence>
              {showSettings && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-[#0f0f16] border-b border-white/10 overflow-hidden"
                >
                  <div className="p-4 space-y-3">
                    <h4 className="text-white font-bold text-sm mb-2 flex items-center"><Settings size={14} className="mr-1.5 text-primary"/> Agent Settings (Custom API Keys)</h4>
                    <p className="text-xs text-gray-400 mb-3">Leave blank to use default system keys.</p>
                    
                    {['gemini', 'grok', 'claude', 'deepseek'].map(model => (
                      <div key={model} className="flex items-center space-x-2">
                        <span className="text-xs text-gray-300 w-16 capitalize">{model}</span>
                        <input 
                          type="password" 
                          placeholder={`Enter ${model} API Key...`}
                          value={apiKeys[model]}
                          onChange={(e) => setApiKeys({...apiKeys, [model]: e.target.value})}
                          className="flex-1 bg-black/50 border border-white/10 rounded-lg px-2 py-1 text-xs text-white outline-none focus:border-primary/50"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-black/20 custom-scrollbar">
              {messages.map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3.5 rounded-2xl text-[15px] shadow-sm leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-primary text-white rounded-br-sm' 
                      : 'bg-white/5 backdrop-blur-md text-gray-100 border border-white/10 rounded-bl-sm'
                  }`}>
                    {m.image && (
                      <img src={m.image} alt="User upload" className="w-full max-h-48 object-cover rounded-xl mb-2" />
                    )}
                    {m.content}
                    {m.ai_image && (
                      <img src={m.ai_image} alt="AI Generated" className="w-full mt-3 rounded-xl border border-white/20 shadow-lg" />
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl rounded-bl-sm flex space-x-2 border border-white/10">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-black/40 border-t border-white/10">
              {imagePreview && (
                <div className="relative inline-block mb-2">
                  <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-white/20" />
                  <button onClick={removeImage} className="absolute -top-2 -right-2 bg-red-500 rounded-full p-0.5 text-white">
                    <X size={12} />
                  </button>
                </div>
              )}
              <div className="flex items-center bg-black/40 border border-white/10 rounded-2xl focus-within:border-primary/50 transition-colors p-1 relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                </button>
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Message AI..." 
                  className="flex-1 bg-transparent border-none text-white px-2 py-2.5 outline-none placeholder-gray-500 text-[15px]"
                />
                <button 
                  onClick={sendMessage}
                  disabled={!input.trim() && !imagePreview}
                  className="bg-primary hover:bg-secondary disabled:bg-gray-700 disabled:opacity-50 p-2.5 rounded-xl text-white transition-all transform active:scale-95 flex items-center justify-center mr-1 shadow-lg"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
