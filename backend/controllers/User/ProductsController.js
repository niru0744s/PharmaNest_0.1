const User = require("../../modules/User");
const Product = require("../../modules/Products");
const Cart = require("../../modules/CartItems");
const Orders = require("../../modules/orders");
const Address = require("../../modules/Locations");
const mongoose = require("mongoose");
const { queueEmail } = require("../../utils/emailQueue");
const { getOrSetCacheWithStale } = require("../../utils/cacheStrategy");
const {
  invalidateProductReadCaches,
  invalidateAnalyticsForOrder,
  invalidateUserCartCaches,
  invalidateUserWishlistCaches,
  invalidateUserOrderCaches
} = require("../../utils/cacheInvalidation");

const USER_CART_TTL_SECONDS = 60;
const USER_WISHLIST_TTL_SECONDS = 90;
const USER_ORDERS_TTL_SECONDS = 60;

module.exports.placeOrder = async (req, res) => {
  try {
    const { finalPrice, cartItemsId } = req.body;
    const session = await mongoose.startSession();
    let orderDoc;

    try {
      await session.withTransaction(async () => {
        const cartItems = await Cart.find({
          _id: { $in: cartItemsId },
          UserId: req.user._id
        })
          .select("products quantity")
          .lean()
          .session(session);

        if (!cartItems.length) {
          const error = new Error("No matching cart items found");
          error.statusCode = 400;
          throw error;
        }

        const latestAddress = await Address.findOne({ userId: req.user._id })
          .sort({ createdAt: -1 })
          .select("_id")
          .lean()
          .session(session);

        if (!latestAddress) {
          const error = new Error("No delivery address found");
          error.statusCode = 400;
          throw error;
        }

        const productIds = cartItems.map((item) => item.products);
        const products = await Product.find({ _id: { $in: productIds } })
          .select("_id name quantity")
          .lean()
          .session(session);

        const productMap = new Map(products.map((product) => [product._id.toString(), product]));

        const orderProducts = cartItems.map((item) => {
          const product = productMap.get(item.products.toString());
          if (!product) {
            const error = new Error("One or more products not found");
            error.statusCode = 404;
            throw error;
          }
          if (product.quantity < item.quantity) {
            const error = new Error(`Insufficient stock for ${product.name}`);
            error.statusCode = 409;
            throw error;
          }
          return {
            product: product._id,
            name: product.name,
            quantity: item.quantity
          };
        });

        [orderDoc] = await Orders.create([{
          user: req.user._id,
          products: orderProducts,
          totalAmount: finalPrice,
          address: latestAddress._id
        }], { session });

        const bulkOps = orderProducts.map((item) => ({
          updateOne: {
            filter: { _id: item.product, quantity: { $gte: item.quantity } },
            update: {
              $inc: { quantity: -item.quantity, soldQuantity: item.quantity }
            }
          }
        }));

        const stockUpdateResult = await Product.bulkWrite(bulkOps, { session, ordered: true });
        if (stockUpdateResult.modifiedCount !== orderProducts.length) {
          const error = new Error("Stock update failed due to concurrent updates");
          error.statusCode = 409;
          throw error;
        }

        await Cart.deleteMany({
          _id: { $in: cartItemsId },
          UserId: req.user._id
        }).session(session);
      });
    } finally {
      await session.endSession();
    }

    await invalidateProductReadCaches();
    await invalidateAnalyticsForOrder(orderDoc);
    await invalidateUserCartCaches(req.user._id.toString());
    await invalidateUserOrderCaches(req.user._id.toString(), orderDoc._id.toString());

    await queueEmail({
      to: req.user.email,
      subject: "You order has been placed!",
      html: "<h2>Your order version been placed!</h2><p>Thank you for shopping with PharmaNest.</p>"
    });
    res.send({
      success: 1,
      message: "Order Placed Successfully",
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).send({
      success: 0,
      message: error.message || error
    })
  }
}

module.exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Orders.findOne({
      _id: orderId,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).send({
        success: 0,
        message: "Order not found",
      });
    }

    if (order.status === "delivered") {
      return res.status(400).send({
        success: 0,
        message: "Cannot cancel a delivered order",
      });
    }

    order.status = "cancelled";
    await order.save();
    await invalidateUserOrderCaches(req.user._id.toString(), order._id.toString());

    res.send({
      success: 1,
      message: "Order cancelled successfully",
    });
  } catch (err) {
    res.send({
      success: 0,
      message: err.message,
    });
  }
};


