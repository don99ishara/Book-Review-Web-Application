import React, { useState, useEffect } from "react";
import axios from "axios";
import StarRating from "../../components/ReviewComponents/StarRating";

const UpdateReview = ({ bookId, reviewId, initialReview, onReviewUpdated }) => {
  const [review, setReview] = useState({ 
    rating: initialReview.rating, 
    reviewText: initialReview.reviewText 
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    setReview({
      rating: initialReview.rating,
      reviewText: initialReview.reviewText
    });
  }, [initialReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8070/reviews/${bookId}/${reviewId}`, review);
      
      
      onReviewUpdated(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div
      className="row mt-4"
      style={{
        backgroundColor: "#e7f3fe",
        borderRadius: "8px",
        padding: "20px",
      }}
    >
      <div className="col-12">
        <h3>Edit Review</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <StarRating
            rating={review.rating}
            onRatingChange={(rating) => setReview({ ...review, rating })}
            editable={true}
          />
          <textarea
            className="form-control mt-2"
            placeholder="Write your review..."
            value={review.reviewText}
            onChange={(e) => setReview({ ...review, reviewText: e.target.value })}
            required
            rows={4}
          />
          <div className="d-flex justify-content-end mt-2">
            <button type="submit" className="btn btn-primary">
              Update Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateReview;
