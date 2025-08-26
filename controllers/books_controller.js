import mongoose from "mongoose";
import Book from "../models/books_model.js";
import User from "../models/user_model.js";
import Review from "../models/review_model.js";

export const create_books = async (req, res) => {
  try {
    if (!Object.keys(req.body).length)
      return res
        .status(400)
        .send({ status: false, msg: "Request body can not be empty" });

    const { title, excerpt, user_id, ISBN, category, subcategory } = req.body;

    if (!title)
      return res.status(400).send({ status: false, msg: "Title is required" });

    if (!isNaN(title))
      return res.status(400).send({ Status: false, msg: "Invalid title" });

    let is_title_exist = await Book.findOne({
      title: title,
      is_deleted: false,
    });

    if (is_title_exist)
      return res.status(400).send({ status: false, msg: "Already used title" });

    if (!excerpt)
      return res
        .status(400)
        .send({ status: false, msg: "Excerpt is required" });

    if (!isNaN(excerpt))
      return res.status(400).send({ status: false, msg: "Invalid excerpt" });

    if (!user_id)
      return res
        .status(400)
        .send({ status: false, msg: "User id is required" });

    if (!mongoose.Types.ObjectId.isValid(user_id))
      return res.status(400).send({ status: false, msg: "Invalid mongo id" });

    let check_valid_user = await User.findOne({
      _id: user_id,
      is_deleted: false,
    });

    if (!check_valid_user)
      return res.status(400).send({ status: false, msg: "No user found" });

    if (!ISBN)
      return res.status(400).send({ status: false, msg: "ISBN is required" });

    if (!isNaN(ISBN))
      return res.status(400).send({ status: false, msg: "Invalid ISBN" });

    let is_ISBN_exist = await Book.findOne({ ISBN: ISBN, is_deleted: false });

    if (is_ISBN_exist)
      return res.status(400).send({ status: false, msg: "ISBN already exist" });

    if (!category)
      return res
        .status(400)
        .send({ status: false, msg: "Category is required" });

    if (!isNaN(category))
      return res.status(400).send({ status: false, msg: "Invalid category" });

    if (!subcategory)
      return res
        .status(400)
        .send({ status: false, msg: "Subcategory is required" });
    else {
      if (!Array.isArray(subcategory))
        return res
          .status(400)
          .send({ status: false, msg: "Invalid format of subcategory" });

      if (!subcategory.length)
        return res
          .status(400)
          .send({ status: false, msg: "Mention some subcategories" });

      for (let ele of subcategory) {
        if (!isNaN(ele))
          return res
            .status(400)
            .send({ status: false, msg: "Invalid subcategory element" });
      }
    }

    let save_data = await Book.create(req.body);

    return res.status(201).send({
      status: true,
      msg: "Book created successfully",
      data: save_data,
    });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

export const get_all_books = async (req, res) => {
  try {
    let { user_id, category, subcategory } = req.query;

    let filter = { is_deleted: false };

    if (user_id) filter.user_id = user_id;

    if (category) filter.category = category;

    if (subcategory) filter.subcategory = { $in: subcategory.split(",") };

    let get_books = await Book.find(filter)
      .select({
        book_id: true,
        title: true,
        excerpt: true,
        user_id: true,
        category: true,
        releasedAt: true,
        reviews: true,
      })
      .sort({ title: 1 })
      .lean();

    if (get_books.length)
      return res
        .status(200)
        .send({ status: true, msg: "List of all books", data: get_books });
    else {
      return res.status(404).send({ status: false, msg: "No data found" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

export const get_books_by_path = async (req, res) => {
  try {
    let { book_id } = req.params;

    let book_details = await Book.findOne({
      _id: book_id,
      is_deleted: false,
    }).lean();

    if (!book_details)
      return res.status(404).send({ status: false, msg: "No data found" });

    let review_details = await Review.find({
      book_id: book_id,
      is_deleted: false,
    }).lean();

    return res.status(200).send({
      status: true,
      msg: "Book Details",
      data: { ...book_details, reviewsData: review_details },
    });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

// export const update_book = async (req, res) => {
//   try {
//     let { title, excerpt, releasedAt, ISBN } = req.body;
//     let { book_id } = req.params;

//     if (!Object.keys(req.body).length)
//       return res
//         .status(400)
//         .send({ status: false, msg: "Request body can not be empty" });

//     if (!title)
//       return res.status(400).send({ status: false, msg: "Title is required" });

//     if (!isNaN(title))
//       return res.status(400).send({ status: false, msg: "Invalid title" });

//     let is_title_exist = await Book.findOne({
//       title: title,
//       is_deleted: false,
//       _id: {$ne: book_id}
//     });

//     if (is_title_exist)
//       return res.status(400).send({
//         status: false,
//         msg: "Use a different title, it is already used",
//       });

//     if (!excerpt)
//       return res
//         .status(400)
//         .send({ status: false, msg: "Excerpt is required" });

//     if (!isNaN(excerpt))
//       return res.status(400).send({ status: false, msg: "Invalid excerpt" });

//     if (!ISBN)
//       return res.status(400).send({ status: false, msg: "ISBN is required" });

//     if (!isNaN(ISBN))
//       return res.status(400).send({ status: false, msg: "Invalid ISBN" });

//     let is_ISBN_exist = await Book.findOne({ ISBN: ISBN, is_deleted: false });
//   } catch (err) {
//     return res.status(500).send({ status: false, msg: err.message });
//   }
// };
