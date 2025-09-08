import express from "express";
import {
  create_books,
  delete_book,
  get_all_books,
  get_books_by_path,
  update_book,
} from "../controllers/books_controller.js";

const router = express.Router();

router.post("/books", create_books);
router.get("/books", get_all_books);
router.get("/books/:book_id", get_books_by_path);
router.put("/books/:book_id", update_book);
router.put("/books/:book_id", delete_book);

export default router;
