const foodModel = require("../models/foodModel");

// ADD FOOD
const addFood = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required"
      });
    }

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: req.file.filename,
    });

    await food.save();

    res.status(200).json({
      success: true,
      message: "Food Added"
    });

  } catch (error) {
    console.error("❌ Add Food Error:", error);
    res.status(500).json({
      success: false,
      message: "Error adding food"
    });
  }
};

// LIST FOOD
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({
      success: true,
      data: foods
    });

  } catch (error) {
    console.error("❌ List Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching food"
    });
  }
};

// REMOVE FOOD
const removeFood = async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(400).json({
        success: false,
        message: "Food ID required"
      });
    }

    await foodModel.findByIdAndDelete(req.body.id);

    res.json({
      success: true,
      message: "Food Removed"
    });

  } catch (error) {
    console.error("❌ Remove Error:", error);
    res.status(500).json({
      success: false,
      message: "Error removing food"
    });
  }
};

module.exports = {
  addFood,
  listFood,
  removeFood,
};