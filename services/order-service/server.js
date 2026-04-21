const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.disable("x-powered-by");

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Root
app.get("/", (req, res) => {
  res.send("Order Service Running ✅");
});

// Health
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// ENV
const PORT = process.env.PORT || 5004;
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.error("❌ MONGO_URL missing");
} else {
  mongoose.connect(MONGO_URL)
    .then(() => console.log("✅ DB Connected"))
    .catch(err => console.error("❌ DB Error:", err.message));
}

// Routes
const orderRouter = require("./routes/orderRoute");
app.use("/api/order", orderRouter);

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ success: false, message: "Server Error" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Order Service running on ${PORT}`);
});