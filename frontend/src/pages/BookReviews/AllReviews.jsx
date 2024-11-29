import React, { useState, useEffect } from 'react'; 
import axios from 'axios';  

const formatDate = (dateString) => {   
  const options = { year: "numeric", month: "long", day: "numeric" };   
  return new Date(dateString).toLocaleDateString(undefined, options); 
};  

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

const AllReviews = () => {   
  const [allReviews, setAllReviews] = useState([]);   
  const [loading, setLoading] = useState(true);   
  const [error, setError] = useState(null);    

  useEffect(() => {     
    const fetchAllReviews = async () => {       
      try {         
        const booksResponse = await axios.get('http://localhost:8070/books/allbooks');         
        const books = booksResponse.data;          

        const reviewPromises = books.map(book =>            
          axios.get(`http://localhost:8070/reviews/${book._id}`)         
        );          

        const reviewResponses = await Promise.all(reviewPromises);                  

        const combinedReviews = books.flatMap((book, index) =>            
          reviewResponses[index].data.map(review => ({             
            ...review,             
            bookTitle: book.bookTitle,             
            bookAuthor: book.author,
            bookCover: book.coverImageUrl || "https://via.placeholder.com/150x225"
          }))         
        );          

        setAllReviews(combinedReviews);         
        setLoading(false);       
      } catch (err) {         
        setError(err.message);         
        setLoading(false);       
      }     
    };      

    fetchAllReviews();   
  }, []);    

  if (loading) return <div>Loading reviews...</div>;   
  if (error) return <div>Error: {error}</div>;    

  return (     
    <div className="container my-4">       
      <h3 className="mb-4 text-black">All Book Reviews</h3>       
      {allReviews.length === 0 ? (         
        <p className="text-center">No reviews found.</p>       
      ) : (         
        allReviews.map((review, index) => (           
          <div key={index} className="card mb-3">             
            <div className="card-body d-flex">
              <div className="me-3">
                <img 
                  src={review.bookCover} 
                  alt={review.bookTitle} 
                  style={{
                    width: '150px', 
                    height: '225px', 
                    objectFit: 'cover'
                  }} 
                  className="img-fluid rounded"
                />
              </div>
              <div className="flex-grow-1">
                <div className="card-header px-0 border-0">
                  <h5 className="card-title">{review.bookTitle}</h5>
                  <h6 className="card-subtitle text-muted">by {review.bookAuthor}</h6>
                </div>
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      {renderStars(review.rating)}
                      <span className="ms-2">{review.rating}.0/5.0</span>
                    </div>
                    <small className="text-muted">{formatDate(review.dateAdded)}</small>
                  </div>
                  <p className="card-text">{review.reviewText}</p>
                </div>
              </div>
            </div>
          </div>
        ))       
      )}     
    </div>   
  ); 
};  

export default AllReviews;