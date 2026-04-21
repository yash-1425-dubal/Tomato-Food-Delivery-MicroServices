const express = require("express");
const {
  addToCart,
  getCart,
  removeFromCart,
} = require("../controllers/cartController");

const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Test route
router.get("/", (req, res) => {
  res.send("Cart API Working ✅");
});

// ✅ ALL routes protected
router.post("/add", authMiddleware, addToCart);
router.post("/remove", authMiddleware, removeFromCart);
router.post("/get", authMiddleware, getCart);

module.exports = router;