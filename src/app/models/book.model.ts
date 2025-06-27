import { IBook } from './../interfaces/book.interface';
import mongoose, { model } from "mongoose";


const BookSchema = new mongoose.Schema<IBook>({
    title: {type: String, required: true, trim: true},
    author: {type: String, required: true, trim: true},
    genre: {type: String, required: true, trim: true},
    isbn: {type: String, required: true, trim: true},
    description: {type: String, required: true, trim: true},
    copies: {type: Number, required: true, trim: true, min: [0, 'Copies must be a positive number']},
    available: {type: Boolean, required: true, trim: true}
},{
    versionKey: false,
    timestamps: true
})

export const Book = model<IBook>("Book", BookSchema)