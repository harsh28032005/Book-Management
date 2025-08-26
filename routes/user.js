import express from "express";
import {
  create_user,
  get_all_users,
  login,
} from "../controllers/user_controller.js";

const router = express.Router();

router.post("/register", create_user);
router.get("/register", get_all_users);
router.post("/login", login);

export default router;
