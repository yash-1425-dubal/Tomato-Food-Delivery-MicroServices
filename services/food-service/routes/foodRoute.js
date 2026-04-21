const express = require("express");
const { addFood, listFood, removeFood } = require("../controllers/foodController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const authMiddleware = require("../middleware/auth");

const router = express.Router();

// ✅ ensure uploads folder exists
const uploadPath = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// multer config
const storage = multer.diskStorage({
  destination: uploadPath,
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// test route
router.get("/", (req, res) => {
  res.send("Food API Working ✅");
});

// routes
router.post("/add", authMiddleware, upload.single("image"), addFood);
router.get("/list", listFood);
router.post("/remove", authMiddleware, removeFood);

module.exports = router;