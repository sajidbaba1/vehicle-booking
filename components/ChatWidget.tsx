import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Minus, Maximize2, Bot, User } from 'lucide-react';
import { sendMessageToAI } from '../services/aiService';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Welcome to Prestige. I am your personal AI Concierge. How may I assist you with your fleet selection today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
        // Prepare history for API
        const history = messages.map(m => ({
            role: m.sender === 'user' ? 'user' as const : 'model' as const,
            parts: [{ text: m.text }]
        }));

        const responseText = await sendMessageToAI(userMsg.text, history);

        const aiMsg: Message = {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            text: responseText,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
        const errorMsg: Message = {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            text: "I apologize, but I'm having trouble connecting to the concierge service right now.",
            timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMsg]);
    } finally {
        setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSend();
      }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} // Keep it somewhat contained
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-dark-800 border border-gold-500/50 shadow-[0_0_20px_rgba(198,166,103,0.3)] flex items-center justify-center group"
          >
             <div className="absolute inset-0 bg-gold-500/10 rounded-full animate-pulse"></div>
             <Bot className="w-8 h-8 text-gold-500" />
             <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-dark-900"></div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-50 w-[380px] h-[600px] max-w-[calc(100vw-40px)] max-h-[calc(100vh-100px)] flex flex-col bg-dark-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-gradient-to-r from-dark-800 to-dark-900 flex justify-between items-center cursor-move">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
                     <Sparkles className="w-5 h-5 text-gold-500" />
                  </div>
                  <div>
                     <h3 className="text-white font-serif font-bold">Prestige AI</h3>
                     <p className="text-[10px] text-green-500 uppercase tracking-widest flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        Online
                     </p>
                  </div>
               </div>
               <div className="flex gap-2">
                  <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white p-1 hover:bg-white/5 rounded">
                     <Minus className="w-4 h-4" />
                  </button>
               </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
               {messages.map((msg) => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                     <div className={`max-w-[85%] rounded-2xl p-4 ${
                        msg.sender === 'user' 
                          ? 'bg-gold-500 text-dark-900 rounded-br-none' 
                          : 'bg-white/10 text-gray-200 rounded-bl-none border border-white/5'
                     }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        <p className={`text-[9px] mt-2 opacity-60 ${msg.sender === 'user' ? 'text-dark-900' : 'text-gray-400'}`}>
                           {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                     </div>
                  </motion.div>
               ))}
               
               {isTyping && (
                  <div className="flex justify-start">
                     <div className="bg-white/10 rounded-2xl rounded-bl-none p-4 flex gap-1 items-center border border-white/5">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                     </div>
                  </div>
               )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-dark-800">
               <div className="relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask about our fleet..."
                    className="w-full bg-dark-900 border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-white focus:border-gold-500 focus:outline-none placeholder-gray-600 transition-colors"
                  />
                  <button 
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="absolute right-1 top-1 p-2 bg-gold-500 rounded-full text-dark-900 hover:bg-white transition-colors disabled:opacity-50 disabled:hover:bg-gold-500"
                  >
                     <Send className="w-4 h-4" />
                  </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;