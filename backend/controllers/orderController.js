import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Razorpay from "razorpay";

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ==============================
// PLACE ORDER (Razorpay)
// ==============================
const placeOrder = async (req, res) => {
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      payment: false,
      status: "Pending",
    });

    await newOrder.save();

    // clear cart
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // Razorpay order
    const options = {
      amount: req.body.amount * 100, // INR → paise
      currency: "INR",
      receipt: newOrder._id.toString(),
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      orderId: newOrder._id,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error placing order" });
  }
};

// ==============================
// VERIFY PAYMENT
// ==============================
const verifyOrder = async (req, res) => {
  try {
    const { orderId, razorpay_payment_id } = req.body;

    if (razorpay_payment_id) {
      // payment success
      await orderModel.findByIdAndUpdate(orderId, {
        payment: true,
        status: "Paid",
      });

      res.json({ success: true, message: "Payment Successful" });
    } else {
      // payment failed
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment Failed" });
    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error verifying payment" });
  }
};

// ==============================
// USER ORDERS
// ==============================
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// ==============================
// ADMIN: LIST ALL ORDERS
// ==============================
const listOrders = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);

    if (userData && userData.role === "admin") {
      const orders = await orderModel.find({});
      res.json({ success: true, data: orders });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// ==============================
// ADMIN: UPDATE STATUS
// ==============================
const updateStatus = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);

    if (userData && userData.role === "admin") {
      await orderModel.findByIdAndUpdate(req.body.orderId, {
        status: req.body.status,
      });

      res.json({ success: true, message: "Status Updated Successfully" });
    } else {
      res.json({ success: false, message: "You are not an admin" });
    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// ==============================
export {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus,
};