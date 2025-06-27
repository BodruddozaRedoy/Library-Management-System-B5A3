import express, { Request, Response } from 'express'
import { Book } from '../models/book.model'

export const bookRoutes = express.Router()

bookRoutes.post("/books", async (req:Request, res:Response) => {
    const body = req.body

    const user = await Book.create(body)

    res.status(201).json({
        success: true,
        message: "User created successfully",
        user
    })
})