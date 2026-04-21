const express = require("express");
const proxy = require("express-http-proxy");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Health
app.get("/health", (req, res) => {
  res.send("OK");
});

// USER
app.use("/api/user", proxy("http://13.206.88.14:5001", {
  proxyReqPathResolver: (req) => req.originalUrl
}));

// CART
app.use("/api/cart", proxy("http://15.207.103.38:5002", {
  proxyReqPathResolver: (req) => req.originalUrl
}));

// FOOD
app.use("/api/food", proxy("http://13.233.244.151:5003", {
  proxyReqPathResolver: (req) => req.originalUrl
}));

// ORDER
app.use("/api/order", proxy("http://65.2.54.227:5004", {
  proxyReqPathResolver: (req) => req.originalUrl
}));

// PAYMENT
app.use("/api/payment", proxy("http://3.110.92.83:5005", {
  proxyReqPathResolver: (req) => req.originalUrl
}));

app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
  console.log("🚀 Gateway running");
});