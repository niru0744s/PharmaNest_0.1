const instance = require('../../config/razorpay');

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
    res.status(500).send({ success: 0, message: err.message });
  }
};