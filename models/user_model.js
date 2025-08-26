import mongoose from "mongoose";

const user_schema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      enum: ["Mr", "Mrs", "Miss"],
      required: true,
    },
    name: { type: String, trim: true, lowercase: true, required: true },
    phone: { type: String, trim: true, unique: true, required: true },
    email: { type: String, trim: true, unique: true, required: true },
    password: {
      type: String,
      trim: true,
      minlength: 8,
      maxlength: 15,
      required: true,
    },
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      pincode: { type: String, default: "" },
    },
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", user_schema);

export default User;
