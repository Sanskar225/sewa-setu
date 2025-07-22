import React, { useState } from "react";
import { Transaction, EarningsSummary } from "./types";

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: "1",
    jobId: "101",
    amount: 1200,
    date: "2023-10-20",
    status: "Completed",
    jobTitle: "AC Repair in Andheri",
  },
  {
    id: "2",
    jobId: "102",
    amount: 800,
    date: "2023-10-18",
    status: "Pending",
    jobTitle: "Kitchen Pipe Leak",
  },
];

const mockEarnings: EarningsSummary = {
  totalEarnings: 8500,
  completedJobs: 12,
  pendingBalance: 1800,
  lastWithdrawalDate: "2023-10-15",
};

const EarningsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [earnings] = useState<EarningsSummary>(mockEarnings);
  const [withdrawalAmount, setWithdrawalAmount] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Filter transactions by status
  const filteredTransactions = statusFilter === "All" 
    ? transactions 
    : transactions.filter(t => t.status === statusFilter);

  // Handle withdrawal request
  const handleWithdrawal = () => {
    if (withdrawalAmount <= 0 || withdrawalAmount > earnings.pendingBalance) {
      alert("Invalid amount!");
      return;
    }
    alert(`Withdrawal request for ₹${withdrawalAmount} submitted!`);
    setWithdrawalAmount(0);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Earnings</h1>

      {/* Earnings Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-gray-500">Total Earnings</h3>
          <p className="text-2xl font-bold">₹{earnings.totalEarnings}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-gray-500">Completed Jobs</h3>
          <p className="text-2xl font-bold">{earnings.completedJobs}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-gray-500">Pending Balance</h3>
          <p className="text-2xl font-bold">₹{earnings.pendingBalance}</p>
        </div>
      </div>

      {/* Withdrawal Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-8">
        <h2 className="text-xl font-semibold mb-4">Withdraw Funds</h2>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block mb-2">Amount (₹)</label>
            <input
              type="number"
              value={withdrawalAmount}
              onChange={(e) => setWithdrawalAmount(Number(e.target.value))}
              max={earnings.pendingBalance}
              className="w-full p-2 border rounded"
              placeholder={`Max: ₹${earnings.pendingBalance}`}
            />
          </div>
          <button
            onClick={handleWithdrawal}
            disabled={earnings.pendingBalance === 0}
            className={`px-4 py-2 rounded ${
              earnings.pendingBalance === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            Request Withdrawal
          </button>
        </div>
        {earnings.lastWithdrawalDate && (
          <p className="mt-2 text-sm text-gray-500">
            Last withdrawal: {earnings.lastWithdrawalDate}
          </p>
        )}
      </div>

      {/* Transaction History */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Transaction History</h2>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-left">Job</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((txn) => (
                <tr key={txn.id} className="border-t">
                  <td className="p-3">{txn.jobTitle}</td>
                  <td className="p-3">₹{txn.amount}</td>
                  <td className="p-3">{txn.date}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        txn.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : txn.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EarningsPage;