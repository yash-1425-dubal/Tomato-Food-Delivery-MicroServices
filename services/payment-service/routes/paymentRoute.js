const express = require("express");
const { createPayment } = require("../controllers/paymentController");

const paymentRouter = express.Router();

// test route
paymentRouter.get("/", (req, res) => {
  res.send("Payment API Working ✅");
});

// create Razorpay order
paymentRouter.post("/create", createPayment);

module.exports = paymentRouter;