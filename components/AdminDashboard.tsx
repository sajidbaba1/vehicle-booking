import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, Users, Car, Settings, TrendingUp, Search, 
    MoreVertical, Shield, AlertTriangle, CheckCircle, XCircle, 
    Mail, DollarSign, PenTool, Power, Database, Plus, Trash2, Edit, 
    Calendar, Store, Upload, Save, MessageSquare, Star, Clock, MapPin
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { User, Vehicle } from '../types';
import VehicleFormModal from './VehicleFormModal';

const AdminDashboard: React.FC = () => {
  const { user, allUsers, toggleUserStatus, systemSettings, updateSystemSettings, adminStats, vehicles, addVehicle, updateVehicle, deleteVehicle, bookings, updateBookingStatus, updateProfile } = useAuth();
  const { showToast, sendEmail } = useNotification();
  
  // Determine Role
  const isVendor = user?.role === 'vendor';
  const isAdmin = user?.role === 'admin';

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'shops' | 'vehicles' | 'bookings' | 'settings' | 'shop_profile' | 'reviews'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Email Campaign State
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // Shop Profile State
  const [shopName, setShopName] = useState(user?.name || '');
  const [shopBio, setShopBio] = useState(user?.bio || '');
  const [shopPhone, setShopPhone] = useState(user?.phone || '');

  if (!user || (!isAdmin && !isVendor)) return <div className="p-20 text-center text-white">Access Denied</div>;

  // Filter Data based on Role
  const filteredVehicles = vehicles.filter(v => {
      const isOwner = isVendor ? v.ownerId === user.id : true;
      const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase());
      return isOwner && matchesSearch;
  });

  const filteredBookings = bookings.filter(b => {
      // Find vehicle for this booking
      const vehicle = vehicles.find(v => v.id === b.vehicleId);
      const isOwner = isVendor ? vehicle?.ownerId === user.id : true;
      const matchesSearch = b.id.toLowerCase().includes(searchQuery.toLowerCase()) || b.vehicleName.toLowerCase().includes(searchQuery.toLowerCase());
      return isOwner && matchesSearch;
  });

  const filteredUsers = allUsers.filter(u => 
      (u.role === 'client' || !u.role) && 
      (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredShops = allUsers.filter(u => 
      u.role === 'vendor' && 
      (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Vendor Specific Stats
  const vendorRevenue = filteredBookings.reduce((acc, b) => acc + b.totalPrice, 0);
  const vendorReviews = vehicles
    .filter(v => v.ownerId === user.id)
    .flatMap(v => (v.reviews || []).map(r => ({ ...r, vehicleName: v.name, vehicleImage: v.image })))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
  const averageRating = vendorReviews.length > 0 
    ? (vendorReviews.reduce((acc, r) => acc + r.rating, 0) / vendorReviews.length).toFixed(1) 
    : 'N/A';

  const handleSendCampaign = async () => {
      if (!emailSubject || !emailBody) return showToast('Please fill in all fields', 'error');
      await sendEmail('all-users@prestige.com', emailSubject, emailBody);
      setEmailSubject('');
      setEmailBody('');
  };

  const handleSaveVehicle = (data: Partial<Vehicle>) => {
      if (editingVehicle) {
          updateVehicle(editingVehicle.id, data);
      } else {
          addVehicle(data);
      }
      setEditingVehicle(null);
  };

  const handleUpdateShopProfile = () => {
      updateProfile({
          name: shopName,
          bio: shopBio,
          phone: shopPhone
      });
      showToast('Shop profile updated successfully', 'success');
  };

  const handleShopLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              updateProfile({ avatar: reader.result as string });
              showToast('Shop logo updated', 'success');
          };
          reader.readAsDataURL(file);
      }
  };

  const renderNav = () => {
      const items = [];
      items.push({ id: 'overview', icon: LayoutDashboard, label: 'Overview' });
      
      if (isAdmin) {
          items.push({ id: 'users', icon: Users, label: 'Customers' });
          items.push({ id: 'shops', icon: Database, label: 'Shops & Vendors' });
      }
      
      items.push({ id: 'vehicles', icon: Car, label: isVendor ? 'My Fleet' : 'Fleet Manager' });
      items.push({ id: 'bookings', icon: Calendar, label: isVendor ? 'My Bookings' : 'All Bookings' });
      
      if (isVendor) {
          items.push({ id: 'reviews', icon: MessageSquare, label: 'Reviews' });
          items.push({ id: 'shop_profile', icon: Store, label: 'Shop Profile' });
      }

      if (isAdmin) {
          items.push({ id: 'settings', icon: Settings, label: 'Global Settings' });
      }

      return items.map(item => (
        <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                activeTab === item.id 
                    ? 'bg-gold-500 text-dark-900 font-bold' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
        >
            <item.icon className="w-4 h-4" />
            {item.label}
        </button>
      ));
  };

  return (
    <div className="bg-dark-900 min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
            
            {/* Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
                <div className="bg-dark-800 border border-white/5 rounded-xl p-4 sticky top-24">
                    <div className="flex items-center gap-3 px-4 py-4 mb-6 border-b border-white/5">
                        <div className="bg-gold-500/10 p-2 rounded-lg">
                            <Shield className="w-5 h-5 text-gold-500" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-sm">{isAdmin ? 'Admin Panel' : 'Vendor Portal'}</h3>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">{user.name}</p>
                        </div>
                    </div>
                    
                    <nav className="space-y-1">
                        {renderNav()}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* OVERVIEW TAB */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-serif text-white mb-6">Dashboard Overview</h2>
                                
                                {/* KPI Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="bg-dark-800 border border-white/5 p-6 rounded-xl relative overflow-hidden group">
                                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <DollarSign className="w-16 h-16 text-gold-500" />
                                        </div>
                                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">{isVendor ? 'My Revenue' : 'Total Revenue'}</p>
                                        <h3 className="text-3xl font-display font-bold text-white">
                                            ${(isVendor ? vendorRevenue : adminStats.totalRevenue / 1000000).toLocaleString()}{!isVendor && 'M'}
                                        </h3>
                                        <div className="flex items-center gap-1 mt-2 text-green-500 text-xs">
                                            <TrendingUp className="w-3 h-3" />
                                            <span>+12.5% vs last month</span>
                                        </div>
                                    </div>

                                    <div className="bg-dark-800 border border-white/5 p-6 rounded-xl">
                                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Total Bookings</p>
                                        <h3 className="text-3xl font-display font-bold text-white">
                                            {isVendor ? filteredBookings.length : adminStats.totalBookings}
                                        </h3>
                                    </div>

                                    {isVendor ? (
                                        <div className="bg-dark-800 border border-white/5 p-6 rounded-xl">
                                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Avg Rating</p>
                                            <h3 className="text-3xl font-display font-bold text-white flex items-center gap-2">
                                                {averageRating} <Star className="w-5 h-5 text-gold-500 fill-gold-500" />
                                            </h3>
                                        </div>
                                    ) : (
                                        <div className="bg-dark-800 border border-white/5 p-6 rounded-xl">
                                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Active Users</p>
                                            <h3 className="text-3xl font-display font-bold text-white">{adminStats.activeUsers}</h3>
                                        </div>
                                    )}

                                    <div className="bg-dark-800 border border-white/5 p-6 rounded-xl">
                                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">{isVendor ? 'My Vehicles' : 'Fleet Size'}</p>
                                        <h3 className="text-3xl font-display font-bold text-white">
                                            {isVendor ? filteredVehicles.length : adminStats.activeVehicles}
                                        </h3>
                                    </div>
                                </div>

                                {/* Revenue Chart (Simple SVG Visualization) */}
                                {isAdmin && (
                                <div className="bg-dark-800 border border-white/5 p-6 rounded-xl">
                                    <h3 className="text-white font-bold mb-6">Revenue Analytics</h3>
                                    <div className="h-64 w-full flex items-end justify-between gap-2 px-4">
                                        {adminStats.revenueHistory.map((item, index) => {
                                            const height = (item.amount / 70000) * 100;
                                            return (
                                                <div key={index} className="flex flex-col items-center gap-2 flex-1 group">
                                                    <div className="w-full bg-white/5 rounded-t-sm relative h-full flex items-end group-hover:bg-white/10 transition-colors">
                                                        <motion.div 
                                                            initial={{ height: 0 }}
                                                            animate={{ height: `${height}%` }}
                                                            transition={{ duration: 1, delay: index * 0.1 }}
                                                            className="w-full bg-gold-gradient opacity-80 group-hover:opacity-100 rounded-t-sm"
                                                        ></motion.div>
                                                    </div>
                                                    <span className="text-[10px] text-gray-500 uppercase">{item.date}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                )}
                            </div>
                        )}

                        {/* USERS TAB */}
                        {activeTab === 'users' && isAdmin && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-serif text-white">Customer Management</h2>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                                        <input 
                                            type="text" 
                                            placeholder="Search users..." 
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="bg-dark-800 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:border-gold-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="bg-dark-800 border border-white/5 rounded-xl overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-white/5 bg-white/5">
                                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">User</th>
                                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Tier</th>
                                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {filteredUsers.map(u => (
                                                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden">
                                                                <img src={u.avatar} alt="" className="w-full h-full object-cover" />
                                                            </div>
                                                            <div>
                                                                <p className="text-white text-sm font-medium">{u.name}</p>
                                                                <p className="text-xs text-gray-500">{u.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                                            u.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                                        }`}>
                                                            {u.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-sm text-gray-300">{u.tier}</td>
                                                    <td className="p-4 text-right">
                                                        <button 
                                                            onClick={() => toggleUserStatus(u.id)}
                                                            className={`text-xs font-bold uppercase tracking-wider hover:underline ${
                                                                u.status === 'active' ? 'text-red-500' : 'text-green-500'
                                                            }`}
                                                        >
                                                            {u.status === 'active' ? 'Suspend' : 'Activate'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* SHOPS TAB */}
                        {activeTab === 'shops' && isAdmin && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-serif text-white">Vendor Management</h2>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                                        <input 
                                            type="text" 
                                            placeholder="Search vendors..." 
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="bg-dark-800 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:border-gold-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="bg-dark-800 border border-white/5 rounded-xl overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-white/5 bg-white/5">
                                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Vendor</th>
                                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Revenue</th>
                                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {filteredShops.map(u => (
                                                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden">
                                                                <img src={u.avatar} alt="" className="w-full h-full object-cover" />
                                                            </div>
                                                            <div>
                                                                <p className="text-white text-sm font-medium">{u.name}</p>
                                                                <p className="text-xs text-gray-500">{u.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-sm font-display text-white">${u.walletBalance.toLocaleString()}</td>
                                                    <td className="p-4">
                                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                                            u.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                                        }`}>
                                                            {u.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <button 
                                                            onClick={() => toggleUserStatus(u.id)}
                                                            className={`text-xs font-bold uppercase tracking-wider hover:underline ${
                                                                u.status === 'active' ? 'text-red-500' : 'text-green-500'
                                                            }`}
                                                        >
                                                            {u.status === 'active' ? 'Block Shop' : 'Unblock'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* VEHICLES TAB */}
                        {activeTab === 'vehicles' && (
                             <div className="space-y-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-serif text-white">{isVendor ? 'My Fleet' : 'Fleet Management'}</h2>
                                    <button 
                                        onClick={() => { setEditingVehicle(null); setIsVehicleModalOpen(true); }}
                                        className="bg-gold-500 text-dark-900 px-4 py-2 rounded-full font-bold uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-white transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Vehicle
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredVehicles.map(v => (
                                        <div key={v.id} className="bg-dark-800 border border-white/5 rounded-xl overflow-hidden group hover:border-gold-500/30 transition-colors">
                                            <div className="h-40 relative">
                                                <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                                                <div className="absolute top-2 right-2 flex gap-2">
                                                    <span className={`px-2 py-1 rounded bg-black/60 backdrop-blur-md text-[10px] font-bold uppercase ${v.available ? 'text-green-400' : 'text-red-400'}`}>
                                                        {v.available ? 'Available' : 'Booked'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="text-white font-serif">{v.name}</h4>
                                                    <div className="flex gap-2">
                                                        <button 
                                                            onClick={() => { setEditingVehicle(v); setIsVehicleModalOpen(true); }}
                                                            className="text-gray-400 hover:text-white"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => deleteVehicle(v.id)}
                                                            className="text-gray-400 hover:text-red-500"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-gold-500 text-sm font-bold mt-1">${v.pricePerDay}/day</p>
                                                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                                    <MapPin className="w-3 h-3" />
                                                    {v.location}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {filteredVehicles.length === 0 && (
                                        <div className="col-span-full py-12 text-center text-gray-500 border border-dashed border-white/10 rounded-xl">
                                            <p>No vehicles found.</p>
                                        </div>
                                    )}
                                </div>
                             </div>
                        )}

                        {/* BOOKINGS TAB */}
                        {activeTab === 'bookings' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-serif text-white mb-6">{isVendor ? 'My Bookings' : 'All Bookings'}</h2>
                                <div className="bg-dark-800 border border-white/5 rounded-xl overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-white/5 bg-white/5">
                                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Booking ID</th>
                                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Vehicle</th>
                                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Dates</th>
                                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {filteredBookings.map(b => (
                                                <tr key={b.id} className="hover:bg-white/5 transition-colors">
                                                    <td className="p-4 text-xs text-gray-500">{b.id}</td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <img src={b.vehicleImage} alt="" className="w-10 h-8 rounded object-cover" />
                                                            <span className="text-white text-sm">{b.vehicleName}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-xs text-gray-400">
                                                        {b.startDate} to {b.endDate}
                                                    </td>
                                                    <td className="p-4 text-sm font-display text-white">${b.totalPrice.toLocaleString()}</td>
                                                    <td className="p-4">
                                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                                            b.status === 'Confirmed' ? 'bg-green-500/10 text-green-500' : 
                                                            b.status === 'Pending' ? 'bg-gold-500/10 text-gold-500' : 
                                                            b.status === 'Completed' ? 'bg-blue-500/10 text-blue-500' :
                                                            'bg-red-500/10 text-red-500'
                                                        }`}>
                                                            {b.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        {b.status === 'Pending' && (
                                                            <div className="flex justify-end gap-2">
                                                                <button onClick={() => updateBookingStatus(b.id, 'Confirmed')} className="text-green-500 hover:text-white text-xs font-bold uppercase">Approve</button>
                                                                <button onClick={() => updateBookingStatus(b.id, 'Cancelled')} className="text-red-500 hover:text-white text-xs font-bold uppercase">Reject</button>
                                                            </div>
                                                        )}
                                                        {b.status === 'Confirmed' && (
                                                            <button onClick={() => updateBookingStatus(b.id, 'Completed')} className="text-blue-500 hover:text-white text-xs font-bold uppercase">Complete</button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {filteredBookings.length === 0 && (
                                        <div className="p-8 text-center text-gray-500 text-sm">No bookings found.</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* REVIEWS TAB (Vendor Only) */}
                        {activeTab === 'reviews' && isVendor && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-serif text-white mb-6">Guest Reviews</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {vendorReviews.length > 0 ? (
                                        vendorReviews.map((review, idx) => (
                                            <div key={idx} className="bg-dark-800 border border-white/5 rounded-xl p-6 hover:border-gold-500/30 transition-colors">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <img src={review.vehicleImage} alt="" className="w-12 h-12 rounded object-cover border border-white/10" />
                                                        <div>
                                                            <p className="text-white font-medium text-sm">{review.vehicleName}</p>
                                                            <div className="flex items-center gap-1 mt-1">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-gold-500 fill-gold-500' : 'text-gray-600'}`} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] text-gray-500">{review.date}</span>
                                                </div>
                                                <div className="mb-3">
                                                    <p className="text-sm text-white font-medium">"{review.comment}"</p>
                                                </div>
                                                <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                                                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-gold-500 font-bold">
                                                        {review.userName.charAt(0)}
                                                    </div>
                                                    <span className="text-xs text-gray-400">by {review.userName}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full py-12 text-center text-gray-500 border border-dashed border-white/10 rounded-xl">
                                            <p>No reviews yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* SHOP PROFILE TAB (Vendor Only) */}
                        {activeTab === 'shop_profile' && isVendor && (
                            <div className="space-y-8 max-w-2xl">
                                <h2 className="text-2xl font-serif text-white mb-6">Shop Profile</h2>
                                
                                {/* Shop Header / Logo */}
                                <div className="bg-dark-800 border border-white/5 rounded-xl p-6 flex items-center gap-6">
                                    <div className="relative group cursor-pointer w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 hover:border-gold-500 transition-colors">
                                        <img src={user.avatar} alt="Shop Logo" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <Upload className="w-6 h-6 text-white" />
                                        </div>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleShopLogoUpload} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{user.name}</h3>
                                        <p className="text-gray-400 text-sm">{user.email}</p>
                                        <span className="inline-block mt-2 px-2 py-1 bg-gold-500/10 text-gold-500 text-[10px] font-bold uppercase tracking-widest rounded">
                                            Verified Vendor
                                        </span>
                                    </div>
                                </div>

                                {/* Shop Details Form */}
                                <div className="bg-dark-800 border border-white/5 rounded-xl p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Shop Name</label>
                                            <input 
                                                type="text" 
                                                value={shopName}
                                                onChange={(e) => setShopName(e.target.value)}
                                                className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 focus:outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contact Phone</label>
                                            <input 
                                                type="text" 
                                                value={shopPhone}
                                                onChange={(e) => setShopPhone(e.target.value)}
                                                className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">About the Shop</label>
                                        <textarea 
                                            value={shopBio}
                                            onChange={(e) => setShopBio(e.target.value)}
                                            className="w-full h-32 bg-dark-900 border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 focus:outline-none resize-none"
                                            placeholder="Tell customers about your dealership..."
                                        />
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <button 
                                            onClick={handleUpdateShopProfile}
                                            className="bg-gold-500 text-dark-900 px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2"
                                        >
                                            <Save className="w-4 h-4" />
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SETTINGS TAB (Admin Only) */}
                        {activeTab === 'settings' && isAdmin && (
                            <div className="space-y-8 max-w-2xl">
                                <div>
                                    <h2 className="text-2xl font-serif text-white mb-6">Global Configuration</h2>
                                    <div className="bg-dark-800 border border-white/5 rounded-xl p-6 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-white font-medium">Maintenance Mode</p>
                                                <p className="text-xs text-gray-500">Disable customer access temporarily</p>
                                            </div>
                                            <button 
                                                onClick={() => updateSystemSettings({ maintenanceMode: !systemSettings.maintenanceMode })}
                                                className={`w-12 h-6 rounded-full relative transition-colors ${systemSettings.maintenanceMode ? 'bg-gold-500' : 'bg-white/10'}`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${systemSettings.maintenanceMode ? 'left-7' : 'left-1'}`}></div>
                                            </button>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-white font-medium">AI Concierge</p>
                                                <p className="text-xs text-gray-500">Enable Gemini-powered chat assistant</p>
                                            </div>
                                            <button 
                                                onClick={() => updateSystemSettings({ aiAssistantEnabled: !systemSettings.aiAssistantEnabled })}
                                                className={`w-12 h-6 rounded-full relative transition-colors ${systemSettings.aiAssistantEnabled ? 'bg-gold-500' : 'bg-white/10'}`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${systemSettings.aiAssistantEnabled ? 'left-7' : 'left-1'}`}></div>
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Commission Rate (%)</label>
                                                <input 
                                                    type="number" 
                                                    value={systemSettings.commissionRate}
                                                    onChange={(e) => updateSystemSettings({ commissionRate: Number(e.target.value) })}
                                                    className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-white mt-1 focus:border-gold-500 focus:outline-none" 
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tax Rate (%)</label>
                                                <input 
                                                    type="number" 
                                                    value={systemSettings.taxRate}
                                                    onChange={(e) => updateSystemSettings({ taxRate: Number(e.target.value) })}
                                                    className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-white mt-1 focus:border-gold-500 focus:outline-none" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-serif text-white mb-6">Newsletter Campaign</h2>
                                    <div className="bg-dark-800 border border-white/5 rounded-xl p-6 space-y-4">
                                        <input 
                                            type="text" 
                                            placeholder="Subject Line"
                                            value={emailSubject}
                                            onChange={(e) => setEmailSubject(e.target.value)}
                                            className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 focus:outline-none"
                                        />
                                        <textarea 
                                            placeholder="Compose email to all users..."
                                            value={emailBody}
                                            onChange={(e) => setEmailBody(e.target.value)}
                                            className="w-full h-32 bg-dark-900 border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 focus:outline-none resize-none"
                                        />
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs text-gray-500">Will be sent to {allUsers.length} users.</p>
                                            <button 
                                                onClick={handleSendCampaign}
                                                className="bg-gold-500 text-dark-900 px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2"
                                            >
                                                <Mail className="w-4 h-4" />
                                                Send Blast
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
      </div>
      
      <VehicleFormModal 
        isOpen={isVehicleModalOpen} 
        onClose={() => setIsVehicleModalOpen(false)} 
        onSubmit={handleSaveVehicle}
        initialData={editingVehicle}
      />
    </div>
  );
};

export default AdminDashboard;