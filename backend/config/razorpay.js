const Razorpay = require('razorpay');

const razorpayInstance = new Razorpay({
    key_id: (process.env.RAZORPAY_KEY_ID || "").trim(),
    key_secret: (process.env.RAZORPAY_KEY_SECRET || "").trim()
});

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.warn('CRITICAL: Razorpay credentials are missing in process.env');
} else {
    // Log masked keys to verification
    const id = process.env.RAZORPAY_KEY_ID.trim();
    console.log(`Razorpay Keys Loaded: ID prefix ${id.substring(0, 8)}... (Length: ${id.length})`);
}

module.exports = razorpayInstance;
