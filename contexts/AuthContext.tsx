import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Booking, WalletTransaction, Vehicle, Review, SystemSettings, AdminStats } from '../types';
import { useNotification } from './NotificationContext';
import { VEHICLES as CONST_VEHICLES } from '../constants';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  addBooking: (vehicle: Vehicle, startDate: string, endDate: string, total: number) => Promise<void>;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  bookings: Booking[];
  transactions: WalletTransaction[];
  isAuthenticated: boolean;
  wishlist: Set<string>;
  toggleWishlist: (vehicleId: string) => void;
  addFunds: (amount: number) => Promise<void>;
  submitReview: (vehicleId: string, rating: number, comment: string) => Promise<void>;
  
  // Admin/Vendor Features
  allUsers: User[];
  vehicles: Vehicle[];
  addVehicle: (vehicle: Partial<Vehicle>) => void;
  updateVehicle: (id: string, data: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  systemSettings: SystemSettings;
  updateSystemSettings: (settings: Partial<SystemSettings>) => void;
  toggleUserStatus: (userId: string) => void;
  adminStats: AdminStats;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock Users Database
const MOCK_USERS: Record<string, User> = {
  'alex@example.com': {
    id: 'u1',
    name: 'Alex Mercer',
    email: 'alex@example.com',
    phone: '+1 (555) 012-3456',
    tier: 'Platinum',
    role: 'client',
    walletBalance: 12500,
    joinDate: 'Oct 2023',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop',
    status: 'active',
    bio: 'Car enthusiast and frequent traveler.'
  },
  'vendor@prestige.com': {
    id: 'u2',
    name: 'Mike Ross',
    email: 'vendor@prestige.com',
    phone: '+1 (555) 987-6543',
    tier: 'Gold',
    role: 'vendor',
    walletBalance: 45000,
    joinDate: 'Jan 2024',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop',
    status: 'active',
    bio: 'Premium fleet manager for European imports.'
  },
  'admin@prestige.com': {
    id: 'u3',
    name: 'Sarah Connor',
    email: 'admin@prestige.com',
    phone: '+1 (555) 000-0000',
    tier: 'Black',
    role: 'admin',
    walletBalance: 999999,
    joinDate: 'Foundation',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
    status: 'active',
    bio: 'System Administrator.'
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // Initialize vehicles with owners for demo purposes
  // Assign ownerId 'u2' (vendor) to some vehicles and 'u3' (admin) to others
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
      return CONST_VEHICLES.map((v, i) => ({
          ...v,
          ownerId: i % 2 === 0 ? 'u2' : 'u3' 
      }));
  });

  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'bk_1',
      vehicleId: '2',
      vehicleName: 'Porsche 911 GT3',
      vehicleImage: 'https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2070&auto=format&fit=crop',
      startDate: '2024-10-24',
      endDate: '2024-10-27',
      totalPrice: 3900,
      status: 'Confirmed',
      date: '2024-10-15',
      userId: 'u1'
    },
    {
      id: 'bk_2',
      vehicleId: '5',
      vehicleName: 'Rolls-Royce Ghost',
      vehicleImage: 'https://images.unsplash.com/photo-1631295868223-6326585131f4?q=80&w=2070&auto=format&fit=crop',
      startDate: '2024-09-10',
      endDate: '2024-09-12',
      totalPrice: 3600,
      status: 'Completed',
      date: '2024-09-01',
      userId: 'u1'
    }
  ]);

  const [transactions, setTransactions] = useState<WalletTransaction[]>([
    { id: 'tx_1', amount: 5000, type: 'Credit', description: 'Wallet Top-up', date: '2024-10-01' },
    { id: 'tx_2', amount: 3900, type: 'Debit', description: 'Booking #bk_1 Payment', date: '2024-10-15' },
  ]);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  
  // Admin State
  const [allUsers, setAllUsers] = useState<User[]>(Object.values(MOCK_USERS));
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
      commissionRate: 15,
      taxRate: 8,
      maintenanceMode: false,
      aiAssistantEnabled: true
  });
  
  const { addNotification, showToast, sendEmail } = useNotification();

  // Check local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('prestige_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const foundUser = MOCK_USERS[email] || MOCK_USERS['alex@example.com'];
        setUser(foundUser);
        localStorage.setItem('prestige_user', JSON.stringify(foundUser));
        showToast(`Welcome back, ${foundUser.name}`, 'success');
        resolve();
      }, 1000);
    });
  };

  const register = async (name: string, email: string, password: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newUser: User = { 
            id: `u_${Date.now()}`,
            name, 
            email, 
            phone: '',
            walletBalance: 0, 
            tier: 'Silver',
            role: 'client',
            joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            status: 'active'
        };
        setUser(newUser);
        setAllUsers(prev => [...prev, newUser]);
        localStorage.setItem('prestige_user', JSON.stringify(newUser));
        
        addNotification({
            title: 'Welcome to Prestige',
            message: 'Your account has been successfully created. Explore our elite fleet today.',
            type: 'success',
            category: 'system'
        });
        sendEmail(email, 'Welcome to Prestige Motors', 'welcome_template');
        showToast('Account created successfully', 'success');
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    setWishlist(new Set());
    localStorage.removeItem('prestige_user');
    showToast('Signed out successfully', 'info');
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('prestige_user', JSON.stringify(updatedUser));
      setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    }
  };

  const addBooking = async (vehicle: Vehicle, startDate: string, endDate: string, total: number) => {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            const newBooking: Booking = {
                id: `bk_${Date.now()}`,
                vehicleId: vehicle.id,
                vehicleName: vehicle.name,
                vehicleImage: vehicle.image,
                startDate,
                endDate,
                totalPrice: total,
                status: 'Pending',
                date: new Date().toISOString().split('T')[0],
                userId: user?.id
            };

            setBookings(prev => [newBooking, ...prev]);

            const newTx: WalletTransaction = {
                id: `tx_${Date.now()}`,
                amount: total,
                type: 'Debit',
                description: `Booking #${newBooking.id} Payment`,
                date: new Date().toISOString().split('T')[0]
            };
            setTransactions(prev => [newTx, ...prev]);
            
            addNotification({
                title: 'Booking Confirmed',
                message: `Your booking for ${vehicle.name} has been confirmed. Payment of $${total.toLocaleString()} captured.`,
                type: 'success',
                category: 'booking'
            });
            sendEmail(user?.email || '', `Booking Confirmation: ${vehicle.name}`, 'booking_confirmed');
            showToast('Booking confirmed successfully', 'success');

            resolve();
        }, 500);
    });
  };

  const updateBookingStatus = (bookingId: string, status: Booking['status']) => {
      setBookings(prev => prev.map(b => 
          b.id === bookingId ? { ...b, status } : b
      ));
      showToast(`Booking ${status}`, 'info');
  };

  const toggleWishlist = (vehicleId: string) => {
      setWishlist(prev => {
          const newSet = new Set(prev);
          if (newSet.has(vehicleId)) {
              newSet.delete(vehicleId);
              showToast('Removed from wishlist', 'info');
          } else {
              newSet.add(vehicleId);
              showToast('Added to wishlist', 'success');
          }
          return newSet;
      });
  };

  const addFunds = async (amount: number) => {
      return new Promise<void>((resolve) => {
          setTimeout(() => {
              if (user) {
                  updateProfile({ walletBalance: user.walletBalance + amount });
                  const newTx: WalletTransaction = {
                    id: `tx_${Date.now()}`,
                    amount: amount,
                    type: 'Credit',
                    description: 'Wallet Top-up',
                    date: new Date().toISOString().split('T')[0]
                  };
                  setTransactions(prev => [newTx, ...prev]);
                  
                  addNotification({
                      title: 'Wallet Topped Up',
                      message: `$${amount.toLocaleString()} has been added to your wallet.`,
                      type: 'success',
                      category: 'payment'
                  });
                  showToast('Funds added successfully', 'success');
              }
              resolve();
          }, 500);
      });
  };

  const submitReview = async (vehicleId: string, rating: number, comment: string) => {
      return new Promise<void>((resolve) => {
          setTimeout(() => {
              if (user) {
                  const vehicleIndex = vehicles.findIndex(v => v.id === vehicleId);
                  if (vehicleIndex >= 0) {
                      const newReview: Review = {
                          id: `rv_${Date.now()}`,
                          userId: user.id,
                          userName: user.name,
                          rating,
                          comment,
                          date: new Date().toISOString().split('T')[0]
                      };
                      
                      const updatedVehicle = { ...vehicles[vehicleIndex] };
                      if (!updatedVehicle.reviews) updatedVehicle.reviews = [];
                      updatedVehicle.reviews.unshift(newReview);
                      
                      const totalRating = updatedVehicle.reviews.reduce((acc, curr) => acc + curr.rating, 0);
                      updatedVehicle.rating = Number((totalRating / updatedVehicle.reviews.length).toFixed(1));
                      updatedVehicle.reviewCount = updatedVehicle.reviews.length;

                      const newVehicles = [...vehicles];
                      newVehicles[vehicleIndex] = updatedVehicle;
                      setVehicles(newVehicles);
                  }
                  showToast('Review submitted successfully', 'success');
              }
              resolve();
          }, 1000);
      });
  };

  // --- VEHICLE MANAGEMENT ---
  const addVehicle = (vehicle: Partial<Vehicle>) => {
      const newVehicle: Vehicle = {
          id: `v_${Date.now()}`,
          name: vehicle.name || 'Untitled Vehicle',
          type: vehicle.type || 'Luxury',
          pricePerDay: vehicle.pricePerDay || 0,
          image: vehicle.image || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop',
          images: vehicle.image ? [vehicle.image] : [],
          location: vehicle.location || 'Unknown',
          description: vehicle.description || '',
          features: vehicle.features || [],
          specs: vehicle.specs || { seats: 2, transmission: 'Auto', fuel: 'Petrol' },
          rating: 0,
          reviewCount: 0,
          available: true,
          ownerId: user?.id,
          status: 'active'
      };
      setVehicles(prev => [newVehicle, ...prev]);
      showToast('Vehicle listed successfully', 'success');
  };

  const updateVehicle = (id: string, data: Partial<Vehicle>) => {
      setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...data } : v));
      showToast('Vehicle updated', 'success');
  };

  const deleteVehicle = (id: string) => {
      setVehicles(prev => prev.filter(v => v.id !== id));
      showToast('Vehicle deleted', 'info');
  };

  // --- ADMIN FUNCTIONS ---
  const updateSystemSettings = (settings: Partial<SystemSettings>) => {
      setSystemSettings(prev => ({ ...prev, ...settings }));
      showToast('System settings updated', 'success');
  };

  const toggleUserStatus = (userId: string) => {
      setAllUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u
      ));
      showToast('User status updated', 'info');
  };

  // Derived Admin Stats (Dynamic based on state)
  const adminStats: AdminStats = {
      totalRevenue: bookings.reduce((acc, b) => acc + b.totalPrice, 0) + 1250000, 
      totalBookings: bookings.length + 420,
      activeUsers: allUsers.filter(u => u.status === 'active').length,
      activeVehicles: vehicles.filter(v => v.available).length,
      revenueHistory: [
          { date: 'Jan', amount: 45000 },
          { date: 'Feb', amount: 52000 },
          { date: 'Mar', amount: 48000 },
          { date: 'Apr', amount: 61000 },
          { date: 'May', amount: 55000 },
          { date: 'Jun', amount: 67000 },
      ]
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateProfile,
      addBooking,
      updateBookingStatus,
      bookings,
      transactions,
      isAuthenticated: !!user,
      wishlist,
      toggleWishlist,
      addFunds,
      submitReview,
      allUsers,
      vehicles,
      addVehicle,
      updateVehicle,
      deleteVehicle,
      systemSettings,
      updateSystemSettings,
      toggleUserStatus,
      adminStats
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};