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

  const existing_users = users.filter((user) => {
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
public_users.get('/', async function (req, res) {
  //Write your code here
  const getData = async() => {
    return JSON.stringify(books, null, 4);
  }

  const data = await getData();

  res.send(data);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  const getData = async() => {
    const isbn = req.params.isbn;

    const book = books[isbn];

    if (!book) {
        return ("No book with the specified ISBN");
    };

    return JSON.stringify(book, null, 4);
    
  };

  const data = await getData();

  res.send(data);
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const getData = new Promise((resolve, reject) => {
    const author = req.params.author;

    const keys = Object.keys(books);

    for (let i = 1; i <= keys.length; i++) {
        if (books[i]['author'] == author) {
            resolve(JSON.stringify(books[i], null, 4));
        }
    }
    reject("No book found with the specified author");
  });

  getData.then(data => res.send(data)).catch(error => res.send(error));
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const getData = new Promise((resolve, reject) => {
    const title = req.params.title;

    const keys = Object.keys(books);

    for (let i = 1; i <= keys.length; i++) {
        if (books[i]['title'] === title) {
            resolve(JSON.stringify(books[i], null, 4));
        }
    }
    reject("No book found with the specified title");
  });

   getData.then(data => res.send(data)).catch(error => res.send(error));
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;

  const book = books[ISBN];

  if (book) {
    res.send(JSON.stringify(book['reviews'], null, 4));
  } else {
    res.send("No book with the specified ISBN");
  }
});

module.exports.general = public_users;
