const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../../models/User");
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, role });
    await user.save();
    res.status(201).send("User registered");
  } catch (error) {
    res.status(400).send("Error registering user");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("Invalid password");

    req.session.user = { id: user._id, role: user.role, email: user.email };
    res.redirect("/");
  } catch (error) {
    res.status(400).send("Error logging in");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/");
    }
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});

module.exports = router;
