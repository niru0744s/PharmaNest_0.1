const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Orders = require('../modules/orders');

async function test() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const orders = await Orders.find({ user: null });
        console.log(`Found ${orders.length} orders with user: null`);
        orders.forEach(o => console.log(`Order ID: ${o._id}, Status: ${o.status}`));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

test();
