// Provider Panel specific types
export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  budget: number;
  serviceType: string;
  createdAt: string;
  userRating?: number;
}

export interface Bid {
  jobId: string;
  providerId: string;
  amount: number;
  message: string;
}

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