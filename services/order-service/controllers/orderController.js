const orderModel = require("../models/orderModel");
const Razorpay = require("razorpay");

// Check env
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error("❌ Razorpay keys missing");
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ==============================
// PLACE ORDER
// ==============================
const placeOrder = async (req, res) => {
  try {
    const { items, amount, address, userId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty"
      });
    }

    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      payment: false,
      status: "Pending",
    });

    await newOrder.save();

    // Razorpay order
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: newOrder._id.toString(),
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      orderId: newOrder._id,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.error("❌ Place Order Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error placing order"
    });
  }
};

// ==============================
// VERIFY PAYMENT
// ==============================
const verifyOrder = async (req, res) => {
  try {
    const { orderId, razorpay_payment_id } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID missing"
      });
    }

    if (razorpay_payment_id) {
      await orderModel.findByIdAndUpdate(orderId, {
        payment: true,
        status: "Paid",
      });

      return res.json({
        success: true,
        message: "Payment Successful"
      });
    } else {
      await orderModel.findByIdAndDelete(orderId);

      return res.json({
        success: false,
        message: "Payment Failed"
      });
    }

  } catch (error) {
    console.error("❌ Verify Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error verifying payment"
    });
  }
};

// ==============================
// USER ORDERS
// ==============================
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });

    return res.json({
      success: true,
      data: orders,
    });

  } catch (error) {
    console.error("❌ Fetch Orders Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching orders"
    });
  }
};

module.exports = {
  placeOrder,
  verifyOrder,
  userOrders,
};