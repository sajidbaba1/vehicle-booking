import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight, Loader, Terminal, Shield, Briefcase } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role: 'client' | 'vendor' | 'admin') => {
    const demos = {
        client: { email: 'alex@example.com', pass: 'password' },
        vendor: { email: 'vendor@prestige.com', pass: 'password' },
        admin: { email: 'admin@prestige.com', pass: 'password' },
    };
    setEmail(demos[role].email);
    setPassword(demos[role].pass);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-dark-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Decorative Header */}
        <div className="h-1 w-full bg-gold-gradient"></div>
        
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-serif text-white">
              {isLogin ? 'Welcome Back' : 'Join the Elite'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-dark-900 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:border-gold-500 focus:outline-none transition-colors"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-dark-900 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:border-gold-500 focus:outline-none transition-colors"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-dark-900 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:border-gold-500 focus:outline-none transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-xs text-gold-500 hover:text-white transition-colors">
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold-gradient text-dark-900 font-bold uppercase text-xs tracking-widest py-4 rounded-lg hover:shadow-[0_0_20px_rgba(198,166,103,0.3)] transition-all flex items-center justify-center gap-2 mt-6"
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">
              {isLogin ? "Don't have an account?" : "Already a member?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-white font-bold hover:text-gold-500 transition-colors"
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>

          {/* Demo Logins */}
          {isLogin && (
              <div className="mt-8 pt-6 border-t border-white/5">
                 <p className="text-xs text-gray-500 mb-4 text-center uppercase tracking-widest font-bold">Quick Demo Access</p>
                 <div className="grid grid-cols-3 gap-3">
                     <button 
                         onClick={() => handleDemoLogin('client')}
                         className="flex flex-col items-center justify-center p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-gold-500/10 hover:border-gold-500/30 transition-all group"
                     >
                         <User className="w-4 h-4 mb-1 text-gray-400 group-hover:text-gold-500" />
                         <span className="text-[10px] text-gray-300 group-hover:text-white uppercase tracking-wider">Client</span>
                     </button>
                     <button 
                         onClick={() => handleDemoLogin('vendor')}
                         className="flex flex-col items-center justify-center p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-gold-500/10 hover:border-gold-500/30 transition-all group"
                     >
                         <Briefcase className="w-4 h-4 mb-1 text-gray-400 group-hover:text-gold-500" />
                         <span className="text-[10px] text-gray-300 group-hover:text-white uppercase tracking-wider">Vendor</span>
                     </button>
                     <button 
                         onClick={() => handleDemoLogin('admin')}
                         className="flex flex-col items-center justify-center p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-gold-500/10 hover:border-gold-500/30 transition-all group"
                     >
                         <Shield className="w-4 h-4 mb-1 text-gray-400 group-hover:text-gold-500" />
                         <span className="text-[10px] text-gray-300 group-hover:text-white uppercase tracking-wider">Admin</span>
                     </button>
                 </div>
              </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;