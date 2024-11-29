const router = require("express").Router();
const Book = require("../models/BookModel");

// route to add a new book
router.post("/addbook", async (req, res) => {
  const { bookTitle, author, bookDescription, publishedYear, genre, language, numberOfPages,coverImageUrl } = req.body;

  const newBook = new Book({
    bookTitle,
    author,
    bookDescription,
    publishedYear,
    genre,
    language,
    numberOfPages,
    coverImageUrl
  });

  try {
    const savedBook = await newBook.save();
    res.status(201).json(savedBook); 
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// route to delete a book
router.delete("/:bookId", async (req, res) => {
  const { bookId } = req.params;

  try {
    const deletedBook = await Book.findByIdAndDelete(bookId);

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ message: "Book deleted successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



//route to view all books
router.get("/allbooks", async (req, res) => {
    try {
      const books = await Book.find(); 
      res.status(200).json(books);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  


//route to view a specific book
router.get("/:bookId", async (req, res) => {
    const { bookId } = req.params;
  
    try {
      const book = await Book.findById(bookId);
  
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
  
      res.status(200).json(book);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  


module.exports = router;
