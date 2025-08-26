import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;

const books_schema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      // uppercase: true,
      unique: true,
      required: true,
    },
    excerpt: { type: String, trim: true, required: true },
    user_id: { type: ObjectId, ref: "User", required: true },
    ISBN: { type: String, unique: true, required: true },
    category: { type: String, trim: true, required: true },
    subcategory: { type: [String], required: true },
    reviews: { type: Number, default: 0 },
    deletedAt: { type: Date, default: null },
    is_deleted: { type: Boolean, default: false },
    releasedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", books_schema);

export default Book;
