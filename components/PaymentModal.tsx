import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CreditCard, Lock, Loader, ShieldCheck, Wallet } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  description: string;
  onSuccess: () => void;
  mode?: 'booking' | 'wallet_topup';
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, amount, description, onSuccess, mode = 'booking' }) => {
  const [processing, setProcessing] = useState(false);
  const [method, setMethod] = useState<'card' | 'upi'>('card');
  const { user } = useAuth();

  const handlePayment = () => {
    setProcessing(true);
    // Simulate Razorpay processing delay
    setTimeout(() => {
      setProcessing(false);
      onSuccess();
    }, 2000);
  };

  if (!isOpen) return null;

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
        className="relative w-full max-w-md bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col text-gray-800"
      >
        {/* Razorpay-style Header */}
        <div className="bg-[#2b3040] p-6 text-white flex justify-between items-start">
            <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                   <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-serif font-bold italic">R</div>
                   Prestige Motors
                </h3>
                <p className="text-gray-400 text-sm mt-1">Transaction ID: tx_{Math.random().toString(36).substr(2, 9)}</p>
                <div className="mt-4">
                    <p className="text-xs text-gray-400 uppercase">Amount to pay</p>
                    <p className="text-2xl font-bold">${amount.toLocaleString()}.00</p>
                </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
            </button>
        </div>

        {/* Body */}
        <div className="p-6 bg-gray-50">
            <p className="text-sm text-gray-600 mb-4 font-medium">Select Payment Method</p>
            
            <div className="space-y-3">
                <div 
                    onClick={() => setMethod('card')}
                    className={`p-4 border rounded-lg cursor-pointer flex items-center gap-4 transition-all ${method === 'card' ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                >
                    <div className="p-2 bg-white border border-gray-100 rounded text-blue-600">
                        <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-sm">Card</p>
                        <p className="text-xs text-gray-500">Visa, Mastercard, Amex</p>
                    </div>
                    {method === 'card' && <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white ring-1 ring-blue-500"></div>}
                </div>

                <div 
                    onClick={() => setMethod('upi')}
                    className={`p-4 border rounded-lg cursor-pointer flex items-center gap-4 transition-all ${method === 'upi' ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                >
                    <div className="p-2 bg-white border border-gray-100 rounded text-green-600">
                        <Wallet className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-sm">UPI / QR</p>
                        <p className="text-xs text-gray-500">Google Pay, PhonePe, Paytm</p>
                    </div>
                    {method === 'upi' && <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white ring-1 ring-blue-500"></div>}
                </div>
            </div>

            {/* Simulated Card Form */}
            {method === 'card' && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-4 pt-4 border-t border-gray-200 space-y-3"
                >
                    <input type="text" placeholder="Card Number" defaultValue="4242 4242 4242 4242" className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-blue-500" readOnly />
                    <div className="flex gap-3">
                        <input type="text" placeholder="MM/YY" defaultValue="12/25" className="w-1/2 border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-blue-500" readOnly />
                        <input type="text" placeholder="CVV" defaultValue="123" className="w-1/2 border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-blue-500" readOnly />
                    </div>
                </motion.div>
            )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-gray-200 flex flex-col gap-3">
            <button 
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-blue-600 text-white py-3 rounded font-bold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
                {processing ? <Loader className="w-4 h-4 animate-spin" /> : (
                    <>
                        <Lock className="w-3 h-3" />
                        Pay ${amount.toLocaleString()}
                    </>
                )}
            </button>
            <div className="flex justify-center items-center gap-1 text-[10px] text-gray-400">
                <ShieldCheck className="w-3 h-3" />
                Secured by Razorpay
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentModal;