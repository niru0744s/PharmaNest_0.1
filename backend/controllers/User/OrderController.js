const Orders = require('../../modules/orders');
const { sendEmail } = require('../../utils/emailService');

const asyncHandler = require('../../utils/asyncHandler');

module.exports.getOrderDetails = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const order = await Orders.findOne({ _id: orderId, user: req.user._id })
        .populate('products.product', 'name price imageUrl')
        .populate('address', 'name mobileNum address pincode')
        .populate('statusHistory.updatedBy', 'firstName lastName')
        .lean();

    if (!order) {
        return res.status(404).json({
            success: 0,
            message: 'Order not found'
        });
    }

    res.json({
        success: 1,
        message: 'Order details retrieved',
        order
    });
});

module.exports.filterOrders = asyncHandler(async (req, res) => {
    const { status, paymentStatus, startDate, endDate, sort } = req.query;

    const filter = { user: req.user._id };

    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const sortOrder = sort || '-createdAt';

    const orders = await Orders.find(filter)
        .populate('products.product', 'name price imageUrl')
        .populate('address', 'name address pincode')
        .sort(sortOrder)
        .lean();

    res.json({
        success: 1,
        message: 'Orders retrieved',
        count: orders.length,
        orders
    });
});

// Cancel Order (User)
module.exports.cancelOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await Orders.findOne({ _id: orderId, user: req.user._id });

    if (!order) {
        return res.status(404).json({
            success: 0,
            message: 'Order not found'
        });
    }

    // Only allow cancellation if status is pending
    if (order.status !== 'pending') {
        return res.status(400).json({
            success: 0,
            message: `Cannot cancel order with status: ${order.status}. Only pending orders can be cancelled.`
        });
    }

    if (order.status === 'cancelled') {
        return res.json({
            success: 0,
            message: 'Order already cancelled'
        });
    }

    // Update order
    order.status = 'cancelled';
    order.cancelledBy = req.user._id;
    order.cancelledByModel = 'User';
    order.cancellationReason = reason || 'Cancelled by user';

    // Add to status history
    order.statusHistory.push({
        status: 'cancelled',
        updatedBy: req.user._id,
        updatedByModel: 'User',
        notes: reason || 'Cancelled by user',
        timestamp: new Date()
    });

    await order.save();

    // Initiate refund if payment was completed
    if (order.paymentStatus === 'completed' && order.paymentId) {
        try {
            const razorpay = require('../../config/razorpay');
            const refund = await razorpay.payments.refund(order.paymentId, {
                amount: order.totalAmount * 100,
                speed: 'normal'
            });

            order.refundId = refund.id;
            order.paymentStatus = 'refunded';
            await order.save();
        } catch (refundError) {
            console.error('Auto-refund error:', refundError);
            // Continue even if refund fails - can be done manually
        }
    }

    // Send cancellation email
    const populatedOrder = await order.populate('user', 'email firstName');

    if (!populatedOrder.user) {
        console.warn("Cannot send cancellation email: User not found/deleted");
        return res.json({
            success: 1,
            message: 'Order cancelled successfully (Note: User notification skipped as account is unavailable)',
            order: {
                _id: order._id,
                status: order.status,
                paymentStatus: order.paymentStatus,
                refundId: order.refundId
            }
        });
    }

    const { email, firstName } = populatedOrder.user;

    const cancellationEmail = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #f44336;">Order Cancelled</h2>
            <p>Dear ${firstName},</p>
            <p>Your order <strong>#${order._id}</strong> has been cancelled.</p>
            <p><strong>Reason:</strong> ${order.cancellationReason}</p>
            ${order.paymentStatus === 'refunded' ? '<p><strong>Refund:</strong> ₹' + order.totalAmount + ' will be credited to your account in 5-7 business days.</p>' : ''}
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">If you have any questions, please contact our support.</p>
        </div>
    `;

    await sendEmail({
        to: email,
        subject: 'Order Cancelled - PharmaNest',
        html: cancellationEmail
    });

    res.json({
        success: 1,
        message: 'Order cancelled successfully',
        order: {
            _id: order._id,
            status: order.status,
            paymentStatus: order.paymentStatus,
            refundId: order.refundId
        }
    });
});
