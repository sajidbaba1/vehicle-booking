import React from 'react';
import { motion } from 'framer-motion';
import { Car, Zap, User, Menu, X, Sparkles } from 'lucide-react';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onChangeView }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { label: 'Home', view: ViewState.HOME, icon: Car },
    { label: 'Fleet', view: ViewState.BROWSE, icon: Zap },
    { label: 'AI Studio', view: ViewState.AI_GENERATOR, icon: Sparkles },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-darker/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onChangeView(ViewState.HOME)}>
            <motion.div 
              whileHover={{ rotate: 10 }}
              className="bg-gradient-to-tr from-primary to-secondary p-2 rounded-lg mr-2"
            >
              <Car className="text-white h-6 w-6" />
            </motion.div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Velociraptor
            </span>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => onChangeView(item.view)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === item.view
                      ? 'bg-white/10 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            <button className="flex items-center bg-primary/20 hover:bg-primary/30 text-primary px-4 py-2 rounded-full text-sm font-semibold transition-all">
              <User className="h-4 w-4 mr-2" />
              Sign In
            </button>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-darker border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  onChangeView(item.view);
                  setIsOpen(false);
                }}
                className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium ${
                  currentView === item.view
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
