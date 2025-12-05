import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wand2, Download, RefreshCw, AlertCircle } from 'lucide-react';
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
    "A cyberpunk motorcycle with neon wheels in rainy Tokyo",
    "A futuristic flying taxi over a green utopian city",
    "A vintage convertible car on a coastal highway at sunset",
    "A rugged off-road monster truck in a snowy tundra"
  ];

  return (
    <div className="min-h-screen bg-darker py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center justify-center p-2 mb-4 bg-secondary/10 rounded-full text-secondary ring-1 ring-secondary/30"
           >
             <Sparkles className="w-4 h-4 mr-2" />
             <span className="text-sm font-semibold">Powered by Nano Banana</span>
           </motion.div>
           <h2 className="text-4xl font-extrabold text-white mb-4">Design Your Dream Ride</h2>
           <p className="text-gray-400 max-w-2xl mx-auto">
             Can't find what you're looking for? Describe your perfect vehicle and our AI will visualize it for you.
             The future of automotive design is in your hands.
           </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Controls */}
           <div className="lg:col-span-1 space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                 <label className="block text-sm font-medium text-gray-300 mb-2">
                   Describe your vision
                 </label>
                 <textarea
                   value={prompt}
                   onChange={(e) => setPrompt(e.target.value)}
                   placeholder="e.g. A chrome-plated sports car with gullwing doors..."
                   className="w-full h-32 bg-darker border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:ring-2 focus:ring-secondary focus:border-transparent transition-all resize-none mb-4"
                 />
                 
                 <div className="space-y-2 mb-6">
                   <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Try these:</p>
                   {suggestions.map((sug, idx) => (
                     <button 
                       key={idx}
                       onClick={() => setPrompt(sug)}
                       className="block w-full text-left text-xs text-gray-400 hover:text-white hover:bg-white/5 p-2 rounded transition-colors truncate"
                     >
                       {sug}
                     </button>
                   ))}
                 </div>

                 <button
                   onClick={handleGenerate}
                   disabled={loading || !prompt.trim()}
                   className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${
                     loading || !prompt.trim() 
                       ? 'bg-gray-700 cursor-not-allowed' 
                       : 'bg-gradient-to-r from-secondary to-purple-600 hover:shadow-lg hover:shadow-secondary/25'
                   }`}
                 >
                   {loading ? (
                     <RefreshCw className="w-5 h-5 animate-spin" />
                   ) : (
                     <>
                       <Wand2 className="w-5 h-5" />
                       Generate Vehicle
                     </>
                   )}
                 </button>
                 
                 {error && (
                   <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
                     <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                     <p className="text-xs text-red-400">{error}</p>
                   </div>
                 )}
              </div>
              
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6">
                 <h3 className="text-emerald-400 font-bold mb-2">Premium Feature</h3>
                 <p className="text-gray-400 text-sm">
                   Visualize before you book. Generated concepts can be sent to our custom fabrication partners.
                 </p>
              </div>
           </div>

           {/* Preview Area */}
           <div className="lg:col-span-2">
              <div className="h-full min-h-[500px] bg-dark rounded-2xl border border-white/10 relative overflow-hidden flex items-center justify-center group">
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
                       <div className="absolute inset-0 bg-gradient-to-t from-darker/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                          <button className="bg-white text-darker px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors">
                            <Download className="w-4 h-4" />
                            Download Concept
                          </button>
                       </div>
                     </motion.div>
                   ) : (
                     <motion.div
                       key="placeholder"
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       className="text-center p-8"
                     >
                        <div className="w-24 h-24 bg-white/5 rounded-full mx-auto flex items-center justify-center mb-6">
                           <Sparkles className="w-10 h-10 text-gray-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-300 mb-2">Ready to Imagine</h3>
                        <p className="text-gray-500">Enter a prompt to see the magic of Nano Banana.</p>
                     </motion.div>
                   )}
                 </AnimatePresence>
                 
                 {loading && (
                   <div className="absolute inset-0 bg-darker/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-secondary font-medium animate-pulse">Rendering your dream...</p>
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
