const razorpay = require('../../config/razorpay');
const Orders = require('../../modules/orders');

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

        // Update order status
        order.paymentStatus = 'refunded';
        order.status = 'cancelled';
        order.refundId = refund.id;
        await order.save();

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
