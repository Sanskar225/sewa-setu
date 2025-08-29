import React, { useState, useEffect } from "react";
import { DollarSign, TrendingUp, Calendar, Download } from "lucide-react";
import { apiService } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { Booking, WalletTransaction } from "../../types";
import toast from "react-hot-toast";

interface EarningsSummary {
  totalEarnings: number;
  completedJobs: number;
  pendingBalance: number;
  lastWithdrawalDate?: string;
}

const EarningsPage: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [earnings, setEarnings] = useState<EarningsSummary>({
    totalEarnings: 0,
    completedJobs: 0,
    pendingBalance: 0,
  });
  const [withdrawalAmount, setWithdrawalAmount] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarningsData();
  }, []);

  const fetchEarningsData = async () => {
    try {
      const [jobsRes, walletRes, transactionsRes] = await Promise.all([
        apiService.getMyJobs(),
        apiService.getWallet(),
        apiService.getWalletTransactions()
      ]);

      const jobs = jobsRes.bookings || [];
      const completedJobs = jobs.filter((job: Booking) => job.status === 'COMPLETED');
      const totalEarnings = completedJobs.reduce((sum: number, job: Booking) => sum + job.price, 0);

      setEarnings({
        totalEarnings,
        completedJobs: completedJobs.length,
        pendingBalance: walletRes.wallet?.balance || 0,
      });

      setTransactions(transactionsRes.transactions || []);
    } catch (error) {
      console.error('Error fetching earnings data:', error);
      toast.error('Failed to load earnings data');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawal = async () => {
    if (withdrawalAmount <= 0 || withdrawalAmount > earnings.pendingBalance) {
      toast.error("Invalid withdrawal amount!");
      return;
    }
    
    try {
      // In a real app, you'd have a withdrawal API endpoint
      toast.success(`Withdrawal request for ₹${withdrawalAmount} submitted!`);
      setWithdrawalAmount(0);
      fetchEarningsData();
    } catch (error) {
      toast.error('Failed to process withdrawal');
    }
  };

  const filteredTransactions = statusFilter === "All" 
    ? transactions 
    : transactions.filter(t => t.type === statusFilter);

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          💰 My Earnings
        </h1>
        <p className="text-gray-600">Track your income and manage withdrawals</p>
      </div>

      {/* Earnings Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-purple-500 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-blue-100 text-sm font-medium">Total Earnings</h3>
              <p className="text-3xl font-bold">₹{earnings.totalEarnings}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Completed Jobs</h3>
              <p className="text-3xl font-bold text-gray-900">{earnings.completedJobs}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-teal-500 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-green-100 text-sm font-medium">Available Balance</h3>
              <p className="text-3xl font-bold">₹{earnings.pendingBalance}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-200" />
          </div>
        </div>
      </div>

      {/* Withdrawal Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-blue-500" />
          Withdraw Funds
        </h2>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-gray-700">Amount (₹)</label>
            <input
              type="number"
              value={withdrawalAmount}
              onChange={(e) => setWithdrawalAmount(Number(e.target.value))}
              max={earnings.pendingBalance}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`Max: ₹${earnings.pendingBalance}`}
            />
          </div>
          <button
            onClick={handleWithdrawal}
            disabled={earnings.pendingBalance === 0 || withdrawalAmount <= 0}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              earnings.pendingBalance === 0 || withdrawalAmount <= 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            Request Withdrawal
          </button>
        </div>
        {earnings.lastWithdrawalDate && (
          <p className="mt-3 text-sm text-gray-500">
            Last withdrawal: {earnings.lastWithdrawalDate}
          </p>
        )}
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-500" />
            Transaction History
          </h2>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Transactions</option>
            <option value="CREDIT">Credits</option>
            <option value="DEBIT">Debits</option>
          </select>
        </div>

        {filteredTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Type</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Source</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        txn.type === "CREDIT" 
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {txn.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`font-semibold ${
                        txn.type === "CREDIT" ? "text-green-600" : "text-red-600"
                      }`}>
                        {txn.type === "CREDIT" ? "+" : "-"}₹{txn.amount}
                      </span>
                    </td>
                    <td className="p-4 text-gray-700">{txn.source}</td>
                    <td className="p-4 text-gray-500 text-sm">
                      {new Date(txn.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions yet</h3>
            <p className="text-gray-600 text-sm">Your transaction history will appear here once you start earning</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EarningsPage;