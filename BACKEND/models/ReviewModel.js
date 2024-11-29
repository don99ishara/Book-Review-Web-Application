const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  bookTitle: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  reviewText: {
    type: String,
    required: true,
  },
  bookId: {  
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Review', reviewSchema);
