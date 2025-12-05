import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import VehicleList from './components/VehicleList';
import VehicleDetails from './components/VehicleDetails';
import DreamRideGenerator from './components/DreamRideGenerator';
import Profile from './components/Profile';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import ChatWidget from './components/ChatWidget';
import { ViewState, Vehicle } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setView(ViewState.VEHICLE_DETAILS);
    window.scrollTo(0, 0);
  };

  const renderView = () => {
    switch (view) {
      case ViewState.HOME:
        return (
          <>
            <Hero onBrowse={() => setView(ViewState.BROWSE)} />
            <section className="py-32 bg-dark-900 border-t border-white/5 relative overflow-hidden">
               {/* Background elements */}
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-1 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"></div>
               
              <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
                <span className="text-gold-500 text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Partnerships</span>
                <h2 className="text-4xl font-serif text-white mb-16">Trusted by the Elite</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center justify-items-center opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                  {['Aston Martin', 'Bugatti', 'Rolls Royce', 'McLaren'].map((brand) => (
                    <div key={brand} className="text-2xl font-serif font-bold text-white border border-white/10 px-8 py-4 w-full">
                      {brand}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        );
      case ViewState.BROWSE:
        return <VehicleList onSelectVehicle={handleVehicleSelect} />;
      case ViewState.VEHICLE_DETAILS:
        return selectedVehicle ? (
          <VehicleDetails 
            vehicle={selectedVehicle} 
            onBack={() => setView(ViewState.BROWSE)} 
          />
        ) : (
          <VehicleList onSelectVehicle={handleVehicleSelect} />
        );
      case ViewState.AI_GENERATOR:
        return <DreamRideGenerator />;
      case ViewState.PROFILE:
        return <Profile onChangeView={setView} />;
      case ViewState.ADMIN:
        return <AdminDashboard />;
      default:
        return <Hero onBrowse={() => setView(ViewState.BROWSE)} />;
    }
  };

  return (
    <NotificationProvider>
      <AuthProvider>
        <ThemeProvider>
          <div className="bg-dark-900 min-h-screen text-white font-sans selection:bg-gold-500 selection:text-black transition-colors duration-300">
            <Navbar currentView={view} onChangeView={setView} />
            
            <main>
              <AnimatePresence mode="wait">
                <motion.div
                  key={view}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {renderView()}
                </motion.div>
              </AnimatePresence>
            </main>

            {view !== ViewState.VEHICLE_DETAILS && view !== ViewState.ADMIN && <Footer />}
            <ToastContainer />
            <ChatWidget />
          </div>
        </ThemeProvider>
      </AuthProvider>
    </NotificationProvider>
  );
};

export default App;