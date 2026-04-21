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
  res.send("User Service Running ✅");
});

// Health
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// ENV
const PORT = process.env.PORT || 5001;
const MONGO_URL = process.env.MONGO_URL;

console.log("MONGO_URL:", MONGO_URL ? "Loaded" : "Missing");

// DB
if (!MONGO_URL) {
  console.error("❌ MONGO_URL not defined");
} else {
  mongoose.connect(MONGO_URL)
    .then(() => console.log("✅ DB Connected"))
    .catch((err) => {
      console.error("❌ DB Error:", err.message);
    });
}

// Routes
const userRouter = require("./routes/userRoute");
app.use("/api/user", userRouter);

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ success: false, message: "Server Error" });
});

// Start
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 User Service running on port ${PORT}`);
});