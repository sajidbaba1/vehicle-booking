export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Vehicle {
  id: string;
  name: string;
  type: 'Car' | 'Bike' | 'SUV' | 'Luxury' | 'Van' | 'Supercar' | 'Classic';
  pricePerDay: number;
  image: string;
  images: string[]; // Gallery
  location: string;
  description: string;
  features: string[];
  specs: {
    seats: number;
    transmission: 'Auto' | 'Manual';
    fuel: 'Electric' | 'Hybrid' | 'Petrol' | 'Diesel';
    range?: string; // For electric
    engine?: string;
    acceleration?: string; // 0-60
    power?: string;
  };
  rating: number;
  reviewCount: number;
  available: boolean;
  reviews?: Review[];
  status?: 'active' | 'pending' | 'blocked';
  isFeatured?: boolean;
  ownerId?: string; // Vendor ID
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  bio?: string;
  tier: 'Silver' | 'Gold' | 'Platinum' | 'Black';
  role?: 'client' | 'vendor' | 'admin';
  walletBalance: number;
  joinDate: string;
  status?: 'active' | 'suspended' | 'pending'; // For vendors/users
}

export interface Booking {
  id: string;
  vehicleId: string;
  vehicleName: string;
  vehicleImage: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  date: string; // Booking creation date
  userId?: string; // Who booked it
}

export interface WalletTransaction {
  id: string;
  amount: number;
  type: 'Credit' | 'Debit';
  description: string;
  date: string;
}

export enum ViewState {
  HOME = 'HOME',
  BROWSE = 'BROWSE',
  AI_GENERATOR = 'AI_GENERATOR',
  VEHICLE_DETAILS = 'VEHICLE_DETAILS',
  PROFILE = 'PROFILE',
  ADMIN = 'ADMIN'
}

export interface AppNotification {
  id: string;
  userId?: string;
  type: 'success' | 'info' | 'warning' | 'error';
  category: 'booking' | 'payment' | 'system' | 'message';
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}

export interface SystemSettings {
  commissionRate: number;
  taxRate: number;
  maintenanceMode: boolean;
  aiAssistantEnabled: boolean;
}

export interface AdminStats {
  totalRevenue: number;
  totalBookings: number;
  activeUsers: number;
  activeVehicles: number;
  revenueHistory: { date: string; amount: number }[];
}