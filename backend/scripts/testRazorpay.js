require('dotenv').config();
const Razorpay = require('razorpay');

const key_id = (process.env.RAZORPAY_KEY_ID || "").trim();
const key_secret = (process.env.RAZORPAY_KEY_SECRET || "").trim();

console.log('--- Razorpay Key Verification ---');
console.log(`Key ID: ${key_id.substring(0, 10)}... (Length: ${key_id.length})`);
console.log(`Key Secret: ${key_secret.substring(0, 3)}...${key_secret.substring(key_secret.length - 3)} (Length: ${key_secret.length})`);

if (!key_id || !key_secret) {
    console.error('Error: Keys are missing in .env file!');
    process.exit(1);
}

const rzp = new Razorpay({
    key_id: key_id,
    key_secret: key_secret
});

async function testConnection() {
    try {
        console.log('Attempting to fetch orders to verify credentials...');
        const orders = await rzp.orders.all({ count: 1 });
        console.log('✅ Connection Successful! Your keys are valid.');
        console.log('Latest Order:', JSON.stringify(orders, null, 2));
    } catch (error) {
        console.error('❌ Connection Failed!');
        console.error('Status Code:', error.statusCode);
        console.error('Error Details:', JSON.stringify(error, null, 2));

        if (error.statusCode === 401) {
            console.error('\nPOSSIBLE CAUSES:');
            console.error('1. Your Key ID or Key Secret is incorrect.');
            console.error('2. You are using Test keys in a Live environment setting (or vice versa).');
            console.error('3. There are invisible characters in your .env file.');
        }
    }
}

testConnection();