module.exports.addCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity = 1 } = req.body;
    let existingCart = await Cart.findOne({ UserId: req.user._id, products: id }).populate("products");
    if (existingCart) {
      existingCart.quantity += Number(quantity);
      await existingCart.save();
    } else {
      const newCart = await Cart.create({
        UserId: req.user._id,
        products: id,
        quantity: quantity
      });
      existingCart = await Cart.findById(newCart._id).populate("products");
    }
    await invalidateUserCartCaches(req.user._id.toString());
    res.send({
      success: 1,
      message: "Product added to the cart",
      cartItem: existingCart
    });
  } catch (error) {
    res.send({
      success: 0,
      message: error.message || error
    })
  }
}

module.exports.editCart = async (req, res) => {
  try {
    const { id } = req.params; // product id
    const { quantity } = req.body;

    if (quantity <= 0) {
      await Cart.findOneAndDelete({ UserId: req.user._id, products: id });
      await invalidateUserCartCaches(req.user._id.toString());
      return res.send({
        success: 1,
        message: "Item removed from cart"
      });
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { UserId: req.user._id, products: id },
      { quantity: quantity },
      { new: true }
    ).populate("products");
    await invalidateUserCartCaches(req.user._id.toString());

    res.send({
      success: 1,
      message: "Cart Updated",
      cartItem: updatedCart
    });
  } catch (error) {
    res.send({
      success: 0,
      message: error.message || error
    })
  }
}

module.exports.deleteCart = async (req, res) => {
  try {
    const { id } = req.params; // product id
    await Cart.findOneAndDelete({ UserId: req.user._id, products: id });
    await invalidateUserCartCaches(req.user._id.toString());
    res.send({
      success: 1,
      message: "Product deleted from Cart"
    });
  } catch (error) {
    res.send({
      success: 0,
      message: error.message || error
    })
  }
};

module.exports.addWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    const existUser = await User.findById(req.user._id);
    if (!existUser) {
      return res.send({ success: 0, message: "User not found" });
    }
    const product = await Product.findById(id);
    if (!product) {
      return res.send({ success: 0, message: "Product not found" });
    }
    const alreadyInWishlist = existUser.wishlist.some(
      (item) => item._id.toString() === product._id.toString()
    );

    if (alreadyInWishlist) {
      return res.send({
        success: 0,
        message: "Product already in wishlist",
        wishlist: existUser.wishlist,
      });
    }
    existUser.wishlist.push(product);
    await existUser.save();
    await invalidateUserWishlistCaches(req.user._id.toString());

    res.send({
      success: 1,
      message: "Product added to Wishlist",
      wishlist: product,
    });
  } catch (error) {
    res.send({
      success: 0,
      message: error.message || "Server error",
    });
  }
}

module.exports.removeWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.send({ success: 0, message: "User not found" });
    }
    const isInWishlist = user.wishlist.some(
      (item) => item.toString() === id
    );
    if (!isInWishlist) {
      return res.send({
        success: 0,
        message: "Product not found in wishlist",
      });
    }
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { wishlist: id } },
      { new: true }
    ).populate("wishlist");
    await invalidateUserWishlistCaches(req.user._id.toString());

    res.send({
      success: 1,
      message: "Wishlist product removed"
    });
  } catch (error) {
    res.send({
      success: 0,
      message: error.message || "Server error",
    });
  }
}

