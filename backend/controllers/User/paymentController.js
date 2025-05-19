// backend/controllers/paymentController.js
const Razorpay = require("razorpay");

const instance = new Razorpay({
  key_id:"rzp_test_zGATeYxiFoQQLt",
  key_secret:"VxGre58Vfs5bPVdsSWByFV7z",
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