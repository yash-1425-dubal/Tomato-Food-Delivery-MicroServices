const express = require("express");
const proxy = require("express-http-proxy");
const cors = require("cors");

const app = express();

app.disable("x-powered-by");

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Health
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// ==============================
// SERVICE DISCOVERY ROUTES
// ==============================

// USER
app.use("/api/user", proxy("http://user-service.food.local:5001"));

// CART
app.use("/api/cart", proxy("http://cart-service.food.local:5002"));

// FOOD
app.use("/api/food", proxy("http://food-service.food.local:5003"));

// ORDER
app.use("/api/order", proxy("http://order-service.food.local:5004"));

// PAYMENT
app.use("/api/payment", proxy("http://payment-service.food.local:5005"));

// ==============================
// 404
// ==============================
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ==============================
// ERROR HANDLER
// ==============================
app.use((err, req, res, next) => {
  console.error("❌ Gateway Error:", err);
  res.status(500).json({ message: "Gateway Error" });
});

// Start
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 API Gateway running on ${PORT}`);
});