module.exports.checkout = async (req, res) => {
  try {
    console.log('Checkout request received:', JSON.stringify(req.body, null, 2));

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('ERROR: Razorpay keys are UNDEFINED at runtime in checkout controller');
    } else {
      const kid = process.env.RAZORPAY_KEY_ID.trim();
      const ksec = process.env.RAZORPAY_KEY_SECRET.trim();
      console.log(`Razorpay keys in process.env: ID=${kid.substring(0, 8)}... (Length=${kid.length}), Secret=${ksec.substring(0, 3)}... (Length=${ksec.length})`);
    }

    const { products, addressId, totalAmount } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).send({
        success: 0,
        message: 'Cart is empty'
      });
    }

    if (!addressId || !totalAmount) {
      return res.status(400).send({
        success: 0,
        message: 'Address and total amount are required'
      });
    }

    // Create order in database
    const newOrder = new Orders({
      user: req.user._id,
      products,
      address: addressId,
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending'
    });

    await newOrder.save();

    // Create Razorpay order
    const razorpay = require('../../config/razorpay');
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // Ensure it's an integer
      currency: 'INR',
      receipt: `order_${newOrder._id}`,
      payment_capture: 1 // Auto-capture
    });

    // Update order with Razorpay order ID
    newOrder.razorpayOrderId = razorpayOrder.id;
    await newOrder.save();
    await invalidateAnalyticsForOrder(newOrder);

    // Clear cart after order creation
    await Cart.deleteMany({ UserId: req.user._id });
    await invalidateUserCartCaches(req.user._id.toString());
    await invalidateUserOrderCaches(req.user._id.toString(), newOrder._id.toString());

    res.send({
      success: 1,
      message: 'Order created successfully. Proceed to payment.',
      order: {
        _id: newOrder._id,
        totalAmount: newOrder.totalAmount,
        status: newOrder.status,
        paymentStatus: newOrder.paymentStatus
      },
      razorpayOrder: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID // Send key to frontend
      }
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).send({
      success: 0,
      message: error.message || 'Checkout failed',
      error: error // Send full error object for debugging
    });
  }
}

module.exports.showOrders = async (req, res) => {
  try {
    const cacheKey = `user:${req.user._id}:orders:legacy:v1`;
    const response = await getOrSetCacheWithStale({
      key: cacheKey,
      ttlSeconds: USER_ORDERS_TTL_SECONDS,
      staleTtlSeconds: USER_ORDERS_TTL_SECONDS * 3,
      compute: async () => {
        const allOrders = await Orders.find({ user: req.user._id })
          .populate("products.product", "name price imageUrl")
          .populate("address", "name mobileNum address pincode")
          .lean();
        return {
          success: 1,
          message: "All orders",
          allOrders
        };
      }
    });
    res.send(response);
  } catch (error) {
    res.send({
      success: 0,
      message: error.message || error
    })
  }
}

module.exports.showCart = async (req, res) => {
  try {
    const cacheKey = `user:${req.user._id}:cart:v1`;
    const response = await getOrSetCacheWithStale({
      key: cacheKey,
      ttlSeconds: USER_CART_TTL_SECONDS,
      staleTtlSeconds: USER_CART_TTL_SECONDS * 3,
      compute: async () => {
        const userCart = await Cart.find({ UserId: req.user._id })
          .populate("products", "name price imageUrl brand quantity")
          .lean();
        if (!userCart || userCart.length === 0) {
          return {
            success: 0,
            message: "Your Cart is Empty."
          };
        }
        return {
          success: 1,
          message: "All carts...",
          userCart
        };
      }
    });
    res.send(response);
  } catch (error) {
    res.send({
      success: 0,
      message: error.message || error
    })
  }
}

module.exports.showWishlist = async (req, res) => {
  try {
    const cacheKey = `user:${req.user._id}:wishlist:v1`;
    const response = await getOrSetCacheWithStale({
      key: cacheKey,
      ttlSeconds: USER_WISHLIST_TTL_SECONDS,
      staleTtlSeconds: USER_WISHLIST_TTL_SECONDS * 3,
      compute: async () => {
        const userWishlist = await User.findById(req.user._id)
          .select("wishlist")
          .populate("wishlist", "name price imageUrl brand quantity")
          .lean();
        if (!userWishlist || userWishlist.wishlist.length == 0) {
          return {
            success: 0,
            message: "Your wish list is empty",
            wishlist: []
          };
        }
        return {
          success: 1,
          message: "Your all wishlist",
          wishlist: userWishlist.wishlist
        };
      }
    });
    res.send(response);
  } catch (error) {
    res.send({
      success: 0,
      message: error.message || error
    })
  }
}

module.exports.syncCart = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).send({ success: 0, message: "Items must be an array" });
    }
    const bulkOps = items.map((item) => {
      const product = item.product || item._id;
      return {
        updateOne: {
          filter: { UserId: req.user._id, products: product },
          update: { $set: { quantity: item.quantity } },
          upsert: true
        }
      };
    });
    if (bulkOps.length > 0) {
      await Cart.bulkWrite(bulkOps);
    }
    await invalidateUserCartCaches(req.user._id.toString());
    const updatedCart = await Cart.find({ UserId: req.user._id }).populate("products").lean();
    res.send({ success: 1, message: "Cart synchronized", userCart: updatedCart });
  } catch (error) {
    res.status(500).send({ success: 0, message: error.message || error });
  }
}
