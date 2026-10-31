// general.js — Public routes + async/await with Axios for Tasks 11
const express = require('express');
const axios = require('axios');
const books = require('./booksdb.js');
const users = require('./users.js');

const public_users = express.Router();

const BASE_URL = 'http://localhost:5000';

// ── Task 7: Register a new user ──────────────────────────────────────────────
public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const exists = users.some(u => u.username === username);
  if (exists) {
    return res.status(409).json({ message: `User '${username}' already exists.` });
  }

  users.push({ username, password });
  return res.status(201).json({ message: `User '${username}' registered successfully.` });
});

// ── Task 2: Get all books (using async/await) ────────────────────────────────
public_users.get('/', async (req, res) => {
  try {
    // Async/await version using a local promise
    const getAllBooks = () => new Promise((resolve) => resolve(books));
    const allBooks = await getAllBooks();
    return res.status(200).json(allBooks);
  } catch (err) {
    return res.status(500).json({ message: 'Error retrieving books.', error: err.message });
  }
});

// ── Task 3: Get book by ISBN (using async/await) ─────────────────────────────
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const getBookByISBN = (id) => new Promise((resolve, reject) => {
      const book = books[id];
      if (book) resolve(book);
      else reject(new Error(`Book with ISBN ${id} not found.`));
    });
    const book = await getBookByISBN(isbn);
    return res.status(200).json(book);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
});

// ── Task 4: Get books by author (using async/await) ──────────────────────────
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author.toLowerCase();
    const getBooksByAuthor = (authorName) => new Promise((resolve) => {
      const result = Object.entries(books)
        .filter(([, book]) => book.author.toLowerCase().includes(authorName))
        .map(([isbn, book]) => ({ isbn, ...book }));
      resolve(result);
    });
    const result = await getBooksByAuthor(author);
    if (result.length === 0) {
      return res.status(404).json({ message: `No books found for author '${req.params.author}'.` });
    }
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ── Task 5: Get books by title (using async/await) ───────────────────────────
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title.toLowerCase();
    const getBooksByTitle = (titleName) => new Promise((resolve) => {
      const result = Object.entries(books)
        .filter(([, book]) => book.title.toLowerCase().includes(titleName))
        .map(([isbn, book]) => ({ isbn, ...book }));
      resolve(result);
    });
    const result = await getBooksByTitle(title);
    if (result.length === 0) {
      return res.status(404).json({ message: `No books found with title '${req.params.title}'.` });
    }
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ── Task 6: Get book review by ISBN ─────────────────────────────────────────
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }
  return res.status(200).json({ isbn, reviews: book.reviews });
});

// ── Axios-based methods (Task 11 - used as helper utilities) ─────────────────

// Get all books using Axios + async/await
const getAllBooksAxios = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    return response.data;
  } catch (err) {
    throw new Error('Failed to fetch all books: ' + err.message);
  }
};

// Get book by ISBN using Axios + promise callback
const getBookByISBNAxios = (isbn) => {
  return axios.get(`${BASE_URL}/isbn/${isbn}`)
    .then(response => response.data)
    .catch(err => { throw new Error(`Failed to fetch book by ISBN: ${err.message}`); });
};

// Get books by author using Axios + async/await
const getBooksByAuthorAxios = async (author) => {
  try {
    const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
    return response.data;
  } catch (err) {
    throw new Error('Failed to fetch books by author: ' + err.message);
  }
};

// Get books by title using Axios + async/await
const getBooksByTitleAxios = async (title) => {
  try {
    const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`);
    return response.data;
  } catch (err) {
    throw new Error('Failed to fetch books by title: ' + err.message);
  }
};

module.exports.general = public_users;
module.exports.getAllBooksAxios = getAllBooksAxios;
module.exports.getBookByISBNAxios = getBookByISBNAxios;
module.exports.getBooksByAuthorAxios = getBooksByAuthorAxios;
module.exports.getBooksByTitleAxios = getBooksByTitleAxios;
