import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, CreditCard, Clock, Settings, LogOut, Camera, Wallet, MapPin, Calendar, Crown, ChevronRight, Heart, Download, Upload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ViewState } from '../types';
import { VEHICLES } from '../constants';
import PaymentModal from './PaymentModal';
import { generateReceipt } from '../utils/receiptGenerator';

interface ProfileProps {
  onChangeView: (view: ViewState) => void;
}

const Profile: React.FC<ProfileProps> = ({ onChangeView }) => {
  const { user, logout, bookings, transactions, updateProfile, wishlist, addFunds } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'wallet' | 'wishlist' | 'settings'>('overview');
  const [isFundModalOpen, setIsFundModalOpen] = useState(false);
  
  // Settings State
  const [editName, setEditName] = useState(user?.name || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wishlistedVehicles = VEHICLES.filter(v => wishlist.has(v.id));

  const handleAddFunds = async () => {
      setIsFundModalOpen(false);
      await addFunds(500); // Fixed amount for demo or pass from modal
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              updateProfile({ avatar: reader.result as string });
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSaveProfile = () => {
      updateProfile({ name: editName, bio: editBio });
  };

  if (!user) return null;

  return (
    <div className="bg-dark-900 min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif text-white mb-8">My Account</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-dark-800 border border-white/5 rounded-xl p-6 mb-6">
               <div className="flex flex-col items-center text-center mb-6">
                  <div className="relative mb-4 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                     <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gold-500 p-1">
                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                     </div>
                     <div className="absolute bottom-0 right-0 bg-dark-900 border border-white/10 p-1.5 rounded-full text-gold-500 hover:text-white transition-colors">
                        <Camera className="w-3 h-3" />
                     </div>
                     <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                  </div>
                  <h3 className="text-xl font-serif text-white mb-1">{user.name}</h3>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-gold-500/10 rounded-full border border-gold-500/20">
                     <Crown className="w-3 h-3 text-gold-500" />
                     <span className="text-[10px] font-bold text-gold-500 uppercase tracking-widest">{user.tier} Member</span>
                  </div>
               </div>
               
               <nav className="space-y-1">
                 {[
                   { id: 'overview', label: 'Overview', icon: User },
                   { id: 'bookings', label: 'My Garage', icon: Clock },
                   { id: 'wallet', label: 'Wallet & Payments', icon: Wallet },
                   { id: 'wishlist', label: 'Wishlist', icon: Heart },
                   { id: 'settings', label: 'Settings', icon: Settings },
                 ].map((item) => (
                   <button
                     key={item.id}
                     onClick={() => setActiveTab(item.id as any)}
                     className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-all ${
                       activeTab === item.id 
                         ? 'bg-gold-500 text-dark-900 font-bold' 
                         : 'text-gray-400 hover:text-white hover:bg-white/5'
                     }`}
                   >
                     <div className="flex items-center gap-3">
                       <item.icon className="w-4 h-4" />
                       <span>{item.label}</span>
                     </div>
                     {activeTab === item.id && <ChevronRight className="w-3 h-3" />}
                   </button>
                 ))}
               </nav>
               
               <div className="mt-6 pt-6 border-t border-white/5">
                 <button 
                   onClick={() => { logout(); onChangeView(ViewState.HOME); }}
                   className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                 >
                   <LogOut className="w-4 h-4" />
                   Sign Out
                 </button>
               </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-dark-800 border border-white/5 p-6 rounded-xl">
                         <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Wallet Balance</p>
                         <h3 className="text-3xl font-display font-bold text-white">${user.walletBalance.toLocaleString()}</h3>
                      </div>
                      <div className="bg-dark-800 border border-white/5 p-6 rounded-xl">
                         <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Total Bookings</p>
                         <h3 className="text-3xl font-display font-bold text-white">{bookings.length}</h3>
                      </div>
                      <div className="bg-dark-800 border border-white/5 p-6 rounded-xl">
                         <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Member Since</p>
                         <h3 className="text-3xl font-display font-bold text-white">{user.joinDate}</h3>
                      </div>
                   </div>

                   <h3 className="text-xl font-serif text-white mt-8 mb-4">Recent Activity</h3>
                   <div className="bg-dark-800 border border-white/5 rounded-xl overflow-hidden">
                      {bookings.slice(0, 2).map((booking) => (
                        <div key={booking.id} className="p-4 border-b border-white/5 flex items-center justify-between last:border-0 hover:bg-white/5 transition-colors">
                           <div className="flex items-center gap-4">
                              <img src={booking.vehicleImage} alt="" className="w-16 h-12 rounded-md object-cover" />
                              <div>
                                 <h4 className="text-white font-medium">{booking.vehicleName}</h4>
                                 <p className="text-xs text-gray-500">{booking.date}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-white font-display font-bold">${booking.totalPrice.toLocaleString()}</p>
                              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                booking.status === 'Completed' ? 'bg-green-500/20 text-green-400' : 'bg-gold-500/20 text-gold-500'
                              }`}>
                                {booking.status}
                              </span>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {/* BOOKINGS TAB */}
              {activeTab === 'bookings' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-serif text-white mb-6">Booking History</h3>
                  {bookings.map((booking) => (
                    <div key={booking.id} className="bg-dark-800 border border-white/5 rounded-xl overflow-hidden flex flex-col md:flex-row hover:border-gold-500/30 transition-colors">
                       <div className="w-full md:w-48 h-48 md:h-auto relative">
                          <img src={booking.vehicleImage} alt={booking.vehicleName} className="w-full h-full object-cover" />
                          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white font-bold uppercase tracking-widest">
                             {booking.status}
                          </div>
                       </div>
                       <div className="p-6 flex-1 flex flex-col justify-between">
                          <div className="flex justify-between items-start mb-4">
                             <div>
                                <h4 className="text-xl font-serif text-white mb-1">{booking.vehicleName}</h4>
                                <p className="text-sm text-gray-400 flex items-center gap-1.5">
                                   <Clock className="w-3 h-3" /> 
                                   {booking.startDate} - {booking.endDate}
                                </p>
                             </div>
                             <div className="text-right">
                                <p className="text-2xl font-display font-bold text-white">${booking.totalPrice.toLocaleString()}</p>
                             </div>
                          </div>
                          
                          <div className="flex gap-3 mt-4 pt-4 border-t border-white/5">
                             <button 
                                onClick={() => generateReceipt(booking, user)}
                                className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                             >
                               <Download className="w-3 h-3" />
                               Receipt
                             </button>
                             <button className="flex-1 bg-gold-500 hover:bg-gold-400 text-dark-900 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors">
                               Book Again
                             </button>
                          </div>
                       </div>
                    </div>
                  ))}
                  {bookings.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                       <p>No bookings yet. Start your journey today.</p>
                       <button onClick={() => onChangeView(ViewState.BROWSE)} className="mt-4 text-gold-500 underline">Browse Fleet</button>
                    </div>
                  )}
                </div>
              )}

              {/* WISHLIST TAB */}
              {activeTab === 'wishlist' && (
                  <div className="space-y-6">
                      <h3 className="text-2xl font-serif text-white mb-6">Your Wishlist</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {wishlistedVehicles.map((vehicle) => (
                              <div key={vehicle.id} className="bg-dark-800 border border-white/5 rounded-xl overflow-hidden group hover:border-gold-500/30 transition-colors">
                                  <div className="h-40 overflow-hidden relative">
                                      <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                                      <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded-full text-white text-[10px] font-bold uppercase">
                                          {vehicle.type}
                                      </div>
                                  </div>
                                  <div className="p-4">
                                      <h4 className="text-white font-serif text-lg">{vehicle.name}</h4>
                                      <p className="text-gold-500 font-display font-bold">${vehicle.pricePerDay} <span className="text-gray-500 text-xs font-normal">/ day</span></p>
                                      <button className="w-full mt-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2 rounded text-xs font-bold uppercase tracking-widest">
                                          View Details
                                      </button>
                                  </div>
                              </div>
                          ))}
                      </div>
                      {wishlistedVehicles.length === 0 && (
                          <div className="text-center py-12 text-gray-500 border border-dashed border-white/10 rounded-xl">
                              <Heart className="w-10 h-10 text-gray-600 mx-auto mb-4" />
                              <p>Your wishlist is empty.</p>
                              <button onClick={() => onChangeView(ViewState.BROWSE)} className="mt-2 text-gold-500 underline text-sm">Find your dream car</button>
                          </div>
                      )}
                  </div>
              )}

              {/* WALLET TAB */}
              {activeTab === 'wallet' && (
                 <div className="space-y-8">
                    {/* Card */}
                    <div className="relative h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-800 to-black border border-white/10 p-8 flex flex-col justify-between shadow-2xl">
                       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                       <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                       
                       <div className="relative z-10 flex justify-between items-start">
                          <div>
                             <p className="text-gray-400 text-sm uppercase tracking-widest mb-1">Current Balance</p>
                             <h2 className="text-4xl font-display font-bold text-white">${user.walletBalance.toLocaleString()}</h2>
                          </div>
                          <Crown className="w-8 h-8 text-gold-500 opacity-50" />
                       </div>

                       <div className="relative z-10">
                          <div className="flex justify-between items-end">
                             <div>
                                <p className="text-gray-400 text-xs mb-1">Account Holder</p>
                                <p className="text-white font-medium tracking-wide uppercase">{user.name}</p>
                             </div>
                             <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-red-500/80"></div>
                                <div className="w-8 h-8 rounded-full bg-yellow-500/80 -ml-4"></div>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="flex gap-4">
                       <button 
                          onClick={() => setIsFundModalOpen(true)}
                          className="flex-1 bg-gold-500 text-dark-900 py-3 rounded-lg font-bold uppercase text-xs tracking-widest hover:brightness-110 transition-all"
                       >
                          Add Funds
                       </button>
                       <button className="flex-1 bg-white/5 border border-white/10 text-white py-3 rounded-lg font-bold uppercase text-xs tracking-widest hover:bg-white/10 transition-all">
                          Withdraw
                       </button>
                    </div>

                    <div>
                       <h3 className="text-xl font-serif text-white mb-4">Transaction History</h3>
                       <div className="bg-dark-800 border border-white/5 rounded-xl overflow-hidden">
                          {transactions.map(tx => (
                             <div key={tx.id} className="p-4 border-b border-white/5 flex items-center justify-between hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4">
                                   <div className={`p-2 rounded-full ${tx.type === 'Credit' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                      <CreditCard className="w-4 h-4" />
                                   </div>
                                   <div>
                                      <p className="text-white font-medium text-sm">{tx.description}</p>
                                      <p className="text-xs text-gray-500">{tx.date}</p>
                                   </div>
                                </div>
                                <span className={`font-display font-bold ${tx.type === 'Credit' ? 'text-green-500' : 'text-white'}`}>
                                   {tx.type === 'Credit' ? '+' : '-'}${tx.amount.toLocaleString()}
                                </span>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === 'settings' && (
                 <div className="space-y-6 max-w-2xl">
                    <h3 className="text-2xl font-serif text-white mb-6">Profile Settings</h3>
                    
                    <div className="space-y-4">
                       <div className="flex items-center gap-4 mb-6">
                          <div className="w-20 h-20 rounded-full bg-dark-800 border border-white/10 overflow-hidden relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                  <Upload className="w-5 h-5 text-white" />
                              </div>
                          </div>
                          <div>
                              <p className="text-white font-medium">Profile Photo</p>
                              <p className="text-xs text-gray-500">Click to upload new avatar</p>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                             <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Display Name</label>
                             <input 
                                type="text" 
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full bg-dark-800 border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 focus:outline-none" 
                             />
                          </div>
                          <div className="space-y-1">
                             <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Phone</label>
                             <input type="text" defaultValue={user.phone} className="w-full bg-dark-800 border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 focus:outline-none" />
                          </div>
                       </div>
                       
                       <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Bio</label>
                          <textarea 
                             value={editBio}
                             onChange={(e) => setEditBio(e.target.value)}
                             className="w-full h-24 bg-dark-800 border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 focus:outline-none resize-none"
                             placeholder="Tell us about yourself..."
                          />
                       </div>

                       <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
                          <input type="email" defaultValue={user.email} className="w-full bg-dark-800 border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 focus:outline-none" readOnly />
                       </div>
                    </div>

                    <div className="pt-6 border-t border-white/5">
                       <h4 className="text-white font-medium mb-4">Preferences</h4>
                       <div className="flex items-center justify-between py-3 border-b border-white/5">
                          <span className="text-gray-400 text-sm">Email Notifications</span>
                          <div className="w-10 h-5 bg-gold-500 rounded-full relative cursor-pointer">
                             <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                          </div>
                       </div>
                    </div>

                    <div className="pt-6">
                       <button 
                          onClick={handleSaveProfile}
                          className="bg-white text-dark-900 px-6 py-3 rounded-lg font-bold uppercase text-xs tracking-widest hover:bg-gold-500 transition-colors"
                        >
                          Save Changes
                       </button>
                    </div>
                 </div>
              )}
            </motion.div>
          </div>
        </div>

        <PaymentModal 
            isOpen={isFundModalOpen}
            onClose={() => setIsFundModalOpen(false)}
            amount={500}
            description="Wallet Top-up"
            onSuccess={handleAddFunds}
            mode="wallet_topup"
        />
      </div>
    </div>
  );
};

export default Profile;