const express = require("express");
const router = express.Router();

const {
  placeOrder,
  verifyOrder,
  userOrders,
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/auth");

// Test route
router.get("/", (req, res) => {
  res.send("Order API Working ✅");
});

// Routes
router.post("/place", authMiddleware, placeOrder);
router.post("/verify", authMiddleware, verifyOrder);
router.post("/userorders", authMiddleware, userOrders);

module.exports = router;