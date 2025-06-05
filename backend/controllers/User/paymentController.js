// backend/controllers/paymentController.js
const Razorpay = require("razorpay");

const instance = new Razorpay({
  key_id:process.env.RAZORPAY_KEY_ID,
  key_secret:process.env.RAZORPAY_KEY_SECRET,
});

module.exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100, // ₹ to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    res.send({ success: 1, order });
  } catch (err) {
    console.log(err)
    res.status(500).send({ success: 0, message: err.message });
  }
};