import React from 'react';
import './Reviews.css';

const Reviews = () => {
  const reviews = [
    { id: 1, user: "Alice", rating: 5, comment: "Great service!" },
    { id: 2, user: "Bob", rating: 4, comment: "Very satisfied." },
  ];

  return (
    <div className="reviews-container">
      <h2>User Reviews</h2>
      {reviews.map((review) => (
        <div key={review.id} className="review">
          <p><strong>{review.user}</strong> - {review.rating} stars</p>
          <p>{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default Reviews;
