import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Vehicle } from '../types';

interface BookingChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle;
}

interface ChatMessage {
    id: string;
    sender: 'user' | 'vendor';
    text: string;
    timestamp: string;
}

const BookingChatModal: React.FC<BookingChatModalProps> = ({ isOpen, onClose, vehicle }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize with greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
        setMessages([
            {
                id: '1',
                sender: 'vendor',
                text: `Hello! I'm the fleet manager for the ${vehicle.name}. How can I help you with your booking inquiry?`,
                timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            }
        ]);
    }
  }, [isOpen, vehicle.name]);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
      if (!input.trim()) return;

      const newMsg: ChatMessage = {
          id: Date.now().toString(),
          sender: 'user',
          text: input,
          timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      };

      setMessages(prev => [...prev, newMsg]);
      setInput('');

      // Simulate vendor reply
      setTimeout(() => {
          const reply: ChatMessage = {
              id: (Date.now() + 1).toString(),
              sender: 'vendor',
              text: "Thank you for your message. I'll check the specific availability for those dates and get back to you shortly.",
              timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
          };
          setMessages(prev => [...prev, reply]);
      }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-dark-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[600px]"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-dark-900 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="relative">
                   <img src={vehicle.image} alt="Vendor" className="w-10 h-10 rounded-full object-cover border border-white/20" />
                   <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 border border-dark-900">
                      <ShieldCheck className="w-3 h-3 text-white" />
                   </div>
                </div>
                <div>
                    <h3 className="text-white font-bold text-sm">Vendor Chat</h3>
                    <p className="text-xs text-gray-400">Re: {vehicle.name}</p>
                </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
            </button>
        </div>

        {/* Messages Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark-900/50">
             {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                     <div className={`max-w-[80%] rounded-xl p-3 ${
                        msg.sender === 'user' 
                          ? 'bg-gold-600 text-white rounded-br-none' 
                          : 'bg-dark-700 text-gray-200 rounded-bl-none border border-white/5'
                     }`}>
                        <p className="text-sm">{msg.text}</p>
                        <p className="text-[10px] mt-1 opacity-70 text-right">{msg.timestamp}</p>
                     </div>
                  </div>
             ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-dark-800 border-t border-white/10">
            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message to the vendor..."
                    className="flex-1 bg-dark-900 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-gold-500 focus:outline-none"
                />
                <button 
                    onClick={handleSend}
                    className="bg-gold-500 text-dark-900 p-2 rounded-lg hover:bg-white transition-colors"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingChatModal;