import React, { useState } from "react";
import axios from "axios";
import StarRating from "../../components/ReviewComponents/StarRating";

const AddReview = ({ bookId, book, onReviewAdded }) => {
  const [newReview, setNewReview] = useState({ 
    rating: 0, 
    reviewText: "" 
  });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate rating
    if (newReview.rating === 0) {
      setError("Please select a star rating before submitting your review.");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8070/reviews/${bookId}`, {
        ...newReview,
        bookTitle: book.bookTitle,
        author: book.author,
      });

      // Reset form
      setNewReview({ rating: 0, reviewText: "" });

      
      onReviewAdded(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred while submitting the review.");
    }
  };

  return (
    <div
      className="row mt-4"
      style={{
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        padding: "20px",
      }}
    >
      <div className="col-12">
        <h3>Add a Review</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <StarRating
            rating={newReview.rating}
            onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
            editable={true}
            starStyle={{ fontSize: "2rem", color: "gold" }}
          />
          <textarea
            className="form-control mt-2"
            placeholder="Write your review..."
            value={newReview.reviewText}
            onChange={(e) => setNewReview({ ...newReview, reviewText: e.target.value })}
            required
            rows={4}
          />
          <div className="d-flex justify-content-end mt-2">
            <button type="submit" className="btn btn-primary">
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReview;
