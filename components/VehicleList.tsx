import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Star, Fuel, Settings, Users, ArrowRight, Gauge, ChevronDown, MapPin, Search, SlidersHorizontal, X, Heart } from 'lucide-react';
import { Vehicle } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface VehicleListProps {
  onSelectVehicle: (vehicle: Vehicle) => void;
}

type SortOption = 'price_asc' | 'price_desc' | 'rating' | 'popular';

const VehicleList: React.FC<VehicleListProps> = ({ onSelectVehicle }) => {
  const [filterType, setFilterType] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<number>(3000);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('popular');
  const [showFilters, setShowFilters] = useState(false);
  
  const { toggleWishlist, wishlist, vehicles } = useAuth(); // Use vehicles from context

  // Advanced Filters
  const [transmission, setTransmission] = useState<string>('All');
  const [seats, setSeats] = useState<number | 'All'>('All');

  const categories = ['All', 'Luxury', 'Supercar', 'SUV', 'Car', 'Bike', 'Classic', 'Van'];

  const filteredVehicles = vehicles.filter(v => {
    const typeMatch = filterType === 'All' || v.type === filterType;
    const priceMatch = v.pricePerDay <= priceRange;
    const searchMatch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.location.toLowerCase().includes(searchQuery.toLowerCase());
    const transMatch = transmission === 'All' || v.specs.transmission === transmission;
    const seatsMatch = seats === 'All' || v.specs.seats === seats;
    
    return typeMatch && priceMatch && searchMatch && transMatch && seatsMatch;
  }).sort((a, b) => {
      switch (sortOption) {
          case 'price_asc': return a.pricePerDay - b.pricePerDay;
          case 'price_desc': return b.pricePerDay - a.pricePerDay;
          case 'rating': return b.rating - a.rating;
          default: return 0; // Popular (mock order)
      }
  });

  return (
    <div className="bg-dark-900 min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-12">
            <span className="text-gold-500 text-sm font-bold uppercase tracking-[0.2em] mb-2 block">The Collection</span>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
                <div>
                    <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">Elite Fleet</h2>
                    <p className="text-gray-400 max-w-md font-light">Curated for the extraordinary.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    {/* Search Bar */}
                    <div className="relative flex-grow md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                        <input 
                            type="text" 
                            placeholder="Search cars or locations..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-dark-800 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-white focus:border-gold-500 focus:outline-none placeholder-gray-600"
                        />
                    </div>
                    
                    {/* Filter Toggle (Mobile/Desktop) */}
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all border ${showFilters ? 'bg-gold-500 text-dark-900 border-gold-500' : 'bg-dark-800 text-white border-white/10 hover:border-white/30'}`}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                    </button>

                    {/* Sort Dropdown */}
                    <div className="relative group">
                        <button className="w-full sm:w-auto px-4 py-2.5 rounded-full bg-dark-800 border border-white/10 text-xs font-bold uppercase tracking-wider text-white flex items-center justify-between gap-2 hover:border-white/30">
                            <span>Sort: {sortOption === 'price_asc' ? 'Price: Low to High' : sortOption === 'price_desc' ? 'Price: High to Low' : sortOption === 'rating' ? 'Top Rated' : 'Popular'}</span>
                            <ChevronDown className="w-4 h-4" />
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-dark-800 border border-white/10 rounded-xl shadow-xl overflow-hidden hidden group-hover:block z-30">
                            {[
                                { val: 'popular', label: 'Popular' },
                                { val: 'price_asc', label: 'Price: Low to High' },
                                { val: 'price_desc', label: 'Price: High to Low' },
                                { val: 'rating', label: 'Top Rated' }
                            ].map(opt => (
                                <button 
                                    key={opt.val}
                                    onClick={() => setSortOption(opt.val as SortOption)}
                                    className="block w-full text-left px-4 py-3 text-xs text-gray-300 hover:text-white hover:bg-white/5 uppercase tracking-wide"
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Expandable Filters Panel */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="py-8 border-b border-white/5 grid grid-cols-1 md:grid-cols-4 gap-8">
                            {/* Type Filter */}
                            <div>
                                <h4 className="text-gold-500 text-xs font-bold uppercase tracking-widest mb-4">Vehicle Type</h4>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setFilterType(cat)}
                                            className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wide transition-all border ${
                                            filterType === cat 
                                                ? 'bg-white text-black border-white' 
                                                : 'bg-transparent border-white/10 text-gray-500 hover:text-white hover:border-white/30'
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Slider */}
                            <div>
                                <h4 className="text-gold-500 text-xs font-bold uppercase tracking-widest mb-4">Max Daily Rate</h4>
                                <div className="flex items-center gap-4">
                                    <input 
                                        type="range" 
                                        min="100" 
                                        max="3000" 
                                        step="100" 
                                        value={priceRange} 
                                        onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                        className="w-full accent-gold-500 bg-white/10 h-1 rounded-full appearance-none cursor-pointer"
                                    />
                                    <span className="font-display font-bold text-white w-20">${priceRange}</span>
                                </div>
                            </div>

                             {/* Transmission */}
                             <div>
                                <h4 className="text-gold-500 text-xs font-bold uppercase tracking-widest mb-4">Transmission</h4>
                                <div className="flex gap-2">
                                    {['All', 'Auto', 'Manual'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setTransmission(type)}
                                            className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wide transition-all border ${
                                            transmission === type 
                                                ? 'bg-white text-black border-white' 
                                                : 'bg-transparent border-white/10 text-gray-500 hover:text-white hover:border-white/30'
                                            }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                             {/* Seats */}
                             <div>
                                <h4 className="text-gold-500 text-xs font-bold uppercase tracking-widest mb-4">Seats</h4>
                                <div className="flex gap-2">
                                    {['All', 2, 4, 5, 7].map(num => (
                                        <button
                                            key={num}
                                            onClick={() => setSeats(num === 'All' ? 'All' : Number(num))}
                                            className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wide transition-all border ${
                                            seats === num 
                                                ? 'bg-white text-black border-white' 
                                                : 'bg-transparent border-white/10 text-gray-500 hover:text-white hover:border-white/30'
                                            }`}
                                        >
                                            {num === 'All' ? 'Any' : num}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {filteredVehicles.map((vehicle, index) => (
             <VehicleCard 
               key={vehicle.id} 
               vehicle={vehicle} 
               index={index} 
               onClick={() => onSelectVehicle(vehicle)}
               isWishlisted={wishlist.has(vehicle.id)}
               onToggleWishlist={(e) => { e.stopPropagation(); toggleWishlist(vehicle.id); }}
             />
           ))}
           {filteredVehicles.length === 0 && (
             <div className="col-span-full py-20 text-center text-gray-500">
               <p className="text-lg font-serif">No vehicles found matching your criteria.</p>
               <button onClick={() => {setFilterType('All'); setPriceRange(3000); setSearchQuery(''); setTransmission('All');}} className="text-gold-500 hover:text-white mt-4 text-sm underline">Reset All Filters</button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

interface VehicleCardProps {
  vehicle: Vehicle;
  index: number;
  onClick: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (e: React.MouseEvent) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, index, onClick, isWishlisted, onToggleWishlist }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onClick={onClick}
      className="group relative bg-dark-800 border border-white/5 rounded-sm overflow-hidden hover:border-gold-500/40 transition-all duration-500 cursor-pointer flex flex-col h-full"
    >
       {/* Image Area */}
       <div className="relative h-64 overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-t from-dark-800 to-transparent z-10 opacity-60"></div>
         <img 
           src={vehicle.image} 
           alt={vehicle.name} 
           className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 saturate-[0.8] group-hover:saturate-100"
         />
         
         <div className="absolute top-4 right-4 z-20">
            <div className="bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full flex items-center gap-1">
               <Star className="w-3 h-3 text-gold-500 fill-gold-500" />
               <span className="text-white text-xs font-semibold tracking-wide">{vehicle.rating}</span>
            </div>
         </div>

         {/* Wishlist Button */}
         <div className="absolute top-4 right-20 z-20">
             <button 
                onClick={onToggleWishlist}
                className={`p-1.5 rounded-full bg-black/40 backdrop-blur-md border hover:bg-white/10 transition-colors ${isWishlisted ? 'border-red-500/50 text-red-500' : 'border-white/10 text-white'}`}
             >
                 <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
             </button>
         </div>
         
         {(vehicle.type === 'Luxury' || vehicle.type === 'Supercar') && (
           <div className="absolute top-4 left-4 z-20">
             <div className="bg-gold-500 text-dark-900 px-3 py-1 rounded-sm shadow-lg shadow-gold-500/20">
               <span className="text-[10px] font-bold uppercase tracking-widest">VIP Collection</span>
             </div>
           </div>
         )}
         
         <div className="absolute bottom-4 left-4 z-20 flex items-center text-gray-300 text-xs">
            <MapPin className="w-3 h-3 mr-1 text-gold-500" />
            {vehicle.location}
         </div>
       </div>

       {/* Content Area */}
       <div className="p-6 relative z-20 -mt-10 flex-grow flex flex-col">
         <div className="glass-panel bg-dark-800/90 p-5 backdrop-blur-xl border-t border-white/10 group-hover:border-gold-500/30 transition-colors flex-grow flex flex-col">
            <div className="flex justify-between items-start mb-6">
               <div>
                 <p className="text-gold-500 text-[10px] uppercase tracking-widest mb-1">{vehicle.type}</p>
                 <h3 className="text-xl font-serif text-white group-hover:text-gold-400 transition-colors truncate w-48">{vehicle.name}</h3>
               </div>
               <div className="text-right">
                 <p className="text-xl font-bold font-display text-white">${vehicle.pricePerDay}</p>
                 <p className="text-gray-500 text-[10px] uppercase">/ Day</p>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6 border-y border-white/5 py-4">
               <div className="flex flex-col items-center justify-center border-r border-white/5">
                  <Users className="w-4 h-4 text-gray-500 mb-2 group-hover:text-gold-500 transition-colors" />
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">{vehicle.specs.seats} Seats</p>
               </div>
               <div className="flex flex-col items-center justify-center border-r border-white/5">
                  <Settings className="w-4 h-4 text-gray-500 mb-2 group-hover:text-gold-500 transition-colors" />
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">{vehicle.specs.transmission}</p>
               </div>
               <div className="flex flex-col items-center justify-center">
                  <Fuel className="w-4 h-4 text-gray-500 mb-2 group-hover:text-gold-500 transition-colors" />
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">{vehicle.specs.fuel}</p>
               </div>
            </div>

            <div className="mt-auto w-full py-3 bg-white/5 hover:bg-gold-500 hover:text-dark-900 text-white border border-white/10 hover:border-gold-500 font-bold uppercase text-[10px] tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group">
               View Details
               <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
         </div>
       </div>
    </motion.div>
  );
};

export default VehicleList;