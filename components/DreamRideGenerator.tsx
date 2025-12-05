import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wand2, Download, RefreshCw, AlertCircle, Quote } from 'lucide-react';
import { generateVehicleImage } from '../services/aiService';

const DreamRideGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const imageUrl = await generateVehicleImage(prompt);
      setGeneratedImage(imageUrl);
    } catch (err) {
      setError("Failed to generate image. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "Matte black hypercar in front of a modern minimalist villa",
    "Vintage 1960s roadster on the Amalfi Coast at golden hour",
    "Futuristic luxury limousine with holographic interior",
    "Gold-plated SUV driving through a snowy landscape"
  ];

  return (
    <div className="min-h-screen bg-dark-900 py-24 px-4 sm:px-6 lg:px-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-dark-800 via-dark-900 to-black">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center justify-center px-4 py-1.5 mb-6 border border-gold-500/30 rounded-full bg-gold-500/5"
           >
             <Sparkles className="w-3 h-3 mr-2 text-gold-500" />
             <span className="text-xs font-bold text-gold-500 uppercase tracking-widest">Bespoke Design Studio</span>
           </motion.div>
           <h2 className="text-5xl md:text-6xl font-serif text-white mb-6">Imagine the Unimaginable</h2>
           <p className="text-gray-400 max-w-2xl mx-auto font-light text-lg">
             Our Bespoke division uses advanced AI to visualize your custom requests. 
             If you can dream it, we can source it.
           </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           {/* Controls */}
           <div className="lg:col-span-4 space-y-6">
              <div className="bg-dark-800 border border-white/5 rounded-xl p-8 shadow-2xl">
                 <label className="block text-xs font-bold text-gold-500 uppercase tracking-widest mb-4">
                   Your Vision
                 </label>
                 <textarea
                   value={prompt}
                   onChange={(e) => setPrompt(e.target.value)}
                   placeholder="Describe your bespoke vehicle requirement..."
                   className="w-full h-40 bg-dark-900/50 border border-white/10 rounded-lg p-4 text-white placeholder-gray-600 focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-all resize-none mb-6 font-serif text-lg"
                 />
                 
                 <div className="space-y-3 mb-8">
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Inspirations:</p>
                   {suggestions.map((sug, idx) => (
                     <button 
                       key={idx}
                       onClick={() => setPrompt(sug)}
                       className="block w-full text-left text-xs text-gray-400 hover:text-white hover:bg-white/5 p-3 rounded-md transition-colors border border-transparent hover:border-white/5 truncate"
                     >
                       "{sug}"
                     </button>
                   ))}
                 </div>

                 <button
                   onClick={handleGenerate}
                   disabled={loading || !prompt.trim()}
                   className={`w-full py-4 rounded-sm font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all ${
                     loading || !prompt.trim() 
                       ? 'bg-zinc-800 text-gray-500 cursor-not-allowed' 
                       : 'bg-gold-gradient text-dark-900 hover:shadow-[0_0_20px_rgba(198,166,103,0.3)]'
                   }`}
                 >
                   {loading ? (
                     <RefreshCw className="w-4 h-4 animate-spin" />
                   ) : (
                     <>
                       <Wand2 className="w-4 h-4" />
                       Visualize Concept
                     </>
                   )}
                 </button>
                 
                 {error && (
                   <div className="mt-4 p-4 bg-red-900/10 border border-red-900/30 rounded-lg flex items-start gap-3">
                     <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                     <p className="text-xs text-red-400 leading-relaxed">{error}</p>
                   </div>
                 )}
              </div>
           </div>

           {/* Preview Area */}
           <div className="lg:col-span-8">
              <div className="h-full min-h-[600px] bg-dark-800 rounded-xl border border-white/5 relative overflow-hidden flex items-center justify-center group shadow-2xl">
                 
                 {/* Decorative borders */}
                 <div className="absolute top-4 left-4 w-4 h-4 border-l border-t border-gold-500/30"></div>
                 <div className="absolute top-4 right-4 w-4 h-4 border-r border-t border-gold-500/30"></div>
                 <div className="absolute bottom-4 left-4 w-4 h-4 border-l border-b border-gold-500/30"></div>
                 <div className="absolute bottom-4 right-4 w-4 h-4 border-r border-b border-gold-500/30"></div>

                 <AnimatePresence mode="wait">
                   {generatedImage ? (
                     <motion.div
                       key="image"
                       initial={{ opacity: 0, scale: 0.95 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0 }}
                       className="relative w-full h-full"
                     >
                       <img 
                         src={generatedImage} 
                         alt="Generated Vehicle" 
                         className="w-full h-full object-cover"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-10">
                          <button className="bg-white text-dark-900 px-6 py-3 font-bold uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-gold-500 transition-colors">
                            <Download className="w-4 h-4" />
                            Save to Gallery
                          </button>
                       </div>
                     </motion.div>
                   ) : (
                     <motion.div
                       key="placeholder"
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       className="text-center p-12 max-w-md"
                     >
                        <div className="w-32 h-32 rounded-full border border-white/5 bg-dark-900 flex items-center justify-center mx-auto mb-8 relative">
                           <div className="absolute inset-0 border border-gold-500/20 rounded-full animate-pulse"></div>
                           <Sparkles className="w-10 h-10 text-gold-500" />
                        </div>
                        <h3 className="text-2xl font-serif text-white mb-3">Canvas Awaiting</h3>
                        <p className="text-gray-500 font-light leading-relaxed">
                          "Luxury is in each detail." <br/>
                          <span className="text-xs mt-2 block opacity-50">- Hubert de Givenchy</span>
                        </p>
                     </motion.div>
                   )}
                 </AnimatePresence>
                 
                 {loading && (
                   <div className="absolute inset-0 bg-dark-900/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                      <div className="w-20 h-20 border-2 border-gold-500/20 border-t-gold-500 rounded-full animate-spin mb-6"></div>
                      <p className="text-gold-500 text-xs font-bold uppercase tracking-[0.3em] animate-pulse">Crafting Visualization...</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DreamRideGenerator;