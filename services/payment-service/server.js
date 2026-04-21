const express = require("express");
const cors = require("cors");

const paymentRouter = require("./routes/paymentRoute");

const app = express();

app.disable("x-powered-by");

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

// Root
app.get("/", (req, res) => {
  res.send("Payment Service Running ✅");
});

// Health
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/api/payment", paymentRouter);

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ success: false, message: "Server Error" });
});

const PORT = process.env.PORT || 5005;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Payment Service running on ${PORT}`);
});