import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import VehicleList from './components/VehicleList';
import DreamRideGenerator from './components/DreamRideGenerator';
import { ViewState } from './types';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);

  const renderView = () => {
    switch (view) {
      case ViewState.HOME:
        return (
          <>
            <Hero onBrowse={() => setView(ViewState.BROWSE)} />
            <section className="py-20 bg-darker border-t border-white/5">
              <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-white mb-12">Trusted by 50,000+ Drivers</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {['Tesla', 'BMW', 'Mercedes', 'Porsche'].map((brand) => (
                    <div key={brand} className="flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity">
                      <span className="text-2xl font-bold text-white">{brand}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        );
      case ViewState.BROWSE:
        return <VehicleList />;
      case ViewState.AI_GENERATOR:
        return <DreamRideGenerator />;
      default:
        return <Hero onBrowse={() => setView(ViewState.BROWSE)} />;
    }
  };

  return (
    <div className="bg-darker min-h-screen text-white font-sans selection:bg-primary selection:text-white">
      <Navbar currentView={view} onChangeView={setView} />
      
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-darker border-t border-white/10 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                 <div className="w-8 h-8 bg-gradient-to-tr from-primary to-secondary rounded-lg mr-2"></div>
                 <span className="text-xl font-bold text-white">Velociraptor</span>
              </div>
              <p className="text-gray-400 max-w-sm">
                The world's first AI-integrated vehicle booking platform. 
                Rent, ride, and reimagine mobility.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-primary cursor-pointer">Browse Fleet</li>
                <li className="hover:text-primary cursor-pointer">AI Studio</li>
                <li className="hover:text-primary cursor-pointer">Pricing</li>
                <li className="hover:text-primary cursor-pointer">Business</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-primary cursor-pointer">Help Center</li>
                <li className="hover:text-primary cursor-pointer">Terms of Service</li>
                <li className="hover:text-primary cursor-pointer">Privacy Policy</li>
                <li className="hover:text-primary cursor-pointer">Contact Us</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/5 text-center text-gray-500 text-sm">
            © 2024 Velociraptor Motors. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
