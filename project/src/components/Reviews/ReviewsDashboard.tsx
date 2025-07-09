import React, { useState, useEffect } from 'react';
import { Star, User } from 'lucide-react';
import { apiService } from '../../services/api';

interface Review {
  id: string;
  reviewer: { name: string };
  rating: number;
  comment: string;
  createdAt: string;
}

export function ReviewsDashboard() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

//   const fetchReviews = async () => {
//     try {
//       const res = await apiService.request('/reviews/me'); // Adjust endpoint if needed
//       setReviews(res.reviews || []);
//     } catch (err) {
//       console.error('Failed to load reviews:', err);
//     } finally {
//       setLoading(false);
//     }
//   };
const fetchReviews = async () => {
  try {
    const res = await apiService.request('/reviews/me');
    if (res?.reviews?.length) {
      setReviews(res.reviews);
    } else {
      throw new Error('Empty reviews');
    }
  } catch (err) {
    console.warn('Using dummy reviews due to error or empty response:', err);

    // ✅ Dummy reviews fallback
    setReviews([
      {
        id: 'r1',
        reviewer: { name: 'Aarav Mehta' },
        rating: 5,
        comment: 'Excellent work! Very professional and punctual.',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'r2',
        reviewer: { name: 'Priya Sharma' },
        rating: 4,
        comment: 'Good service overall. Could improve punctuality.',
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      },
      {
        id: 'r3',
        reviewer: { name: 'Rahul Verma' },
        rating: 3,
        comment: 'Average experience. The service was okay.',
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
      },
    ]);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Reviews</h1>
        <p className="text-gray-600">Here’s what others say about your services</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-24 rounded-lg"></div>
          ))
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">{review.reviewer?.name || 'Anonymous'}</p>
                  <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill={i < review.rating ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            <Star className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            No reviews found
          </div>
        )}
      </div>
    </div>
  );
}
