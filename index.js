import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import user_router from "./routes/user.js";
import book_router from "./routes/book.js";

const app = express();

app.use(express.json());

app.use("", user_router);
app.use("", book_router);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Database is connected successfully"))
  .catch((err) => console.log("Error to connect MongoDB Database", err));

app.listen(process.env.PORT, () =>
  console.log(`Server is running on the port ${process.env.PORT}`)
);
