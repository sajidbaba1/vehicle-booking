import React, { useState } from 'react';
import { Crown, Mail, ArrowRight, Loader } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useNotification();

  const handleSubscribe = async () => {
      if (!email || !email.includes('@')) {
          showToast('Please enter a valid email address', 'error');
          return;
      }
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
          showToast('Successfully subscribed to newsletter', 'success');
          setEmail('');
          setLoading(false);
      }, 1000);
  };

  return (
    <footer className="bg-black border-t border-white/5 pt-24 pb-12 mt-auto relative overflow-hidden">
      {/* Decorative top line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2 pr-8">
            <div className="flex items-center mb-6">
               <div className="border border-gold-500/50 p-1.5 rounded-full mr-3">
                  <Crown className="text-gold-500 h-4 w-4" />
               </div>
               <span className="text-2xl font-serif font-bold text-white tracking-wide">Prestige</span>
            </div>
            <p className="text-gray-500 max-w-sm font-light leading-relaxed mb-8">
              Redefining the art of motion. The world's first AI-integrated luxury vehicle booking platform. 
              Experience bespoke travel tailored to your exact desires.
            </p>
            
            {/* Newsletter */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-md">
               <div className="relative flex-grow">
                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                 <input 
                   type="email" 
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   placeholder="Join our newsletter" 
                   className="w-full bg-white/5 border border-white/10 pl-10 pr-4 py-3 text-sm text-white focus:border-gold-500 focus:outline-none transition-colors" 
                 />
               </div>
               <button 
                 onClick={handleSubscribe}
                 disabled={loading}
                 className="bg-gold-500 text-black px-6 py-3 font-bold uppercase text-xs tracking-wider hover:bg-white transition-colors flex items-center justify-center gap-2 group disabled:opacity-70"
               >
                 {loading ? <Loader className="w-3 h-3 animate-spin" /> : (
                   <>
                     Subscribe
                     <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                   </>
                 )}
               </button>
            </div>
          </div>
          
          {/* Concierge Links */}
          <div>
            <h4 className="text-white font-serif text-lg mb-6 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-gold-500"></span>
              Concierge
            </h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li className="hover:text-gold-500 cursor-pointer transition-colors flex items-center gap-2 group">
                <span className="w-1 h-1 bg-gold-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Browse Collection
              </li>
              <li className="hover:text-gold-500 cursor-pointer transition-colors flex items-center gap-2 group">
                 <span className="w-1 h-1 bg-gold-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                 Bespoke Studio
              </li>
              <li className="hover:text-gold-500 cursor-pointer transition-colors flex items-center gap-2 group">
                 <span className="w-1 h-1 bg-gold-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                 Private Jet Charter
              </li>
              <li className="hover:text-gold-500 cursor-pointer transition-colors flex items-center gap-2 group">
                 <span className="w-1 h-1 bg-gold-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                 Corporate Accounts
              </li>
            </ul>
          </div>

          {/* Contact Links */}
          <div>
            <h4 className="text-white font-serif text-lg mb-6 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-gold-500"></span>
              Contact
            </h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li className="hover:text-white transition-colors font-display tracking-wide">1 (800) PRESTIGE</li>
              <li className="hover:text-white transition-colors">concierge@prestige.com</li>
              <li className="hover:text-white transition-colors">1200 Wilshire Blvd, Los Angeles</li>
              <li className="mt-8 flex gap-6">
                 {['Instagram', 'Twitter', 'LinkedIn'].map(social => (
                   <span key={social} className="text-xs uppercase tracking-wider hover:text-gold-500 cursor-pointer border-b border-transparent hover:border-gold-500 transition-all">{social}</span>
                 ))}
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-600 text-xs tracking-wider uppercase">
            © 2024 Prestige Luxury Motors.
          </div>
          <div className="flex gap-8 text-gray-600 text-xs tracking-wider uppercase">
             <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
             <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
             <span className="hover:text-white cursor-pointer transition-colors">Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;