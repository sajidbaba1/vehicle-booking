import React from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { ViewState } from '../types';

interface HeroProps {
  onBrowse: () => void;
}

const Hero: React.FC<HeroProps> = ({ onBrowse }) => {
  return (
    <div className="relative overflow-hidden bg-darker">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">
              Drive the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Extraordinary
              </span>
            </h1>
            <p className="mt-6 text-lg text-gray-400 max-w-lg">
              Unlock a fleet of premium cars, agile bikes, and heavy-duty vans. 
              Experience the future of mobility with our AI-curated selection.
            </p>

            <div className="mt-10 p-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl flex flex-col sm:flex-row gap-2">
               <div className="flex-1 flex items-center px-4 h-14 bg-dark/50 rounded-xl border border-white/5 focus-within:border-primary/50 transition-colors">
                  <MapPin className="text-gray-400 h-5 w-5 mr-3" />
                  <input 
                    type="text" 
                    placeholder="Location" 
                    className="bg-transparent border-none text-white w-full focus:outline-none placeholder-gray-500"
                  />
               </div>
               <div className="flex-1 flex items-center px-4 h-14 bg-dark/50 rounded-xl border border-white/5 focus-within:border-primary/50 transition-colors">
                  <Calendar className="text-gray-400 h-5 w-5 mr-3" />
                  <input 
                    type="text" 
                    placeholder="Date" 
                    className="bg-transparent border-none text-white w-full focus:outline-none placeholder-gray-500"
                  />
               </div>
               <button 
                  onClick={onBrowse}
                  className="h-14 px-8 bg-primary hover:bg-emerald-400 text-darker font-bold rounded-xl transition-all flex items-center justify-center gap-2"
               >
                 <Search className="h-5 w-5" />
                 Search
               </button>
            </div>
            
            <div className="mt-8 flex items-center gap-6">
               <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <img key={i} src={`https://picsum.photos/id/${i+50}/100/100`} alt="User" className="w-10 h-10 rounded-full border-2 border-darker" />
                  ))}
               </div>
               <div className="text-sm text-gray-400">
                  <span className="text-white font-bold">12k+</span> Happy Riders
               </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
             <div className="relative z-10 rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-primary/20 group cursor-pointer" onClick={onBrowse}>
                <div className="absolute inset-0 bg-gradient-to-t from-darker via-transparent to-transparent opacity-60"></div>
                <img 
                  src="https://picsum.photos/id/1071/1000/800" 
                  alt="Hero Car" 
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-6 left-6 right-6">
                   <div className="flex justify-between items-end">
                      <div>
                        <p className="text-primary font-semibold mb-1">Featured Deal</p>
                        <h3 className="text-2xl text-white font-bold">Shelby GT500</h3>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
                         <span className="text-white font-bold text-xl">$145</span>
                         <span className="text-gray-300 text-xs">/day</span>
                      </div>
                   </div>
                </div>
             </div>
             
             {/* Decorative floating card */}
             <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -bottom-6 -left-6 bg-darker p-4 rounded-2xl border border-white/10 shadow-xl z-20 flex items-center gap-4"
             >
                <div className="p-3 bg-secondary/20 rounded-xl text-secondary">
                   <Sparkles className="h-6 w-6" />
                </div>
                <div>
                   <p className="text-gray-400 text-xs">AI Powered</p>
                   <p className="text-white font-bold text-sm">Smart Matching</p>
                </div>
             </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;