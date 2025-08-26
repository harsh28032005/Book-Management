import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;

const review_schema = new mongoose.Schema(
  {
    book_id: { type: ObjectId, ref: "Book", required: true },
    reviewdBy: { type: String, trim: true, required: true },
    reviewedAt: { type: Date, required: true},
    rating: { type: Number, min: 1, max: 5, required: true },
    review: { type: String, default: "" },
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", review_schema);

export default Review;
