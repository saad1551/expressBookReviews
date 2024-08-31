const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.send("Unsername and/or Password not provided");
  }

  existing_users = users.filter((user) => {
    return user.username === username;
  });

  if (existing_users.length > 0) {
    res.send("This username already exists");
  } else {
    users.push({
        username: username,
        password: password
    });
  }
  res.send("Successfully registered");
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;

  res.send(JSON.stringify(books[ISBN]));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;

  const keys = Object.keys(books);

  let flag = false;

  for (let i = 1; i <= keys.length; i++) {
    if (books[i]['author'] == author) {
        flag = true;
        res.send(JSON.stringify(books[i], null, 4));
    }
  }
  if (!flag) {
    res.send("No book found with the specified author");
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;

  const keys = Object.keys(books);

  let flag = false;

  for (let i = 1; i <= keys.length; i++) {
    if (books[i]['title'] === title) {
        flag = true;
        res.send(JSON.stringify(books[i], null, 4));
    }
  }
  if (!flag) {
    res.send("No book found with the specified title");
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;

  book = books[ISBN];

  if (book) {
    res.send(JSON.stringify(book['reviews'], null, 4));
  } else {
    res.send("No book with the specified ISBN");
  }
});

module.exports.general = public_users;
