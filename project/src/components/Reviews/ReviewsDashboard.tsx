import React, { useState, useEffect } from 'react';
import { Star, User, Image as ImageIcon, ClipboardCopy, CalendarDays } from 'lucide-react';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface Review {
  id: string;
  user: { name: string };
  rating: number;
  comment: string;
  createdAt: string;
}

export function ReviewsDashboard() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortNewest, setSortNewest] = useState(true);

  useEffect(() => {
    if (user?.role === 'PROVIDER') {
      fetchReviews();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchReviews = async () => {
    try {
      if (user?.id) {
        const res = await apiService.getProviderReviews(user.id);
        setReviews(res.reviews || []);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const sortedReviews = [...reviews].sort((a, b) =>
    sortNewest
      ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  if (user?.role !== 'PROVIDER') {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reviews</h1>
        <p className="text-gray-600">Reviews are only available for service providers</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-3xl font-bold">⭐ My Reviews</h1>
          <p className="text-gray-600">Here's what others say about your services</p>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-lg">{averageRating}</span>
              <span className="text-gray-500">({reviews.length} reviews)</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setSortNewest(!sortNewest)}
          className="px-3 py-1.5 border rounded-lg text-sm bg-white hover:bg-gray-50 transition"
        >
          {sortNewest ? 'Sort: Newest First' : 'Sort: Oldest First'}
        </button>
      </div>

      <div className="space-y-5">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-100 rounded-xl h-28 shadow-sm"
            ></div>
          ))
        ) : sortedReviews.length > 0 ? (
          sortedReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{review.user?.name}</p>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <CalendarDays className="w-4 h-4" />
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 transition ${
                        i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      fill={i < review.rating ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-start">
                <p className="text-gray-700 text-sm max-w-lg">{review.comment}</p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(review.comment);
                    toast.success('Comment copied to clipboard');
                  }}
                  title="Copy comment"
                  className="text-gray-400 hover:text-black ml-3"
                >
                  <ClipboardCopy className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Star className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium">No reviews yet</p>
            <p className="text-sm">You haven't received any feedback on your services.</p>
          </div>
        )}
      </div>
    </div>
  );
}