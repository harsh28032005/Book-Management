import express from "express";
import {
  create_books,
  get_all_books,
} from "../controllers/books_controller.js";

const router = express.Router();

router.post("/books", create_books);
router.get("/books", get_all_books);

export default router;
