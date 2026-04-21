const cartModel = require("../models/cartModel");

// ADD TO CART
const addToCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "Item ID required"
      });
    }

    let cart = await cartModel.findOne({ userId });

    if (!cart) {
      cart = new cartModel({
        userId,
        items: { [itemId]: 1 },
      });
    } else {
      cart.items[itemId] = (cart.items[itemId] || 0) + 1;
    }

    await cart.save();

    res.json({
      success: true,
      message: "Added to Cart"
    });

  } catch (error) {
    console.error("❌ Add Cart Error:", error);
    res.status(500).json({
      success: false,
      message: "Error adding to cart"
    });
  }
};

// REMOVE FROM CART
const removeFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    let cart = await cartModel.findOne({ userId });

    if (!cart || !cart.items[itemId]) {
      return res.json({ success: true });
    }

    if (cart.items[itemId] > 1) {
      cart.items[itemId] -= 1;
    } else {
      delete cart.items[itemId];
    }

    await cart.save();

    res.json({
      success: true,
      message: "Removed from Cart"
    });

  } catch (error) {
    console.error("❌ Remove Error:", error);
    res.status(500).json({
      success: false,
      message: "Error removing item"
    });
  }
};

// GET CART
const getCart = async (req, res) => {
  try {
    const cart = await cartModel.findOne({ userId: req.body.userId });

    res.json({
      success: true,
      cartData: cart ? cart.items : {}
    });

  } catch (error) {
    console.error("❌ Get Cart Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching cart"
    });
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  getCart,
};