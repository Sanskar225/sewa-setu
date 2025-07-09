import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, ArrowUpCircle, ArrowDownCircle, Wallet, History } from 'lucide-react';
import { apiService } from '../../services/api';
import { Wallet as WalletType } from '../../types';

export function PaymentDashboard() {
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [transactions, setTransactions] = useState([]);
  const [showTopup, setShowTopup] = useState(false);
  const [topupAmount, setTopupAmount] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const [walletResponse, transactionsResponse] = await Promise.all([
        apiService.getWallet(),
        apiService.request('/wallet/transactions')
      ]);
      setWallet(walletResponse.wallet);
      setTransactions(transactionsResponse.transactions);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTopup = async () => {
    if (!topupAmount || parseFloat(topupAmount) <= 0) return;

    try {
      await apiService.topupWallet(parseFloat(topupAmount));
      setShowTopup(false);
      setTopupAmount('');
      fetchWalletData();
    } catch (error) {
      console.error('Error topping up wallet:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Payments & Wallet</h1>
        <p className="text-gray-600">Manage your payments and wallet balance</p>
      </div>

      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-r from-black to-gray-800 text-white p-6 rounded-xl mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Wallet className="w-6 h-6" />
              <span className="text-lg font-medium">Wallet Balance</span>
            </div>
            <div className="text-3xl font-bold">₹{wallet?.balance || 0}</div>
          </div>
          <button
            onClick={() => setShowTopup(true)}
            className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Top Up</span>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <CreditCard className="w-8 h-8 text-gray-400" />
            <div>
              <h3 className="font-semibold">Payment Methods</h3>
              <p className="text-sm text-gray-600">Manage cards & UPI</p>
            </div>
          </div>
          <button className="text-black font-medium hover:underline">
            Add New Method
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <History className="w-8 h-8 text-gray-400" />
            <div>
              <h3 className="font-semibold">Transaction History</h3>
              <p className="text-sm text-gray-600">View all payments</p>
            </div>
          </div>
          <button className="text-black font-medium hover:underline">
            View All
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <ArrowUpCircle className="w-8 h-8 text-gray-400" />
            <div>
              <h3 className="font-semibold">Auto Top-up</h3>
              <p className="text-sm text-gray-600">Set up automatic reload</p>
            </div>
          </div>
          <button className="text-black font-medium hover:underline">
            Configure
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        {transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.slice(0, 10).map((transaction: any) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'CREDIT' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'CREDIT' ? (
                      <ArrowUpCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowDownCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">
                      {transaction.source === 'TOPUP' ? 'Wallet Top-up' : 
                       transaction.source === 'BOOKING' ? 'Service Booking' : 
                       'Refund'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className={`font-semibold ${
                  transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'CREDIT' ? '+' : '-'}₹{transaction.amount}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No transactions yet</p>
          </div>
        )}
      </div>

      {/* Top-up Modal */}
      {showTopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Top Up Wallet</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div className="flex space-x-2">
                {[500, 1000, 2000, 5000].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setTopupAmount(amount.toString())}
                    className="flex-1 py-2 px-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setShowTopup(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTopup}
                  disabled={!topupAmount || parseFloat(topupAmount) <= 0}
                  className="flex-1 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  Top Up
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}