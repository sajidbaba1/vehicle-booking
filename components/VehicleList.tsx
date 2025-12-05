import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Star, Fuel, Settings, Users, ArrowRight } from 'lucide-react';
import { VEHICLES } from '../constants';
import { Vehicle } from '../types';

const VehicleList: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');

  const categories = ['All', 'Car', 'Bike', 'SUV', 'Luxury', 'Van'];

  const filteredVehicles = filter === 'All' 
    ? VEHICLES 
    : VEHICLES.filter(v => v.type === filter);

  return (
    <div className="bg-darker min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
           <div>
              <h2 className="text-3xl font-bold text-white mb-2">Our Premium Fleet</h2>
              <p className="text-gray-400">Choose from the world's finest machines.</p>
           </div>
           
           <div className="mt-6 md:mt-0 flex overflow-x-auto pb-2 md:pb-0 gap-2 no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    filter === cat 
                      ? 'bg-primary text-darker font-bold' 
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
              <button className="px-4 py-2 rounded-full bg-white/5 text-gray-400 hover:bg-white/10 flex items-center gap-2">
                 <Filter className="w-4 h-4" /> Filters
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {filteredVehicles.map((vehicle, index) => (
             <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} />
           ))}
        </div>
      </div>
    </div>
  );
};

interface VehicleCardProps {
  vehicle: Vehicle;
  index: number;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-dark border border-white/5 rounded-2xl overflow-hidden hover:border-primary/50 transition-colors duration-300"
    >
       <div className="relative h-48 overflow-hidden">
         <img 
           src={vehicle.image} 
           alt={vehicle.name} 
           className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
         />
         <div className="absolute top-3 right-3 bg-darker/80 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-white text-xs font-bold">{vehicle.rating}</span>
         </div>
         {vehicle.type === 'Luxury' && (
           <div className="absolute top-3 left-3 bg-secondary/90 px-2 py-1 rounded-lg">
             <span className="text-white text-xs font-bold uppercase">Premium</span>
           </div>
         )}
       </div>

       <div className="p-5">
         <div className="flex justify-between items-start mb-4">
           <div>
             <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{vehicle.name}</h3>
             <p className="text-gray-500 text-sm">{vehicle.type}</p>
           </div>
           <div className="text-right">
             <p className="text-xl font-bold text-white">${vehicle.pricePerDay}</p>
             <p className="text-gray-500 text-xs">/day</p>
           </div>
         </div>

         <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="bg-white/5 rounded-lg p-2 text-center">
               <Users className="w-4 h-4 text-gray-400 mx-auto mb-1" />
               <p className="text-xs text-gray-300">{vehicle.specs.seats} Seats</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center">
               <Settings className="w-4 h-4 text-gray-400 mx-auto mb-1" />
               <p className="text-xs text-gray-300">{vehicle.specs.transmission}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center">
               <Fuel className="w-4 h-4 text-gray-400 mx-auto mb-1" />
               <p className="text-xs text-gray-300">{vehicle.specs.fuel}</p>
            </div>
         </div>

         <button className="w-full py-3 bg-white hover:bg-gray-100 text-darker font-bold rounded-xl transition-colors flex items-center justify-center gap-2 group-hover:bg-primary">
            Book Now <ArrowRight className="w-4 h-4" />
         </button>
       </div>
    </motion.div>
  );
};

export default VehicleList;
