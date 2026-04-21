const express = require("express");
const { loginUser, registerUser } = require("../controllers/userController");

const userRouter = express.Router();

// Routes
userRouter.get("/", (req, res) => {
  res.send("User API Working ✅");
});

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

module.exports = userRouter;