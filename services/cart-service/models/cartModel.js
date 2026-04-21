const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Object, default: {} },
});

module.exports = mongoose.models.cart || mongoose.model("cart", cartSchema);