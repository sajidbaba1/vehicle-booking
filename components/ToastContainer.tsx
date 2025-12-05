import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useNotification();

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-gold-500" />,
  };

  return (
    <div className="fixed bottom-4 right-4 z-[70] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            layout
            className="pointer-events-auto bg-dark-800/90 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl flex items-start gap-3 min-w-[300px] max-w-sm"
          >
            <div className="mt-0.5">{icons[toast.type]}</div>
            <div className="flex-1">
              {toast.title && <h4 className="text-white font-bold text-sm mb-0.5">{toast.title}</h4>}
              <p className="text-gray-300 text-xs leading-relaxed">{toast.message}</p>
            </div>
            <button 
              onClick={() => removeToast(toast.id)}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            {/* Progress bar visual (optional) */}
            <motion.div 
               initial={{ width: "100%" }}
               animate={{ width: "0%" }}
               transition={{ duration: 5, ease: "linear" }}
               className={`absolute bottom-0 left-0 h-[2px] rounded-full ${
                  toast.type === 'success' ? 'bg-green-500' :
                  toast.type === 'error' ? 'bg-red-500' :
                  toast.type === 'warning' ? 'bg-gold-500' : 'bg-blue-500'
               }`}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;