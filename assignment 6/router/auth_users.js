// auth_users.js — Authenticated routes (login, add/delete reviews)
const express = require('express');
const jwt = require('jsonwebtoken');
const books = require('./booksdb.js');
const users = require('./users.js');

const regd_users = express.Router();

const JWT_SECRET = 'access_jwt_secret';

// Check if username already exists
const isValid = (username) => {
  return users.some(u => u.username === username);
};

// Validate username + password
const authenticatedUser = (username, password) => {
  return users.some(u => u.username === username && u.password === password);
};

// POST /customer/login — Login and receive JWT
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: 'Invalid username or password.' });
  }

  const accessToken = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

  req.session.authorization = { accessToken };

  return res.status(200).json({
    message: `User ${username} logged in successfully.`,
    token: accessToken
  });
});

// Middleware: verify JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    // also check session
    if (req.session && req.session.authorization) {
      const sessionToken = req.session.authorization.accessToken;
      try {
        const decoded = jwt.verify(sessionToken, JWT_SECRET);
        req.user = decoded;
        return next();
      } catch {
        return res.status(403).json({ message: 'Invalid or expired token.' });
      }
    }
    return res.status(401).json({ message: 'Access token required.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

// PUT /customer/auth/review/:isbn — Add or update a review
regd_users.put('/auth/review/:isbn', verifyToken, (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.query;
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }

  if (!review) {
    return res.status(400).json({ message: 'Review text is required as a query parameter.' });
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: `Review for ISBN ${isbn} added/updated successfully.`,
    reviews: books[isbn].reviews
  });
});

// DELETE /customer/auth/review/:isbn — Delete a review
regd_users.delete('/auth/review/:isbn', verifyToken, (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }

  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: `No review found for user ${username} on ISBN ${isbn}.` });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: `Review by ${username} for ISBN ${isbn} deleted successfully.`
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
