import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Save, Car, DollarSign, MapPin, Gauge, Zap, Users, Fuel } from 'lucide-react';
import { Vehicle } from '../types';

interface VehicleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (vehicle: Partial<Vehicle>) => void;
  initialData?: Vehicle | null;
}

const VehicleFormModal: React.FC<VehicleFormModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<Partial<Vehicle>>({
    name: '',
    type: 'Luxury',
    pricePerDay: 0,
    location: '',
    image: '',
    description: '',
    specs: {
      seats: 2,
      transmission: 'Auto',
      fuel: 'Petrol',
      engine: '',
      acceleration: '',
      power: ''
    },
    features: []
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Reset for new entry
      setFormData({
        name: '',
        type: 'Luxury',
        pricePerDay: 0,
        location: '',
        image: '',
        description: '',
        specs: {
          seats: 2,
          transmission: 'Auto',
          fuel: 'Petrol',
          engine: '',
          acceleration: '',
          power: ''
        },
        features: []
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const updateSpec = (key: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      specs: { ...prev.specs!, [key]: value }
    }));
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-3xl bg-dark-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-dark-900">
            <h3 className="text-xl font-serif text-white">{initialData ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-white">
                <X className="w-5 h-5" />
            </button>
        </div>

        <div className="overflow-y-auto p-8">
            <form id="vehicle-form" onSubmit={handleSubmit} className="space-y-8">
                
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Vehicle Name</label>
                        <div className="flex items-center bg-dark-900 border border-white/10 rounded-lg px-4 py-3">
                            <Car className="w-4 h-4 text-gray-500 mr-3" />
                            <input 
                                required
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                className="bg-transparent border-none w-full focus:outline-none text-white text-sm"
                                placeholder="e.g. Porsche 911 GT3"
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Type</label>
                        <select 
                            value={formData.type}
                            onChange={e => setFormData({...formData, type: e.target.value as any})}
                            className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-500 appearance-none"
                        >
                            {['Luxury', 'Supercar', 'SUV', 'Classic', 'Bike', 'Van'].map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Daily Rate ($)</label>
                        <div className="flex items-center bg-dark-900 border border-white/10 rounded-lg px-4 py-3">
                            <DollarSign className="w-4 h-4 text-gray-500 mr-3" />
                            <input 
                                type="number"
                                required
                                value={formData.pricePerDay}
                                onChange={e => setFormData({...formData, pricePerDay: Number(e.target.value)})}
                                className="bg-transparent border-none w-full focus:outline-none text-white text-sm"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Location</label>
                        <div className="flex items-center bg-dark-900 border border-white/10 rounded-lg px-4 py-3">
                            <MapPin className="w-4 h-4 text-gray-500 mr-3" />
                            <input 
                                required
                                value={formData.location}
                                onChange={e => setFormData({...formData, location: e.target.value})}
                                className="bg-transparent border-none w-full focus:outline-none text-white text-sm"
                                placeholder="City, State"
                            />
                        </div>
                    </div>
                </div>

                {/* Image */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Image URL</label>
                    <div className="flex items-center bg-dark-900 border border-white/10 rounded-lg px-4 py-3">
                        <Upload className="w-4 h-4 text-gray-500 mr-3" />
                        <input 
                            value={formData.image}
                            onChange={e => setFormData({...formData, image: e.target.value})}
                            className="bg-transparent border-none w-full focus:outline-none text-white text-sm"
                            placeholder="https://..."
                        />
                    </div>
                    {formData.image && (
                        <div className="mt-2 h-32 w-full rounded-lg overflow-hidden border border-white/10">
                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    )}
                </div>

                {/* Specs */}
                <div>
                    <h4 className="text-white font-serif mb-4 border-b border-white/5 pb-2">Specifications</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Engine</label>
                            <div className="flex items-center bg-dark-900 rounded p-2 border border-white/5">
                                <Gauge className="w-3 h-3 text-gold-500 mr-2" />
                                <input 
                                    value={formData.specs?.engine}
                                    onChange={e => updateSpec('engine', e.target.value)}
                                    className="bg-transparent w-full text-xs text-white focus:outline-none"
                                    placeholder="e.g. V8 Twin Turbo"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">0-60 MPH</label>
                            <div className="flex items-center bg-dark-900 rounded p-2 border border-white/5">
                                <Zap className="w-3 h-3 text-gold-500 mr-2" />
                                <input 
                                    value={formData.specs?.acceleration}
                                    onChange={e => updateSpec('acceleration', e.target.value)}
                                    className="bg-transparent w-full text-xs text-white focus:outline-none"
                                    placeholder="e.g. 2.9s"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Power</label>
                            <div className="flex items-center bg-dark-900 rounded p-2 border border-white/5">
                                <Zap className="w-3 h-3 text-gold-500 mr-2" />
                                <input 
                                    value={formData.specs?.power}
                                    onChange={e => updateSpec('power', e.target.value)}
                                    className="bg-transparent w-full text-xs text-white focus:outline-none"
                                    placeholder="e.g. 700 hp"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Seats</label>
                            <div className="flex items-center bg-dark-900 rounded p-2 border border-white/5">
                                <Users className="w-3 h-3 text-gold-500 mr-2" />
                                <input 
                                    type="number"
                                    value={formData.specs?.seats}
                                    onChange={e => updateSpec('seats', Number(e.target.value))}
                                    className="bg-transparent w-full text-xs text-white focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Transmission</label>
                            <select 
                                value={formData.specs?.transmission}
                                onChange={e => updateSpec('transmission', e.target.value)}
                                className="w-full bg-dark-900 text-xs text-white p-2 rounded border border-white/5 focus:outline-none"
                            >
                                <option>Auto</option>
                                <option>Manual</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Fuel</label>
                            <select 
                                value={formData.specs?.fuel}
                                onChange={e => updateSpec('fuel', e.target.value)}
                                className="w-full bg-dark-900 text-xs text-white p-2 rounded border border-white/5 focus:outline-none"
                            >
                                <option>Petrol</option>
                                <option>Electric</option>
                                <option>Hybrid</option>
                                <option>Diesel</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description</label>
                    <textarea 
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="w-full h-32 bg-dark-900 border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 focus:outline-none resize-none"
                        placeholder="Vehicle description..."
                    />
                </div>

            </form>
        </div>

        <div className="p-6 border-t border-white/10 bg-dark-900 flex justify-end gap-3">
            <button 
                onClick={onClose}
                className="px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
                Cancel
            </button>
            <button 
                onClick={handleSubmit}
                className="bg-gold-500 text-dark-900 px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2"
            >
                <Save className="w-4 h-4" />
                Save Vehicle
            </button>
        </div>
      </motion.div>
    </div>
  );
};

export default VehicleFormModal;