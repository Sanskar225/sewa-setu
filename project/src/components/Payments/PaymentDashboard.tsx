import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Plus, ArrowUpCircle, ArrowDownCircle, Wallet, 
  History, TrendingUp, DollarSign, Calendar
} from 'lucide-react';
import { apiService } from '../../services/api';
import { Wallet as WalletType, WalletTransaction } from '../../types';
import toast from 'react-hot-toast';

export function PaymentDashboard() {
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
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
        apiService.getWalletTransactions()
      ]);
      setWallet(walletResponse.wallet);
      setTransactions(transactionsResponse.transactions || []);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast.error('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  const handleTopup = async () => {
    if (!topupAmount || parseFloat(topupAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      await apiService.topupWallet(parseFloat(topupAmount));
      toast.success('Wallet topped up successfully!');
      setShowTopup(false);
      setTopupAmount('');
      fetchWalletData();
    } catch (error) {
      console.error('Error topping up wallet:', error);
      toast.error('Failed to top up wallet');
    }
  };

  const getTransactionIcon = (type: string, source: string) => {
    if (type === 'CREDIT') {
      return <ArrowUpCircle className="w-5 h-5 text-green-600" />;
    }
    return <ArrowDownCircle className="w-5 h-5 text-red-600" />;
  };

  const getTransactionTitle = (source: string) => {
    switch (source) {
      case 'TOPUP': return 'Wallet Top-up';
      case 'BOOKING': return 'Service Booking';
      case 'REFUND': return 'Refund';
      default: return 'Transaction';
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
        <div className="h-32 bg-gray-200 rounded-xl mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
          Payments & Wallet
        </h1>
        <p className="text-gray-600">Manage your payments and wallet balance</p>
      </div>

      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-8 rounded-2xl mb-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <Wallet className="w-8 h-8" />
              <span className="text-xl font-semibold">Wallet Balance</span>
            </div>
            <div className="text-4xl font-bold">₹{wallet?.balance || 0}</div>
            <div className="text-blue-100 text-sm mt-1">Available for bookings</div>
          </div>
          <button
            onClick={() => setShowTopup(true)}
            className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300 font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Top Up</span>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Payment Methods</h3>
              <p className="text-sm text-gray-600">Manage cards & UPI</p>
            </div>
          </div>
          <button className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
            Add New Method
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Spending Analytics</h3>
              <p className="text-sm text-gray-600">View spending patterns</p>
            </div>
          </div>
          <button className="text-green-600 font-medium hover:text-green-700 transition-colors">
            View Analytics
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <ArrowUpCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Auto Top-up</h3>
              <p className="text-sm text-gray-600">Set up automatic reload</p>
            </div>
          </div>
          <button className="text-purple-600 font-medium hover:text-purple-700 transition-colors">
            Configure
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <History className="w-5 h-5" />
            Recent Transactions
          </h2>
          <button 
            onClick={fetchWalletData}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Refresh
          </button>
        </div>
        
        {transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.slice(0, 10).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    transaction.type === 'CREDIT' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {getTransactionIcon(transaction.type, transaction.source)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {getTransactionTitle(transaction.source)}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className={`font-bold text-lg ${
                  transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'CREDIT' ? '+' : '-'}₹{transaction.amount}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions yet</h3>
            <p className="text-gray-600 mb-4">Your transaction history will appear here</p>
            <button 
              onClick={() => setShowTopup(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Money to Wallet
            </button>
          </div>
        )}
      </div>

      {/* Top-up Modal */}
      {showTopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Top Up Wallet</h3>
              <p className="text-gray-600">Add money to your wallet for seamless bookings</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Enter Amount (₹)
                </label>
                <input
                  type="number"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Quick amounts:</p>
                <div className="grid grid-cols-2 gap-3">
                  {[500, 1000, 2000, 5000].map(amount => (
                    <button
                      key={amount}
                      onClick={() => setTopupAmount(amount.toString())}
                      className="py-3 px-4 border border-gray-300 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 font-medium"
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowTopup(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTopup}
                  disabled={!topupAmount || parseFloat(topupAmount) <= 0}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
                >
                  Add ₹{topupAmount || '0'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}