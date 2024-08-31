const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    existing_users = users.filter((user) => {
        return user.username === username;
    });

    if (existing_users.length > 0) {
        return true;
    } else {
        return false;
    };
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    user = users.filter((user) => {
        return user.username === username && user.password === password;
    });

    if (user) {
        return true;
    } else {
        return false;
    }
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (isValid(username) && authenticatedUser(username, password)) {
    jwt.sign({username: username, password: password}, 'fingerprint_customer', {expiresIn: '1h'}, (err, token) => {
        if (err) {
            console.log(err);
        }
        req.session.username = username;
        res.send(`Successfully logged in. Access Token: ${token}`);
    });
  } else {
    res.send("Invalid credentials. Login failed");
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.session.username;
  const review = req.body.review;
  const isbn = req.params.isbn;

  book = books[isbn];

  if (!book) {
    res.send("No book with the specified ISBN");
  };

  book['reviews'][username] = review;

  res.send("Review added successfully");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.username;

    book = books[isbn];

    if (!book) {
        res.send("No book with the specified ISBN");
    }

    reviews = book['reviews'];

    delete reviews[username];

    res.send("Successfully deleted review");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
