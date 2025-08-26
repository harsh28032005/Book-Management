import User from "../models/user_model.js";
import jwt from "jsonwebtoken";

export const create_user = async (req, res) => {
  try {
    const { title, name, phone, email, password, address } = req.body;

    if (!Object.keys(req.body).length)
      return res
        .status(400)
        .send({ status: false, msg: "Request body can not be empty" });

    if (!title)
      return res.status(400).send({ status: false, msg: "Title is required" });

    if (!isNaN(title) || !["Mr", "Mrs", "Miss"].includes(title.trim()))
      return res.status(400).send({
        status: false,
        msg: "Invalid title, title must be Mr, Mrs or Miss",
      });

    if (!name)
      return res.status(400).send({ status: false, msg: "Name is required" });

    if (!isNaN(name))
      return res.status(400).send({ status: false, msg: "Invalid name" });

    if (!phone)
      return res
        .status(400)
        .send({ status: false, msg: "Phone number is required" });

    if (!"/^[6-9]{1}[0-9]{9}$/".test(phone.toString()))
      return res
        .status(400)
        .send({ status: false, msg: "Invalid phone number" });

    const is_phone_exist = await User.findOne({
      phone: phone,
      is_deleted: false,
    });

    if (is_phone_exist)
      return res.status(400).send({
        status: false,
        msg: "Phone Number already exist for another user",
      });

    if (!email)
      return res.status(400).send({ status: false, msg: "Email is required" });

    if (
      !isNaN(email) ||
      !"/^[A-Za-z]{1,10}[0-9._-]{0,4}@[a-z]{4,7}.[a-z]{2,3}$/".test(email)
    )
      return res.status(400).send({ status: false, msg: "Invalid email" });

    const is_email_exist = await User.findOne({
      email: email,
      is_deleted: false,
    });

    if (is_email_exist)
      return res.status(400).send({
        status: false,
        msg: "Email already registered",
      });

    if (!password)
      return res
        .status(400)
        .send({ status: false, msg: "Password is required" });

    if (!isNaN(password))
      return res.status(400).send({ status: false, msg: "Invalid Password" });

    if (password.length < 8 || password.length > 15) {
      return res.status(400).send({
        status: false,
        msg: "Password must be between 8 and 15 characters long.",
      });
    }

    if (
      req.body.hasOwnProperty("address") &&
      typeof address === "object" &&
      address !== null &&
      Object.keys(address).length
    ) {
      const { street, city, pincode } = address;
      if (!street)
        return res
          .status(400)
          .send({ status: false, msg: "Street is required" });

      if (!isNaN(street))
        return res.status(400).send({ status: false, msg: "Invalid street" });

      if (!city)
        return res.status(400).send({ status: false, msg: "City is required" });

      if (!isNaN(city))
        return res.status(400).send({ status: false, msg: "Invalid city" });

      if (!pincode)
        return res
          .status(400)
          .send({ status: false, msg: "Pincode is required" });

      if (isNaN(pincode))
        return res.status(400).send({ status: false, msg: "Invalid Pincode" });
    }

    const save_data = await User.create(req.body);
    return res.status(201).send({
      status: true,
      msg: "User created successfully",
      data: save_data,
    });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

export const get_all_users = async (req, res) => {
  try {
    let { name, search } = req.query;

    let filter = { is_deleted: false };

    if (name) filter.name = name;

    if (search) filter.name = { $regex: search, $options: "i" };

    let get_author = await User.find(filter);

    if (!get_author.length)
      return res.status(404).send({ status: false, msg: "No user found" });
    else
      return res
        .status(200)
        .send({ status: true, msg: "List of users", data: get_author });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

export const login = async (req, res) => {
  try {
    if (!Object.keys(req.body).length)
      return res
        .status(400)
        .send({ status: false, msg: "Request body can not be empty" });

    let { email, password } = req.body;

    if (!email)
      return res.status(400).send({ status: false, msg: "Email is required" });

    if (!password)
      return res
        .status(400)
        .send({ status: false, msg: "Password is required" });

    let check_user = await User.findOne({
      email: email,
      password: password,
      is_deleted: false,
    });

    if (!check_user)
      return res
        .status(401)
        .send({ status: false, msg: "Invalid Credentials" });

    let token = jwt.sign(
      {
        user_id: check_user._id,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 10 * 60,
      },
      process.env.JWT_SECRET_KEY
    );

    return res.status(200).send({
      status: true,
      msg: "User logged in successfully",
      data: { token: token, user_id: check_user._id },
    });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};
