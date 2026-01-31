const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Orders = require('../modules/orders');

async function test() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const orders = await Orders.find().sort({ createdAt: -1 }).limit(5);
        console.log(`Found ${orders.length} recent orders:`);
        orders.forEach(o => console.log(`Order ID: ${o._id}, User: ${o.user}, Status: ${o.status}`));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

test();
