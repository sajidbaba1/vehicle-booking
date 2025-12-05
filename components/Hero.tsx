import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowRight, Sparkles, Star, Crown, CarFront, ChevronDown } from 'lucide-react';

interface HeroProps {
  onBrowse: () => void;
}

const Hero: React.FC<HeroProps> = ({ onBrowse }) => {
  const [vehicleType, setVehicleType] = useState('Supercar');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const vehicleTypes = ['Supercar', 'Luxury SUV', 'Vintage', 'Electric', 'Motorcycle', 'Private Van'];

  return (
    <div className="relative min-h-screen flex items-center bg-dark-900 overflow-hidden pt-20">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-gold-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-zinc-800/20 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-gold-500/30 rounded-full bg-gold-500/5 mb-8">
              <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
              <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">Premium Fleet Available</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-serif font-medium text-white leading-[1.1] mb-8">
              Drive <span className="text-transparent bg-clip-text bg-gold-gradient italic pr-2">Luxury</span>,<br />
              Arrive Iconic.
            </h1>
            
            <p className="text-lg text-gray-400 max-w-lg mb-12 font-light leading-relaxed">
              AI-curated premium vehicles for every occasion. From the raw power of Italian engineering to the refined silence of electric performance.
            </p>

            {/* Premium Search Bar */}
            <div className="glass-panel p-2 rounded-2xl flex flex-col md:flex-row gap-0 md:divide-x md:divide-white/5 max-w-3xl gold-glow relative z-20">
               
               {/* Location Input */}
               <div className="flex-1 flex items-center px-6 h-20 md:h-20 border-b md:border-b-0 border-white/5">
                  <MapPin className="text-gold-500 h-5 w-5 mr-4 shrink-0" />
                  <div className="flex flex-col w-full">
                    <span className="text-[10px] uppercase text-gray-500 tracking-wider font-bold mb-1">Location</span>
                    <input 
                      type="text" 
                      placeholder="Monaco, MC" 
                      className="bg-transparent border-none text-white w-full focus:outline-none placeholder-gray-600 font-serif text-lg p-0"
                    />
                  </div>
               </div>

               {/* Date Input */}
               <div className="flex-1 flex items-center px-6 h-20 md:h-20 border-b md:border-b-0 border-white/5">
                  <Calendar className="text-gold-500 h-5 w-5 mr-4 shrink-0" />
                  <div className="flex flex-col w-full">
                    <span className="text-[10px] uppercase text-gray-500 tracking-wider font-bold mb-1">Pick-up Date</span>
                    <input 
                      type="text" 
                      placeholder="Oct 24, 2024" 
                      className="bg-transparent border-none text-white w-full focus:outline-none placeholder-gray-600 font-serif text-lg p-0"
                    />
                  </div>
               </div>

               {/* Vehicle Type Dropdown */}
               <div className="flex-1 flex items-center px-6 h-20 md:h-20 relative">
                  <CarFront className="text-gold-500 h-5 w-5 mr-4 shrink-0" />
                  <div 
                    className="flex flex-col w-full cursor-pointer"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span className="text-[10px] uppercase text-gray-500 tracking-wider font-bold mb-1">Vehicle Type</span>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-serif text-lg">{vehicleType}</span>
                      <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                  
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-dark-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden py-2 z-50">
                      {vehicleTypes.map(type => (
                        <div 
                          key={type}
                          onClick={() => { setVehicleType(type); setIsDropdownOpen(false); }}
                          className="px-6 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 cursor-pointer transition-colors"
                        >
                          {type}
                        </div>
                      ))}
                    </div>
                  )}
               </div>

               {/* Search Button */}
               <div className="p-2">
                 <button 
                    onClick={onBrowse}
                    className="h-full w-full md:w-auto px-8 bg-gold-gradient text-dark-900 font-bold text-sm uppercase tracking-widest rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20"
                 >
                   Search
                 </button>
               </div>
            </div>
            
            <div className="mt-12 flex items-center gap-8 border-t border-white/5 pt-8 max-w-lg">
               <div>
                 <p className="text-3xl font-serif text-white">25k+</p>
                 <p className="text-xs text-gray-500 uppercase tracking-wider">Elite Members</p>
               </div>
               <div className="h-8 w-[1px] bg-white/10"></div>
               <div>
                 <p className="text-3xl font-serif text-white">4.98</p>
                 <p className="text-xs text-gray-500 uppercase tracking-wider">Average Rating</p>
               </div>
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
             {/* Main Card */}
             <div className="relative z-10 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl shadow-black bg-dark-800 group cursor-pointer" onClick={onBrowse}>
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-80 z-10"></div>
                
                {/* Image overlay gradient */}
                <div className="absolute inset-0 bg-gold-500/5 group-hover:bg-gold-500/0 transition-colors duration-500 mix-blend-overlay z-10"></div>

                <img 
                  src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop" 
                  alt="Luxury Car" 
                  className="w-full aspect-[4/5] object-cover transform group-hover:scale-105 transition-transform duration-1000 grayscale-[20%] group-hover:grayscale-0"
                />
                
                <div className="absolute top-6 right-6 z-20">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-full">
                    <Sparkles className="text-gold-400 w-6 h-6 animate-pulse" />
                  </div>
                </div>

                <div className="absolute bottom-8 left-8 right-8 z-20">
                   <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-dark-900/80 backdrop-blur-xl">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-gold-500 text-xs font-bold uppercase tracking-widest mb-1">Featured Deal</p>
                          <h3 className="text-3xl text-white font-serif italic">Porsche 911 GT3</h3>
                        </div>
                      </div>
                      <div className="flex items-end justify-between">
                         <div>
                            <span className="text-2xl text-white font-sans font-bold">$1,250</span>
                            <span className="text-gray-400 text-sm ml-1">/ day</span>
                         </div>
                         <div className="h-10 w-10 rounded-full bg-white text-dark-900 flex items-center justify-center group-hover:bg-gold-500 transition-colors">
                            <ArrowRight className="w-5 h-5" />
                         </div>
                      </div>
                   </div>
                </div>
             </div>
             
             {/* Floating Badge */}
             <motion.div 
               animate={{ y: [0, -15, 0] }}
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-20 -left-12 hidden lg:flex items-center gap-4 bg-dark-800 p-4 pr-6 rounded-full border border-gold-500/20 shadow-xl z-20"
             >
                <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center text-dark-900">
                   <Crown className="w-5 h-5 fill-current" />
                </div>
                <div>
                   <p className="text-gold-400 text-[10px] uppercase tracking-wider font-bold">Voted #1</p>
                   <p className="text-white text-sm font-serif">Luxury Experience</p>
                </div>
             </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;