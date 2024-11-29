import React from "react";

// date formating function
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const ViewReviews = ({ reviews, onEdit, onDelete }) => {
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="text-warning">★</span>
        ))}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-muted">☆</span>
        ))}
      </>
    );
  };

  return (
    <div className="row mt-4">
      <div className="col-12">
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to add one!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="card mb-4">
              <div className="card-body position-relative">
                <small 
                  className="text-muted position-absolute top-0 end-0 m-2"
                  style={{ fontSize: "0.9rem" }}
                >
                  {formatDate(review.dateAdded)}
                </small>
                <h3>
                  {review.rating}.0/5.0 {renderStars(review.rating)}
                </h3>
                <p>{review.reviewText}</p>
                <div className="position-absolute bottom-0 end-0 d-flex gap-2 p-2">
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => onEdit(review)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onDelete(review._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewReviews;
