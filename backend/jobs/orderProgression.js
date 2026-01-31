const cron = require('node-cron');
const Orders = require('../modules/orders');
const { sendUserEmail } = require('../controllers/User/SendEmail');

/**
 * Automatically progresses orders through status steps every 10 minutes.
 * steps: pending -> shipped -> on_the_way -> delivered
 */
const runOrderProgression = async () => {
    try {
        console.log('--- Starting Order Progression Job ---');

        const eligibleOrders = await Orders.find({
            status: { $in: ['pending', 'shipped', 'on_the_way'] }
        }).populate('user', 'email firstName');

        if (eligibleOrders.length === 0) {
            console.log('No orders currently eligible for progression.');
            return;
        }

        const statusTransitions = {
            'pending': 'shipped',
            'shipped': 'on_the_way',
            'on_the_way': 'delivered'
        };

        for (const order of eligibleOrders) {
            const currentStatus = order.status;
            const nextStatus = statusTransitions[currentStatus];

            if (!nextStatus) continue;

            // Check if 10 minutes have passed since last update
            const lastUpdate = new Date(order.updatedAt);
            const now = new Date();
            const diffMinutes = Math.floor((now - lastUpdate) / 1000 / 60);

            // For demo purposes, we can progress if diffMinutes >= 10
            // The user said "after 10 min the order will move to the next step"
            if (diffMinutes >= 10) {
                if (!order.user) {
                    console.warn(`Order #${order._id} is eligible for progression but has no associated user. Skipping email.`);
                }

                console.log(`Progressing Order #${order._id} from ${currentStatus} to ${nextStatus}`);

                order.status = nextStatus;
                order.statusHistory.push({
                    status: nextStatus,
                    updatedBy: null, // System updated
                    updatedByModel: 'Host', // Categorizing as host-side update for history logic
                    notes: `Automatic status update to ${nextStatus}`,
                    timestamp: new Date()
                });

                await order.save();

                // Send Email Notification
                let emailSubject = '';
                let emailBody = '';

                if (nextStatus === 'shipped') {
                    emailSubject = 'Your Order Has Been Shipped! 📦';
                    emailBody = `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #4CAF50;">Your Order Has Been Shipped! 📦</h2>
                            <p>Dear ${order.user?.firstName || 'Valued Customer'},</p>
                            <p>Great news! Your order <strong>#${order._id}</strong> has been shipped.</p>
                            <p>Expected delivery: 3-5 business days</p>
                            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                            <p style="color: #666; font-size: 12px;">Thank you for shopping with PharmaNest!</p>
                        </div>
                    `;
                } else if (nextStatus === 'on_the_way') {
                    emailSubject = 'Your Order is On the Way! 🚚';
                    emailBody = `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #4CAF50;">Your Order is On the Way! 🚚</h2>
                            <p>Dear ${order.user?.firstName || 'Valued Customer'},</p>
                            <p>Your order <strong>#${order._id}</strong> is currently out for delivery.</p>
                            <p>You should receive it shortly!</p>
                            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                            <p style="color: #666; font-size: 12px;">Thank you for shopping with PharmaNest!</p>
                        </div>
                    `;
                } else if (nextStatus === 'delivered') {
                    emailSubject = 'Your Order Has Been Delivered! ✅';
                    emailBody = `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #4CAF50;">Your Order Has Been Delivered! ✅</h2>
                            <p>Dear ${order.user?.firstName || 'Valued Customer'},</p>
                            <p>Your order <strong>#${order._id}</strong> has been successfully delivered.</p>
                            <p>We hope you enjoy your purchase!</p>
                            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                            <p style="color: #666; font-size: 12px;">Thank you for shopping with PharmaNest!</p>
                        </div>
                    `;
                }

                if (emailSubject && emailBody && order.user?.email) {
                    try {
                        await sendUserEmail(order.user.email, emailSubject, emailBody);
                        console.log(`Email sent for Order #${order._id} (${nextStatus})`);
                    } catch (emailErr) {
                        console.error(`Failed to send email for Order #${order._id}:`, emailErr.message);
                    }
                }
            } else {
                console.log(`Order #${order._id} is at ${currentStatus} but only ${diffMinutes} mins passed. Skipping.`);
            }
        }

        console.log('--- Order Progression Job Completed ---');
    } catch (error) {
        console.error('Order progression job error:', error);
    }
};

// Schedule to run every 1 minute to check for eligible orders
// But it will only progress them if they have been at the current status for 10 minutes
cron.schedule('*/1 * * * *', runOrderProgression);

module.exports = { runOrderProgression };
