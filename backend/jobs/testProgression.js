const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '../.env') });

const Orders = require('../modules/orders');
const { runOrderProgression } = require('./orderProgression');

async function test() {
    try {

        console.log('Connected to MongoDB');

        await runOrderProgression();

        console.log('Test completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('Test failed:', err);
        process.exit(1);
    }
}

test();
