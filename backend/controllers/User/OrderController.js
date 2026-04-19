const Orders = require('../../modules/orders');
const mongoose = require('mongoose');
const { queueEmail } = require('../../utils/emailQueue');
const { getOrSetCacheWithStale } = require('../../utils/cacheStrategy');
const { invalidateAnalyticsForOrder, invalidateUserOrderCaches } = require('../../utils/cacheInvalidation');

const asyncHandler = require('../../utils/asyncHandler');
const USER_ORDER_TTL_SECONDS = 60;
const USER_ORDER_STALE_TTL_SECONDS = 180;

const buildSortedQueryKey = (query = {}) => {
    const sortedKeys = Object.keys(query).sort();
    const normalized = {};
    sortedKeys.forEach((key) => {
        normalized[key] = query[key];
    });
    return JSON.stringify(normalized);
};

module.exports.getOrderDetails = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const cacheKey = `user:${req.user._id}:order-detail:${orderId}:v1`;
    const response = await getOrSetCacheWithStale({
        key: cacheKey,
        ttlSeconds: USER_ORDER_TTL_SECONDS,
        staleTtlSeconds: USER_ORDER_STALE_TTL_SECONDS,
        compute: async () => {
            const order = await Orders.findOne({ _id: orderId, user: req.user._id })
                .populate('products.product', 'name price imageUrl')
                .populate('address', 'name mobileNum address pincode')
                .populate('statusHistory.updatedBy', 'firstName lastName')
                .lean();

            if (!order) {
                return {
                    success: 0,
                    message: 'Order not found'
                };
            }

            return {
                success: 1,
                message: 'Order details retrieved',
                order
            };
        }
    });

    if (response.success === 0) {
        return res.status(404).json(response);
    }

    res.json(response);
});

module.exports.filterOrders = asyncHandler(async (req, res) => {
    const { status, paymentStatus, startDate, endDate, sort } = req.query;
    const queryKey = buildSortedQueryKey(req.query);
    const cacheKey = `user:${req.user._id}:orders:filter:${encodeURIComponent(queryKey)}:v1`;
    const response = await getOrSetCacheWithStale({
        key: cacheKey,
        ttlSeconds: USER_ORDER_TTL_SECONDS,
        staleTtlSeconds: USER_ORDER_STALE_TTL_SECONDS,
        compute: async () => {
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

            return {
                success: 1,
                message: 'Orders retrieved',
                count: orders.length,
                orders
            };
        }
    });

    res.json(response);
});

// Cancel Order (User)
module.exports.cancelOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { reason } = req.body;
    const session = await mongoose.startSession();
    let order;

    try {
        await session.withTransaction(async () => {
            order = await Orders.findOne({ _id: orderId, user: req.user._id }).session(session);

            if (!order) {
                throw new Error('ORDER_NOT_FOUND');
            }

            if (order.status !== 'pending') {
                throw new Error(`INVALID_STATUS:${order.status}`);
            }

            order.status = 'cancelled';
            order.cancelledBy = req.user._id;
            order.cancelledByModel = 'User';
            order.cancellationReason = reason || 'Cancelled by user';
            order.statusHistory.push({
                status: 'cancelled',
                updatedBy: req.user._id,
                updatedByModel: 'User',
                notes: reason || 'Cancelled by user',
                timestamp: new Date()
            });
            await order.save({ session });
        });
    } catch (txError) {
        if (txError.message === 'ORDER_NOT_FOUND') {
            return res.status(404).json({
                success: 0,
                message: 'Order not found'
            });
        }
        if (txError.message.startsWith('INVALID_STATUS:')) {
            const status = txError.message.split(':')[1];
            return res.status(400).json({
                success: 0,
                message: `Cannot cancel order with status: ${status}. Only pending orders can be cancelled.`
            });
        }
        throw txError;
    } finally {
        await session.endSession();
    }

    await invalidateAnalyticsForOrder(order);
    await invalidateUserOrderCaches(req.user._id.toString(), order._id.toString());

    // Initiate refund if payment was completed
    if (order.paymentStatus === 'completed' && order.paymentId) {
        try {
            const razorpay = require('../../config/razorpay');
            const refund = await razorpay.payments.refund(order.paymentId, {
                amount: order.totalAmount * 100,
                speed: 'normal'
            });

            const refundSession = await mongoose.startSession();
            try {
                await refundSession.withTransaction(async () => {
                    const refreshedOrder = await Orders.findOne({ _id: order._id, user: req.user._id }).session(refundSession);
                    if (!refreshedOrder) {
                        throw new Error('ORDER_NOT_FOUND_AFTER_REFUND');
                    }
                    refreshedOrder.refundId = refund.id;
                    refreshedOrder.paymentStatus = 'refunded';
                    await refreshedOrder.save({ session: refundSession });
                    order = refreshedOrder;
                });
            } finally {
                await refundSession.endSession();
            }
            await invalidateAnalyticsForOrder(order);
            await invalidateUserOrderCaches(req.user._id.toString(), order._id.toString());
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

    await queueEmail({
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
