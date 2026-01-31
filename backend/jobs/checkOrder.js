const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Orders = require('../modules/orders');

async function test() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const orderId = '6978e11e7257f8de22127440';
        const order = await Orders.findById(orderId).populate('user');
        if (order) {
            console.log(`Order found: ${order._id}`);
            console.log(`User ID on order: ${order.user}`);
            console.log(`Populated User: ${JSON.stringify(order.user)}`);
        } else {
            console.log(`Order ${orderId} not found.`);
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

test();
