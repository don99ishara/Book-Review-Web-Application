import React from "react";

const StarRating = ({ rating, onRatingChange }) => {
  const stars = [];
  
  const handleStarClick = (index) => {
    
    onRatingChange(index + 1);
  };

  for (let i = 0; i < 5; i++) {
    stars.push(
      <span
        key={i}
        style={{ cursor: "pointer", color: i < rating ? "#ffc107" : "#e4e5e9" }}
        onClick={() => handleStarClick(i)}
      >
        ★
      </span>
    );
  }

  return <div>{stars}</div>;
};

export default StarRating;
