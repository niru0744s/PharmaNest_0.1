const razorpay = require('../../config/razorpay');
const Orders = require('../../modules/orders');
const Product = require('../../modules/Products');
const crypto = require('crypto');
const { sendEmail } = require('../../utils/emailService');

module.exports.createOrder = async (req, res) => {
    try {
        const { amount, currency, receipt } = req.body;

        const options = {
            amount: amount * 100, 
            currency: currency || 'INR',
            receipt: receipt || `order_${Date.now()}`,
            payment_capture: 1
        };

        const razorpayOrder = await razorpay.orders.create(options);

        res.send({
            success: 1,
            message: 'Razorpay order created successfully',
            order: razorpayOrder
        });
    } catch (error) {
        console.error('Create Razorpay order error:', error);
        res.status(500).send({
            success: 0,
            message: error.message || 'Failed to create Razorpay order'
        });
    }
};

module.exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
            return res.status(400).send({
                success: 0,
                message: 'Missing required payment details'
            });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            const order = await Orders.findByIdAndUpdate(orderId, {
                paymentId: razorpay_payment_id,
                razorpayOrderId: razorpay_order_id,
                paymentStatus: 'completed',
                status: 'pending'
            }, { new: true });

            if (!order) {
                return res.status(404).send({
                    success: 0,
                    message: 'Order not found'
                });
            }

            if (order.products && order.products.length > 0) {
                for (const item of order.products) {
                    await Product.findByIdAndUpdate(item.product, {
                        $inc: {
                            quantity: -item.quantity,
                            soldQuantity: item.quantity
                        }
                    });
                }
            }

            try {
                const user = await order.populate('user', 'email firstName lastName');
                const confirmationEmail = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #4CAF50;">Payment Successful! 🎉</h2>
                        <p>Dear ${user.user.firstName},</p>
                        <p>Your payment of <strong>₹${order.totalAmount}</strong> has been received successfully.</p>
                        <p><strong>Order ID:</strong> ${order._id}</p>
                        <p><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
                        <p>Your order is being processed and will be shipped soon.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="color: #666; font-size: 12px;">Thank you for shopping with PharmaNest!</p>
                    </div>
                `;

                await sendEmail({
                    to: user.user.email,
                    subject: 'Payment Confirmation - PharmaNest',
                    html: confirmationEmail
                });
            } catch (emailError) {
                console.error('Email send error:', emailError);
            }

            res.send({
                success: 1,
                message: 'Payment verified successfully',
                order
            });
        } else {
            await Orders.findByIdAndUpdate(orderId, {
                paymentStatus: 'failed'
            });

            res.status(400).send({
                success: 0,
                message: 'Payment verification failed - Invalid signature'
            });
        }
    } catch (error) {
        console.error('Verify payment error:', error);
        res.status(500).send({
            success: 0,
            message: error.message || 'Payment verification failed'
        });
    }
};

module.exports.getPaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Orders.findById(orderId)
            .select('paymentStatus paymentId razorpayOrderId totalAmount status')
            .lean();

        if (!order) {
            return res.status(404).send({
                success: 0,
                message: 'Order not found'
            });
        }

        res.send({
            success: 1,
            message: 'Payment status retrieved',
            paymentStatus: order.paymentStatus,
            paymentId: order.paymentId,
            razorpayOrderId: order.razorpayOrderId,
            totalAmount: order.totalAmount,
            orderStatus: order.status
        });
    } catch (error) {
        console.error('Get payment status error:', error);
        res.status(500).send({
            success: 0,
            message: error.message || 'Failed to retrieve payment status'
        });
    }
};

module.exports.webhook = async (req, res) => {
    try {
        const webhookSignature = req.headers['x-razorpay-signature'];
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

        if (!webhookSecret) {
            console.error('Webhook secret not configured');
            return res.status(500).send({ success: 0 });
        }

        const webhookBody = JSON.stringify(req.body);

        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(webhookBody)
            .digest('hex');

        if (webhookSignature === expectedSignature) {
            const event = req.body.event;
            const paymentEntity = req.body.payload.payment.entity;

            console.log('Webhook event received:', event);

            switch (event) {
                case 'payment.captured':
                    await handlePaymentSuccess(paymentEntity);
                    break;
                case 'payment.failed':
                    await handlePaymentFailure(paymentEntity);
                    break;
                case 'payment.authorized':
                    console.log('Payment authorized:', paymentEntity.id);
                    break;
                default:
                    console.log('Unhandled event:', event);
            }

            res.send({ success: 1 });
        } else {
            console.error('Invalid webhook signature');
            res.status(400).send({ success: 0, message: 'Invalid signature' });
        }
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).send({ success: 0 });
    }
};

async function handlePaymentSuccess(paymentEntity) {
    try {
        const order = await Orders.findOne({ razorpayOrderId: paymentEntity.order_id });
        if (order && order.paymentStatus !== 'completed') {
            order.paymentStatus = 'completed';
            order.paymentId = paymentEntity.id;
            order.status = 'pending';
            await order.save();

            if (order.products && order.products.length > 0) {
                for (const item of order.products) {
                    await Product.findByIdAndUpdate(item.product, {
                        $inc: {
                            quantity: -item.quantity,
                            soldQuantity: item.quantity
                        }
                    });
                }
            }

            console.log('Order payment completed via webhook:', order._id);
        }
    } catch (error) {
        console.error('Handle payment success error:', error);
    }
}

async function handlePaymentFailure(paymentEntity) {
    try {
        const order = await Orders.findOne({ razorpayOrderId: paymentEntity.order_id });
        if (order) {
            order.paymentStatus = 'failed';
            await order.save();

            console.log('Order payment failed via webhook:', order._id);
        }
    } catch (error) {
        console.error('Handle payment failure error:', error);
    }
}
