const razorpay = require('../../config/razorpay');
const Orders = require('../../modules/orders');
const mongoose = require('mongoose');
const { invalidateAnalyticsForOrder, invalidateUserCachesForOrder } = require('../../utils/cacheInvalidation');

// Initiate Refund
module.exports.initiateRefund = async (req, res) => {
    try {
        const { orderId } = req.body;

        // Find order and verify ownership
        const order = await Orders.findOne({ _id: orderId, user: req.user._id });

        if (!order) {
            return res.status(404).send({
                success: 0,
                message: 'Order not found'
            });
        }

        if (order.paymentStatus !== 'completed') {
            return res.status(400).send({
                success: 0,
                message: 'No completed payment found for this order'
            });
        }

        if (order.paymentStatus === 'refunded') {
            return res.send({
                success: 0,
                message: 'Order already refunded'
            });
        }

        if (!order.paymentId) {
            return res.status(400).send({
                success: 0,
                message: 'Payment ID not found'
            });
        }

        // Create refund via Razorpay
        const refund = await razorpay.payments.refund(order.paymentId, {
            amount: order.totalAmount * 100, // Full refund in paise
            speed: 'normal', // 'normal' or 'optimum'
            notes: {
                order_id: order._id.toString(),
                reason: req.body.reason || 'Customer requested refund'
            }
        });

        // Update order status in a transaction
        const session = await mongoose.startSession();
        try {
            await session.withTransaction(async () => {
                const refreshedOrder = await Orders.findOne({ _id: orderId, user: req.user._id }).session(session);
                if (!refreshedOrder) {
                    throw new Error('Order not found');
                }
                refreshedOrder.paymentStatus = 'refunded';
                refreshedOrder.status = 'cancelled';
                refreshedOrder.refundId = refund.id;
                await refreshedOrder.save({ session });
                order.paymentStatus = refreshedOrder.paymentStatus;
                order.status = refreshedOrder.status;
                order.refundId = refreshedOrder.refundId;
            });
        } finally {
            await session.endSession();
        }
        await invalidateAnalyticsForOrder(order);
        await invalidateUserCachesForOrder(order);

        res.send({
            success: 1,
            message: 'Refund initiated successfully',
            refund: {
                id: refund.id,
                amount: refund.amount / 100,
                status: refund.status
            }
        });
    } catch (error) {
        console.error('Refund error:', error);
        res.status(500).send({
            success: 0,
            message: error.message || 'Refund failed'
        });
    }
};

// Get Refund Status
module.exports.getRefundStatus = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Orders.findOne({ _id: orderId, user: req.user._id })
            .select('paymentStatus refundId totalAmount')
            .lean();

        if (!order) {
            return res.status(404).send({
                success: 0,
                message: 'Order not found'
            });
        }

        if (order.paymentStatus !== 'refunded' || !order.refundId) {
            return res.send({
                success: 0,
                message: 'No refund found for this order',
                paymentStatus: order.paymentStatus
            });
        }

        // Fetch refund details from Razorpay
        const refund = await razorpay.refunds.fetch(order.refundId);

        res.send({
            success: 1,
            message: 'Refund status retrieved',
            refund: {
                id: refund.id,
                amount: refund.amount / 100,
                status: refund.status,
                createdAt: new Date(refund.created_at * 1000)
            }
        });
    } catch (error) {
        console.error('Get refund status error:', error);
        res.status(500).send({
            success: 0,
            message: error.message || 'Failed to retrieve refund status'
        });
    }
};
