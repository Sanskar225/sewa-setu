// Enums
export type Role = "USER" | "PROVIDER" | "ADMIN";
export type BookingStatus = "PENDING" | "ACCEPTED" | "COMPLETED" | "CANCELLED";
export type TransactionType = "CREDIT" | "DEBIT";
export type TransactionSource = "TOPUP" | "REFUND" | "BOOKING";
export type NotificationType = "BOOKING" | "WALLET" | "ADMIN";
export type FileType = "PROFILE" | "ID_PROOF" | "CERTIFICATE" | "OTHER";

// User
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  createdAt: string;
  updatedAt?: string;
}

// Provider Profile (Enhanced & Merged)
export interface ProviderProfile {
  id: string;
  userId: string;
  user: User;
  categories: string[];
  skills: string[];
  rate: number;
  availability: boolean;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  onboardingStatus?: string;
  createdAt: string;
  updatedAt?: string;
}

// Booking
export interface Booking {
  id: string;
  userId: string;
  providerId: string;
  category: string;
  dateTime: string;
  location: string;
  price: number;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  user?: User;
  provider?: ProviderProfile;
}

// Service Category
export interface ServiceCategory {
  id: string;
  name: string;
  image?: string;
  createdAt: string;
  updatedAt?: string;
}

// Wallet
export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  createdAt: string;
  updatedAt?: string;
}

// Wallet Transaction
export interface WalletTransaction {
  id: string;
  userId: string;
  walletId: string;
  amount: number;
  type: TransactionType;
  source: TransactionSource;
  createdAt: string;
}

// Review
export interface Review {
  id: string;
  userId: string;
  providerId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user?: User;
  provider?: ProviderProfile;
}

// Notification
export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
}

// File
export interface File {
  id: string;
  userId: string;
  url: string;
  type: FileType;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  setUser: (user: User | null) => void; // ✅ Add this
}

// Availability Slot
export interface AvailabilitySlot {
  id: string;
  providerId: string;
  startTime: string;
  endTime: string;
  isBooked?: boolean;
  createdAt: string;
}

// Message
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  sender?: User;
  receiver?: User;
}

// Coupon
export interface Coupon {
  id: string;
  code: string;
  discount: number;
  maxAmount: number;
  expiryDate: string;
  isActive: boolean;
}

//jobs
// types.ts
export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  budget: number;
  serviceType: "AC" | "Plumbing" | "Electric";
  createdAt: string;
  userRating?: number; // Optional if users are rated
}

export interface Bid {
  jobId: string;
  providerId: string;
  amount: number;
  message: string;
}
//earning
// Add these to your existing types.ts
export interface Transaction {
  id: string;
  jobId: string;
  amount: number;
  date: string;
  status: "Completed" | "Pending" | "Failed";
  jobTitle: string;
}

export interface EarningsSummary {
  totalEarnings: number;
  completedJobs: number;
  pendingBalance: number;
  lastWithdrawalDate?: string;
}