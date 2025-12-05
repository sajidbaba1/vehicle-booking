import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Sparkles, Crown, Bell, Moon, Sun, UserCircle, LogOut, Settings, CreditCard, Heart, CheckCircle, LogIn, AlertCircle, Shield, Store } from 'lucide-react';
import { ViewState } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import AuthModal from './AuthModal';

interface NavbarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onChangeView }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotification();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { label: 'Residence', view: ViewState.HOME, icon: Crown },
    { label: 'Elite Fleet', view: ViewState.BROWSE, icon: Car },
    { label: 'Bespoke AI', view: ViewState.AI_GENERATOR, icon: Sparkles },
  ];

  const handleProfileClick = () => {
    onChangeView(ViewState.PROFILE);
    setShowProfile(false);
  };

  const getNotifIcon = (type: string) => {
      switch(type) {
          case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
          case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
          case 'warning': return <Bell className="w-4 h-4 text-gold-500" />;
          default: return <Bell className="w-4 h-4 text-blue-500" />;
      }
  };

  return (
    <>
    <nav className="fixed w-full top-0 z-50 bg-dark-900/80 backdrop-blur-md border-b border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          
          {/* LEFT: Logo Area */}
          <div className="flex-shrink-0 flex items-center cursor-pointer group" onClick={() => onChangeView(ViewState.HOME)}>
            <div className="relative">
              <div className="absolute inset-0 bg-gold-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative border border-gold-500/30 p-2 rounded-full mr-3"
              >
                <Crown className="text-gold-500 h-6 w-6" />
              </motion.div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-serif font-bold text-white tracking-wide">
                Prestige
              </span>
            </div>
          </div>

          {/* CENTER: Navigation Links */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-1 bg-white/5 rounded-full px-2 py-1 border border-white/5 backdrop-blur-sm">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => onChangeView(item.view)}
                  className={`relative px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                    currentView === item.view
                      ? 'text-dark-900'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {currentView === item.view && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-gold-gradient rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-6">
            
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="text-gray-400 hover:text-gold-500 transition-colors p-2 rounded-full hover:bg-white/5"
            >
              {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            {isAuthenticated && (
              <div className="relative" ref={notifRef}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative cursor-pointer group p-2 rounded-full hover:bg-white/5 transition-colors"
                >
                  <Bell className={`h-5 w-5 transition-colors ${showNotifications ? 'text-gold-500' : 'text-gray-400 group-hover:text-gold-500'}`} />
                  {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border border-dark-900 animate-pulse"></span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-80 bg-dark-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden glass-panel z-50"
                    >
                      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                        <span className="text-white font-serif font-bold">Notifications</span>
                        <button 
                            onClick={markAllAsRead}
                            className="text-[10px] text-gold-500 uppercase tracking-widest cursor-pointer hover:underline disabled:opacity-50"
                            disabled={unreadCount === 0}
                        >
                            Mark all read
                        </button>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map(n => (
                            <div 
                                key={n.id} 
                                onClick={() => markAsRead(n.id)}
                                className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${!n.isRead ? 'bg-gold-500/5' : ''}`}
                            >
                                <div className="flex gap-3">
                                    <div className="mt-1">
                                        {getNotifIcon(n.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className={`text-sm font-medium ${!n.isRead ? 'text-white' : 'text-gray-300'}`}>{n.title}</p>
                                            {!n.isRead && <span className="h-1.5 w-1.5 bg-gold-500 rounded-full"></span>}
                                        </div>
                                        <p className="text-xs text-gray-400 leading-relaxed mb-2">{n.message}</p>
                                        <p className="text-[10px] text-gray-600 uppercase">
                                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500 text-xs">
                                No notifications yet.
                            </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Profile / Auth */}
            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <div 
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center gap-3 pl-6 border-l border-white/10 cursor-pointer group"
                >
                  <div className="text-right hidden lg:block">
                    <p className="text-xs text-white font-bold">{user?.name}</p>
                    <p className="text-[10px] text-gold-500 uppercase tracking-widest">{user?.tier} Member</p>
                  </div>
                  <div className={`h-10 w-10 rounded-full bg-gradient-to-br from-zinc-800 to-black border flex items-center justify-center overflow-hidden transition-colors ${showProfile ? 'border-gold-500' : 'border-white/10 group-hover:border-gold-500/50'}`}>
                      {user?.avatar ? (
                        <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                      ) : (
                        <UserCircle className={`h-6 w-6 transition-colors ${showProfile ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                      )}
                  </div>
                </div>

                <AnimatePresence>
                  {showProfile && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-64 bg-dark-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden glass-panel z-50"
                    >
                      <div className="p-4 border-b border-white/5 bg-white/5">
                        <p className="text-white font-bold">{user?.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                      </div>
                      <div className="py-2">
                        <button onClick={handleProfileClick} className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-colors">
                            <UserCircle className="w-4 h-4 text-gold-500" />
                            My Profile
                        </button>
                        <button onClick={handleProfileClick} className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-colors">
                            <CreditCard className="w-4 h-4 text-gold-500" />
                            Bookings & Wallet
                        </button>
                        
                        {/* Vendor Link */}
                        {user?.role === 'vendor' && (
                            <button 
                                onClick={() => { onChangeView(ViewState.ADMIN); setShowProfile(false); }}
                                className="w-full text-left px-4 py-3 text-sm text-gold-400 hover:text-gold-300 hover:bg-white/5 flex items-center gap-3 transition-colors border-t border-white/5"
                            >
                                <Store className="w-4 h-4" />
                                Vendor Portal
                            </button>
                        )}

                        {/* Admin Link */}
                        {user?.role === 'admin' && (
                            <button 
                                onClick={() => { onChangeView(ViewState.ADMIN); setShowProfile(false); }}
                                className="w-full text-left px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 flex items-center gap-3 transition-colors border-t border-white/5"
                            >
                                <Shield className="w-4 h-4" />
                                Admin Dashboard
                            </button>
                        )}
                      </div>
                      <div className="border-t border-white/5 py-2">
                        <button 
                          onClick={() => logout()}
                          className="w-full text-left px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 flex items-center gap-3 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gold-500 hover:text-white transition-colors pl-6 border-l border-white/10"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}
            
          </div>

        </div>
      </div>
    </nav>
    <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Navbar;