// index.js — Main entry point for the Express Bookstore API
const express = require('express');
const session = require('express-session');
const { authenticated } = require('./router/auth_users.js');
const { general } = require('./router/general.js');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(
  session({
    secret: 'session_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  })
);

// Mount routers
app.use('/customer', authenticated);   // /customer/login, /customer/auth/review/:isbn
app.use('/', general);                  // /, /isbn/:isbn, /author/:author, /title/:title, /review/:isbn, /register

app.listen(PORT, () => {
  console.log(`📚 Paradise Bookstore API running on http://localhost:${PORT}`);
});

module.exports = app;
