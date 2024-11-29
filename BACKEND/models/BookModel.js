const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  bookTitle: {
    type: String,
    required: true 
},
  author: { 
    type: String, 
    required: true 
},
  bookDescription: { 
    type: String, 
    required: true 
},
  publishedYear: { 
    type: Date, 
    required: true
},
genre: {
    type: [String],
    required: true,
  },
  language: {
    type: String,
    default: 'English',
  },
  numberOfPages: {
    type: Number,
  },
  coverImageUrl: { type: String },    
});

module.exports = mongoose.model('Book', BookSchema);
