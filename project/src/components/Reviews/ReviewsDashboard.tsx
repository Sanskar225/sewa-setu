import React, { useState, useEffect } from 'react';
import { Star, User, Image as ImageIcon } from 'lucide-react';
import { apiService } from '../../services/api';

interface Review {
  id: string;
  reviewer: { name: string };
  rating: number;
  comment: string;
  createdAt: string;
  images?: string[];
}

export function ReviewsDashboard() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleImages, setVisibleImages] = useState<Record<string, boolean>>({}); // 👈 Track visibility by review ID

  useEffect(() => {
    fetchReviews();
  }, []);

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
      setReviews([
        {
          id: 'r1',
          reviewer: { name: 'Aarav Mehta' },
          rating: 5,
          comment: 'Excellent work! Very professional and punctual.',
          createdAt: new Date().toISOString(),
          images: ['https://via.placeholder.com/150', 'https://via.placeholder.com/160'],
        },
        {
          id: 'r2',
          reviewer: { name: 'Priya Sharma' },
          rating: 4,
          comment: 'Good service overall. Could improve punctuality.',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          images: [],
        },
        {
          id: 'r3',
          reviewer: { name: 'Rahul Verma' },
          rating: 3,
          comment: 'Average experience. The service was okay.',
          createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleImageView = (reviewId: string) => {
    setVisibleImages((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">My Reviews</h1>
      <p className="text-gray-600 mb-6">Here’s what others say about your services</p>

      <div className="space-y-4">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-24 rounded-lg"></div>
          ))
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition duration-200"
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{review.reviewer?.name || 'Anonymous'}</p>
                  <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Stars */}
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill={i < review.rating ? 'currentColor' : 'none'}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-gray-700 mb-2">{review.comment}</p>

              {/* Images Toggle */}
              {review.images && review.images.length > 0 ? (
                <>
                  <button
                    className="text-sm text-blue-600 underline hover:text-blue-800"
                    onClick={() => toggleImageView(review.id)}
                  >
                    {visibleImages[review.id] ? 'Hide Images' : 'See Images'}
                  </button>

                  {/* Scrollable Image View */}
                  {visibleImages[review.id] && (
                    <div className="mt-3 flex space-x-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400">
                      {review.images.map((imgUrl, idx) => (
                        <a
                          href={imgUrl}
                          key={idx}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-24 h-24 min-w-[96px] rounded-lg overflow-hidden border border-gray-200 hover:shadow"
                        >
                          <img
                            src={imgUrl}
                            alt={`review-${review.id}-img-${idx}`}
                            className="w-full h-full object-cover"
                          />
                        </a>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-xs text-gray-400 flex items-center">
                  <ImageIcon className="w-4 h-4 mr-1" /> No images uploaded.
                </p>
              )}
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
