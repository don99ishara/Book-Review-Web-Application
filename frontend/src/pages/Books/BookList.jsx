import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// StarRating component
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

const BooksList = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const bookResponse = await axios.get("http://localhost:8070/books/allbooks");
        const booksWithRatings = await Promise.all(
          bookResponse.data.map(async (book) => {
            const reviewResponse = await axios.get(`http://localhost:8070/reviews/${book._id}`);
            const reviews = reviewResponse.data;
            const averageRating =
              reviews.length > 0
                ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
                : 0;
            return { ...book, averageRating };
          })
        );
        setBooks(booksWithRatings);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = books.filter(
    (book) =>
      book.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedRating === 0 || book.averageRating >= selectedRating)
  );

  if (error) {
    return <div className="alert alert-danger">Error: {error}</div>;
  }

  return (
    <div className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-black">All Books</h2>

          <div className="d-flex align-items-center">
            <input
              type="text"
              className="form-control me-3"
              placeholder="Search by book title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ maxWidth: "300px" }}
            />
            <select
              className="form-select"
              value={selectedRating}
              onChange={(e) => setSelectedRating(Number(e.target.value))}
              style={{ maxWidth: "150px" }}
            >
              <option value={0}>All Ratings</option>
              <option value={4.5}>4.5 & up</option>
              <option value={4}>4 & up</option>
              <option value={3.5}>3.5 & up</option>
              <option value={3}>3 & up</option>
            </select>
          </div>
        </div>

      {filteredBooks.length === 0 ? (
        <p className="text-white">No books available</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-5 g-4">
          {filteredBooks.map((book) => (
            <div key={book._id} className="col">
              <div className="card h-100">
                <div
                  className="card-img-top"
                  style={{
                    height: "300px",
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={book.coverImageUrl || "https://via.placeholder.com/150"}
                    alt={book.bookTitle}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div className="card-body">
                  <h5 className="card-title text-truncate">{book.bookTitle}</h5>
                  <p className="card-text text-truncate">By {book.author}</p>
                  <p className="card-text">Genre: {book.genre.join(", ")}</p>
                  <div className="d-flex align-items-center mb-2">
                    <StarRating rating={book.averageRating} />
                    <span className="ms-2" style={{ fontSize: "1rem" }}>{book.averageRating}</span>
                  </div>
                  <Link to={`/book/${book._id}`} className="btn btn-primary btn-sm position-absolute bottom-0 end-0 m-2">
                    View More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BooksList;
