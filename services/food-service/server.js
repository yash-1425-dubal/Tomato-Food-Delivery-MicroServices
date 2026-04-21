const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const foodRouter = require("./routes/foodRoute");

const app = express();

app.disable("x-powered-by");

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// ✅ serve uploaded images
app.use("/images", express.static(path.join(__dirname, "uploads")));

// Root
app.get("/", (req, res) => {
  res.send("Food Service Running ✅");
});

// Health
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// DB
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.error("❌ MONGO_URL missing");
} else {
  mongoose.connect(MONGO_URL)
    .then(() => console.log("✅ DB Connected"))
    .catch(err => console.error("❌ DB Error:", err.message));
}

// Routes
app.use("/api/food", foodRouter);

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ success: false, message: "Server Error" });
});

const PORT = process.env.PORT || 5003;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Food Service running on ${PORT}`);
});