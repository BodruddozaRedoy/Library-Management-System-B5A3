import express, { Request, Response } from "express";
import { Book } from "../models/book.model";
import { Borrow } from "../models/borrow.models";

export const bookRoutes = express.Router();
export const borrowRoutes = express.Router();
// create a book
bookRoutes.post("/books", async (req: Request, res: Response) => {
  const body = req.body;

  try {
    const book = await Book.create(body);

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Validation failed",
      error: error,
    });
    console.log({
      message: "Validation failed",
      success: false,
      error: error,
    });
  }
});

// get all books
bookRoutes.get("/books", async (req: Request, res: Response) => {
  const { filter, sortBy, sort, limit } = req.query as {
    filter?: string;
    sortBy?: string;
    sort?: string;
    limit?: string;
  };

  try {
    const filterQuery = filter ? { genre: filter } : {};
    const sortField = sortBy || "createdAt";
    const sortOrder = sort?.toLowerCase() === "asc" ? 1 : -1;
    const resultLimit = limit ? parseInt(limit) : 10;

    const books = await Book.find(filterQuery)
      .sort({ [sortField]: sortOrder })
      .limit(resultLimit);

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      error: error,
    });
    console.error(error);
  }
});

// get book by book id
bookRoutes.get("/books/:bookId", async (req: Request, res: Response) => {
  const { bookId } = req.params;
  console.log(bookId);
  try {
    const book = await Book.findById(bookId);
    res.status(200).json({
      success: true,
      message: "Book retrieved successfully",
      data: book,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      error: error,
    });
    console.error(error);
  }
});

// update a book
bookRoutes.put("/books/:bookId", async (req: Request, res: Response) => {
  const { bookId } = req.params;
  const body = req.body;
  try {
    const updateBook = await Book.findByIdAndUpdate(bookId, body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: updateBook,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      error: error,
    });
    console.error(error);
  }
});

// delete a book
bookRoutes.delete("/books/:bookId", async (req: Request, res: Response) => {
  const { bookId } = req.params;
  try {
    await Book.findByIdAndDelete(bookId);
    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      error: error,
    });
    console.error(error);
  }
});

// create a borrow
borrowRoutes.post("/borrow", async (req: Request, res: Response) => {
  const body = req.body;
  try {
    const book = await Book.findById(body.book);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    if (book.copies < body.quantity) {
      return res.status(400).json({
        success: false,
        message: 'Not enough copies available',
      });
    }

    book.copies -= body.quantity;
    await book.save();

    await Book.updateAvailability(body.book);

    const borrow = await Borrow.create(body);
    res.status(200).json({
      success: true,
      message: "Book borrowed successfully",
      data: borrow,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      error: error,
    });
    console.error(error);
  }
});
