const Razorpay = require("razorpay");

// ✅ check env variables
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error("❌ Razorpay keys missing in environment variables");
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ CREATE PAYMENT ORDER
const createPayment = async (req, res) => {
  try {
    const { amount } = req.body;

    // validation
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount"
      });
    }

    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: `order_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error("❌ Payment Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Payment creation failed"
    });
  }
};

module.exports = { createPayment };