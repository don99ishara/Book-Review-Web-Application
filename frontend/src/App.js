import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HeaderMain from './components/HeaderMain';
import BooksList from './pages/Books/BookList';
import AddBook from './pages/Books/AddNewBook';
import UniqueBookDetails from './pages/Books/UniqueBookDetails';
import AllReviews from './pages/BookReviews/AllReviews';

function App() {
  return (
    <Router>
      <div className="App">
        <HeaderMain />
        <Routes>
          <Route path="/" element={<BooksList />} />
          <Route path="/addbook" element={<AddBook />} />
          <Route path="/book/:bookId" element={<UniqueBookDetails />} />
          <Route path="/allreviews" element={<AllReviews />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
