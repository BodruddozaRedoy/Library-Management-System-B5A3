import express, { Request, Response } from "express";
import { Book } from "../models/book.model";

export const bookRoutes = express.Router();
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

bookRoutes.get("/books/:bookId", async (req: Request, res: Response) => {
  const { bookId } = req.params;
  console.log(bookId)
  try {
    const book = await Book.findById(bookId)
    res.status(200).json({
      success: true,
      message: 'Book retrieved successfully',
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
