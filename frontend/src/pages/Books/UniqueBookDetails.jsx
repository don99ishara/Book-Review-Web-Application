import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ViewReviews from "../../components/ReviewComponents/ViewReviews";
import AddReview from "../../components/ReviewComponents/AddReview";
import UpdateReview from "../../components/ReviewComponents/UpdateReview";

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div>
      {[...Array(fullStars)].map((_, index) => (
        <span key={index} style={{ color: "gold", fontSize: "1.2rem" }}>★</span>
      ))}
      {halfStar && <span style={{ color: "gold", fontSize: "1.2rem" }}>★</span>}
      {[...Array(emptyStars)].map((_, index) => (
        <span key={index} style={{ color: "#ccc", fontSize: "1.2rem" }}>★</span>
      ))}
    </div>
  );
};

const UniqueBookDetails = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [selectedReviewForEdit, setSelectedReviewForEdit] = useState(null);
  const [filterRating, setFilterRating] = useState(0);
  const [sortOrder, setSortOrder] = useState("newest");

  
  const reviewSectionRef = useRef(null);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const [bookResponse, reviewsResponse] = await Promise.all([
          axios.get(`http://localhost:8070/books/${bookId}`),
          axios.get(`http://localhost:8070/reviews/${bookId}`),
        ]);
        setBook(bookResponse.data);
        setReviews(reviewsResponse.data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchBookData();
  }, [bookId]);

  const filteredAndSortedReviews = useMemo(() => {
    let processedReviews = [...reviews];
    if (filterRating > 0) {
      processedReviews = processedReviews.filter(review => review.rating === filterRating);
    }
    processedReviews.sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );
    return processedReviews;
  }, [reviews, filterRating, sortOrder]);

  const calculateAverageRating = () => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const handleReviewAdded = (newReview) => {
    setReviews([...reviews, newReview]);
    reviewSectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleReviewUpdated = (updatedReview) => {
    setReviews(reviews.map(review => 
      review._id === updatedReview._id ? updatedReview : review
    ));
    setSelectedReviewForEdit(null);
    reviewSectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleEdit = (review) => {
    setSelectedReviewForEdit(review);
    reviewSectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (reviewId) => {
    const confirmation = window.confirm("Are you sure you want to delete this review?");
    if (!confirmation) {
      return; 
    }
    try {
      await axios.delete(`http://localhost:8070/reviews/${bookId}/${reviewId}`);
      setReviews(reviews.filter((review) => review._id !== reviewId));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAddReviewClick = () => {
    setSelectedReviewForEdit(null);
    reviewSectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  if (error) return <div>Error: {error}</div>;
  if (!book) return <div>Loading...</div>;

  return (
    <div className="container">
      {/* Book Details */}
      <div className="row">
        <div className="col-md-4 mb-5">
          <img
            src={book.coverImageUrl || "https://via.placeholder.com/300x450"}
            alt={book.bookTitle}
            className="img-fluid rounded shadow"
            style={{ height: "450px", width: "300px", objectFit: "cover" }}
          />
        </div>
        <div className="col-md-8">
          <h1>{book.bookTitle}</h1>
          <p>{book.bookDescription}</p>
          <div className="d-flex align-items-center mb-3">
            <StarRating rating={calculateAverageRating()} />
            <span className="ms-2" style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
              {calculateAverageRating()}
            </span>
            <span className="ms-2 text-muted" style={{ fontSize: "1rem" }}>
              ({reviews.length} Reviews)
            </span>
            <button className="btn btn-link ms-3" onClick={handleAddReviewClick}>
              Add Review
            </button>
          </div>
          <p>Author: {book.author}</p>
          <p>Genre: {book.genre.join(", ")}</p>
          <p>Published Year: {new Date(book.publishedYear).getFullYear()}</p>
          <p>Language: {book.language}</p>
          {book.numberOfPages && <p>Number of Pages: {book.numberOfPages}</p>}
        </div>
      </div>

      {/* Reviews list details */}
      <div className="d-flex justify-content-between align-items-center ml-3 mb-3">
        <h3>Reviews</h3>
        <div className="d-flex align-items-center">
          <select
            className="form-select me-2"
            style={{ width: "150px" }}
            value={filterRating}
            onChange={(e) => setFilterRating(Number(e.target.value))}
          >
            <option value={0}>All Ratings</option>
            {[1, 2, 3, 4, 5].map(rating => (
              <option key={rating} value={rating}>{rating} Stars</option>
            ))}
          </select>
          <select
            className="form-select"
            style={{ width: "150px" }}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>
      <ViewReviews 
        reviews={filteredAndSortedReviews} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />

      
      <div ref={reviewSectionRef} className="mt-5">
        {selectedReviewForEdit ? (
          <UpdateReview
            bookId={bookId}
            reviewId={selectedReviewForEdit._id}
            initialReview={selectedReviewForEdit}
            onReviewUpdated={handleReviewUpdated}
          />
        ) : (
          <AddReview
            bookId={bookId}
            book={book}
            onReviewAdded={handleReviewAdded}
          />
        )}
      </div>
    </div>
  );
};

export default UniqueBookDetails;