const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../../models/User");
const auth = require("../../middleware/auth");
const config = require("config");

/*
  @route  POST api/auth
  @desc   Register new user
  @access Public
*/
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  try {
    const user = await User.findOne({ email });
    if (user) throw Error("User exists");

    const salt = await bcrypt.genSalt(15);
    if (!salt) throw Error("Generating salt failed");

    const hash = await bcrypt.hash(password, salt);
    if (!hash) throw Error("Generating hash for password failed");

    const newUser = new User({
      name,
      email,
      password: hash
    });

    const savedUser = await newUser.save();
    if (!savedUser) throw Error("Saving user failed");

    const token = jwt.sign(
      { id: savedUser._id, name: savedUser.name, email: savedUser.email },
      config.jwtSecret,
      { expiresIn: 3600 }
    );

    res.status(200).json({
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email
      }
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

/*
  @route POST api/auth
  @desc Login user
  @access Public
*/
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ msg: "Please enter all fields" });

  try {
    const user = await User.findOne({ email });

    if (!user) throw Error("Invalid credentials or user does not exists");

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) throw Error("Invalid credentials");

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      config.jwtSecret,
      { expiresIn: 3600 }
    );

    if (!token) throw Error("Token signing failed");

    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

/*
  @route GET api/auth
  @desc Retrieve user using token
  @access Private
*/
router.get("/user", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) throw Error("User not authenticated");

    const loggedInUser = {
      id: user._id,
      name: user.name,
      email: user.email
    };

    res.json(loggedInUser);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

module.exports = router;
