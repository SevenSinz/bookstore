const jsonschema = require("jsonschema");
const bookSchema = require("../schemas/bookSchema.json");
const ExpressError = require("../expressError");

const express = require("express");
const router = new express.Router();
const Book = require("../models/book");

// Responds with a list of all the books
router.get("/", async function (req, res, next) {
  try {
    const books = await Book.findAll(req.query);
    return res.json({ books });
  } catch (err) {
    return next(err);
  }
});

// Responds with a single book found by its isbn
router.get("/:id", async function (req, res, next) {
  try {
    const book = await Book.findOne(req.params.id);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

// Creates a book and responds with the newly created book
router.post("/", async function (req, res, next) {

  const result = jsonschema.validate(req.body, bookSchema);
  
  if (!result.valid) {
    let listOfErrors = result.errors.map(err => err.stack);
    let err = new ExpressError(listOfErrors, 400);
    return next(err);
  } 
  try {
    const book = await Book.create(req.body);
    return res.status(201).json({ book });

  } catch (err) {
    return next(err);
  }
});

// Updates a book and responds with the updated book
router.patch("/:isbn", async function (req, res, next) {
  const isbn = req.params.isbn;
  const data = req.body;
  let values = {isbn, ...data};
  debugger
  const result = jsonschema.validate(values, bookSchema);

  if (!result.valid) {
    let listOfErrors = result.errors.map(err => err.stack);
    let err= new ExpressError(listOfErrors, 400);
    return next(err);
  }
  
  try {
    const book = await Book.update(req.params.isbn, req.body);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

// Deletes a book and responds with a message of “Book deleted”
router.delete("/:isbn", async function (req, res, next) {
  try {
    await Book.remove(req.params.isbn);
    return res.json({ message: "Book deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
