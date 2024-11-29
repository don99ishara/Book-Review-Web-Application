import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";

function AddBookForm() {
  const [bookTitle, setBookTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [bookDescription, setBookDescription] = useState("");
  const [publishedYear, setPublishedYear] = useState("");
  const [genre, setGenre] = useState([]); 
  const [language, setLanguage] = useState("");
  const [numberOfPages, setNumberOfPages] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState(""); 

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  
  const genreOptions = [
    { value: "Fiction", label: "Fiction" },
    { value: "Non-Fiction", label: "Non-Fiction" },
    { value: "Science Fiction", label: "Science Fiction" },
    { value: "Fantasy", label: "Fantasy" },
    { value: "Mystery", label: "Mystery" },
    { value: "Romance", label: "Romance" },
    { value: "Thriller", label: "Thriller" },
    { value: "Biography", label: "Biography" },
    { value: "History", label: "History" },
    { value: "Self-Help", label: "Self-Help" },
  ];


  const validateForm = () => {
    if (!bookTitle || !author || !publishedYear || genre.length === 0 || !language || !numberOfPages) {
      return "All fields are required!";
    }

    if (isNaN(publishedYear) || publishedYear.length !== 4) {
      return "Please enter a valid 4-digit year for the publication year.";
    }

    if (isNaN(numberOfPages) || numberOfPages <= 0) {
      return "Please enter a valid number for the number of pages.";
    }

    return "";
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const formError = validateForm();
    if (formError) {
      setError(formError);
      return;
    }

    const selectedGenres = genre.map((g) => g.value);

    const newBook = {
      bookTitle,
      author,
      bookDescription,
      publishedYear,
      genre: selectedGenres,
      language,
      numberOfPages,
      coverImageUrl,
    };

    try {
      const response = await axios.post("http://localhost:8070/books/addbook", newBook);
      setSuccessMessage("Book added successfully!");
      setBookTitle("");
      setAuthor("");
      setBookDescription("");
      setPublishedYear("");
      setGenre([]);
      setLanguage("");
      setNumberOfPages("");
      setCoverImageUrl("");
    } catch (error) {
      setError("There was an error adding the book. Please try again.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add a New Book</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="bookTitle" className="form-label">Book Title</label>
          <input
            type="text"
            className="form-control"
            id="bookTitle"
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="author" className="form-label">Author</label>
          <input
            type="text"
            className="form-control"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="bookDescription" className="form-label">Book Description</label>
          <textarea
            className="form-control"
            id="bookDescription"
            value={bookDescription}
            onChange={(e) => setBookDescription(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="publishedYear" className="form-label">Published Year</label>
          <input
            type="text"
            className="form-control"
            id="publishedYear"
            value={publishedYear}
            onChange={(e) => setPublishedYear(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="genre" className="form-label">Genre</label>
          <Select
            isMulti
            options={genreOptions}
            value={genre}
            onChange={setGenre}
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="language" className="form-label">Language</label>
          <input
            type="text"
            className="form-control"
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="numberOfPages" className="form-label">Number of Pages</label>
          <input
            type="number"
            className="form-control"
            id="numberOfPages"
            value={numberOfPages}
            onChange={(e) => setNumberOfPages(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="coverImageUrl" className="form-label">Cover Image URL</label>
          <input
            type="url"
            className="form-control"
            id="coverImageUrl"
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Add Book</button>
      </form>
    </div>
  );
}

export default AddBookForm;
