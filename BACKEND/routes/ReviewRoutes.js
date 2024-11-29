const router = require("express").Router();
const Review = require("../models/ReviewModel");

// POST route to add a new review
router.post("/:bookId", async (req, res) => {
  const { bookId } = req.params;
  const { bookTitle, author, rating, reviewText } = req.body;

  const newReview = new Review({
    bookId,
    bookTitle,
    author,
    rating,
    reviewText,
  });

  try {
    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET route to view all reviews
router.get("/:bookId", async (req, res) => {
  const { bookId } = req.params;

  try {
    const reviews = await Review.find({ bookId });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT route to update
router.put("/:bookId/:reviewId", async (req, res) => {
  const { bookId, reviewId } = req.params;
  const { rating, reviewText } = req.body;

  try {
    const updatedReview = await Review.findOneAndUpdate(
      { _id: reviewId, bookId },
      { rating, reviewText },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found for this book" });
    }

    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE route
router.delete("/:bookId/:reviewId", async (req, res) => {
  const { bookId, reviewId } = req.params;

  try {
    const deletedReview = await Review.findOneAndDelete({ _id: reviewId, bookId });

    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found for this book" });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
