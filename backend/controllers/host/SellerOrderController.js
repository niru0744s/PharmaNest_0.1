const Orders = require('../../modules/orders');
const Products = require('../../modules/Products');
const { sendUserEmail } = require('../User/SendEmail');

// Get Seller's Orders
module.exports.getSellerOrders = async (req, res) => {
    try {
        const { status, paymentStatus, page = 1, limit = 20 } = req.query;

        // Find all products by this seller
        const sellerProducts = await Products.find({ hostId: req.user._id }).select('_id');
        const productIds = sellerProducts.map(p => p._id);

        const filter = { 'products.product': { $in: productIds } };

        if (status) filter.status = status;
        if (paymentStatus) filter.paymentStatus = paymentStatus;

        const skip = (page - 1) * limit;

        const [orders, total] = await Promise.all([
            Orders.find(filter)
                .populate('user', 'firstName lastName email phoneNumber')
                .populate('products.product', 'name price imageUrl')
                .populate('address', 'name mobileNum address pincode')
                .sort('-createdAt')
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            Orders.countDocuments(filter)
        ]);

        // Get order statistics
        const stats = await Orders.aggregate([
            { $match: { 'products.product': { $in: productIds } } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const statsObj = {
            total,
            pending: 0,
            shipped: 0,
            on_the_way: 0,
            delivered: 0,
            cancelled: 0
        };

        stats.forEach(s => {
            statsObj[s._id] = s.count;
        });

        res.send({
            success: 1,
            message: 'Seller orders retrieved',
            orders,
            stats: statsObj,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error('Get seller orders error:', error);
        res.status(500).send({
            success: 0,
            message: error.message || 'Failed to retrieve orders'
        });
    }
};

// Get Order Details (Seller)
module.exports.getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Find seller's products
        const sellerProducts = await Products.find({ hostId: req.user._id }).select('_id');
        const productIds = sellerProducts.map(p => p._id.toString());

        const order = await Orders.findById(orderId)
            .populate('user', 'firstName lastName email phoneNumber')
            .populate('products.product', 'name price imageUrl')
            .populate('address')
            .populate('statusHistory.updatedBy', 'firstName lastName')
            .lean();

        if (!order) {
            return res.status(404).send({
                success: 0,
                message: 'Order not found'
            });
        }

        // Verify seller owns at least one product in order
        const hasProduct = order.products.some(p =>
            productIds.includes(p.product._id.toString())
        );

        if (!hasProduct) {
            return res.status(403).send({
                success: 0,
                message: 'Not authorized to view this order'
            });
        }

        res.send({
            success: 1,
            message: 'Order details retrieved',
            order
        });
    } catch (error) {
        console.error('Get order details error:', error);
        res.status(500).send({
            success: 0,
            message: error.message || 'Failed to retrieve order details'
        });
    }
};

// Update Order Status (Seller)
module.exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, notes, trackingNumber } = req.body;

        if (!status) {
            return res.status(400).send({
                success: 0,
                message: 'Status is required'
            });
        }

        const validStatuses = ['shipped', 'on_the_way', 'delivered'];
        if (!validStatuses.includes(status)) {
            return res.status(400).send({
                success: 0,
                message: 'Invalid status. Allowed: shipped, on_the_way, delivered'
            });
        }

        // Find seller's products
        const sellerProducts = await Products.find({ hostId: req.user._id }).select('_id');
        const productIds = sellerProducts.map(p => p._id.toString());

        const order = await Orders.findById(orderId).populate('user', 'email firstName');

        if (!order) {
            return res.status(404).send({
                success: 0,
                message: 'Order not found'
            });
        }

        // Verify seller owns at least one product
        const hasProduct = order.products.some(p =>
            productIds.includes(p.product.toString())
        );

        if (!hasProduct) {
            return res.status(403).send({
                success: 0,
                message: 'Not authorized to update this order'
            });
        }

        // Validate status transition
        const statusOrder = ['pending', 'shipped', 'on_the_way', 'delivered'];
        const currentIndex = statusOrder.indexOf(order.status);
        const newIndex = statusOrder.indexOf(status);

        if (newIndex <= currentIndex && order.status !== 'pending') {
            return res.status(400).send({
                success: 0,
                message: `Cannot move from ${order.status} to ${status}`
            });
        }

        if (order.status === 'cancelled' || order.status === 'delivered') {
            return res.status(400).send({
                success: 0,
                message: `Cannot update ${order.status} order`
            });
        }

        // Update order
        order.status = status;
        if (trackingNumber) order.trackingNumber = trackingNumber;

        // Add to status history
        order.statusHistory.push({
            status,
            updatedBy: req.user._id,
            updatedByModel: 'Host',
            notes: notes || `Order ${status}`,
            timestamp: new Date()
        });

        await order.save();

        // Send email notification
        let emailSubject = '';
        let emailBody = '';

        if (status === 'shipped') {
            emailSubject = 'Your Order Has Been Shipped! 📦';
            emailBody = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4CAF50;">Your Order Has Been Shipped! 📦</h2>
                    <p>Dear ${order.user.firstName},</p>
                    <p>Great news! Your order <strong>#${order._id}</strong> has been shipped.</p>
                    ${trackingNumber ? `<p><strong>Tracking Number:</strong> ${trackingNumber}</p>` : ''}
                    ${notes ? `<p><strong>Note:</strong> ${notes}</p>` : ''}
                    <p>Expected delivery: 3-5 business days</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">Thank you for shopping with PharmaNest!</p>
                </div>
            `;
        } else if (status === 'on_the_way') {
            emailSubject = 'Your Order is On the Way! 🚚';
            emailBody = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4CAF50;">Your Order is On the Way! 🚚</h2>
                    <p>Dear ${order.user.firstName},</p>
                    <p>Your order <strong>#${order._id}</strong> is currently out for delivery.</p>
                    ${trackingNumber ? `<p><strong>Tracking Number:</strong> ${trackingNumber}</p>` : ''}
                    <p>You should receive it shortly!</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">Thank you for shopping with PharmaNest!</p>
                </div>
            `;
        } else if (status === 'delivered') {
            emailSubject = 'Your Order Has Been Delivered! ✅';
            emailBody = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4CAF50;">Your Order Has Been Delivered! ✅</h2>
                    <p>Dear ${order.user.firstName},</p>
                    <p>Your order <strong>#${order._id}</strong> has been successfully delivered.</p>
                    <p>We hope you enjoy your purchase!</p>
                    <p style="margin-top: 20px;">Please take a moment to rate your experience.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">Thank you for shopping with PharmaNest!</p>
                </div>
            `;
        }

        if (order.user) {
            await sendUserEmail(order.user.email, emailSubject, emailBody);
        } else {
            console.log(`Order ${status}: User notification skipped (account deleted)`);
        }

        res.send({
            success: 1,
            message: `Order status updated to ${status}`,
            order: {
                _id: order._id,
                status: order.status,
                trackingNumber: order.trackingNumber
            }
        });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).send({
            success: 0,
            message: error.message || 'Failed to update order status'
        });
    }
};

// Cancel Order (Seller)
module.exports.cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { reason } = req.body;

        // Find seller's products
        const sellerProducts = await Products.find({ hostId: req.user._id }).select('_id');
        const productIds = sellerProducts.map(p => p._id.toString());

        const order = await Orders.findById(orderId).populate('user', 'email firstName');

        if (!order) {
            return res.status(404).send({
                success: 0,
                message: 'Order not found'
            });
        }

        // Verify seller owns at least one product
        const hasProduct = order.products.some(p =>
            productIds.includes(p.product.toString())
        );

        if (!hasProduct) {
            return res.status(403).send({
                success: 0,
                message: 'Not authorized to cancel this order'
            });
        }

        if (order.status === 'cancelled') {
            return res.send({
                success: 0,
                message: 'Order already cancelled'
            });
        }

        if (order.status === 'delivered') {
            return res.status(400).send({
                success: 0,
                message: 'Cannot cancel delivered order'
            });
        }

        // Update order
        order.status = 'cancelled';
        order.cancelledBy = req.user._id;
        order.cancelledByModel = 'Host';
        order.cancellationReason = reason || 'Cancelled by seller';

        // Add to status history
        order.statusHistory.push({
            status: 'cancelled',
            updatedBy: req.user._id,
            updatedByModel: 'Host',
            notes: reason || 'Cancelled by seller',
            timestamp: new Date()
        });

        await order.save();

        // Initiate refund if payment completed
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
            }
        }

        // Send cancellation email
        const cancellationEmail = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #f44336;">Order Cancelled by Seller</h2>
                <p>Dear ${order.user.firstName},</p>
                <p>We regret to inform you that your order <strong>#${order._id}</strong> has been cancelled by the seller.</p>
                <p><strong>Reason:</strong> ${order.cancellationReason}</p>
                ${order.paymentStatus === 'refunded' ? '<p><strong>Refund:</strong> ₹' + order.totalAmount + ' will be credited to your account in 5-7 business days.</p>' : ''}
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="color: #666; font-size: 12px;">We apologize for the inconvenience.</p>
            </div>
        `;

        await sendUserEmail(order.user.email, 'Order Cancelled - PharmaNest', cancellationEmail);

        res.send({
            success: 1,
            message: 'Order cancelled successfully',
            order: {
                _id: order._id,
                status: order.status,
                paymentStatus: order.paymentStatus
            }
        });
    } catch (error) {
        console.error('Cancel order error:', error);
        res.status(500).send({
            success: 0,
            message: error.message || 'Failed to cancel order'
        });
    }
};
