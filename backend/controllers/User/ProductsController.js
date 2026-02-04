const User = require("../../modules/User");
const Product = require("../../modules/Products");
const Cart = require("../../modules/CartItems");
const Orders = require("../../modules/orders");
const Address = require("../../modules/Locations");
const { sendUserEmail } = require("./SendEmail");

module.exports.placeOrder = async (req, res) => {
  try {
    const { finalPrice, cartItemsId } = req.body;
    const cartItems = await Cart.find({ _id: { $in: cartItemsId } }).populate("products");
    const allAddress = await Address.find({ userId: req.user._id });

    if (!cartItems.length) {
      return res.status(400).json({ success: 0, message: "No matching cart items found" });
    }
    const orderProducts = cartItems.map(item => ({
      product: item.products._id,
      name: item.products.name,
      quantity: item.quantity,
    }));
    const orderDoc = new Orders({
      user: req.user._id,
      products: orderProducts,
      totalAmount: finalPrice,
      address: allAddress[allAddress.length - 1]._id
    });
    await orderDoc.save();
    for (const item of orderProducts) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { quantity: -item.quantity, soldQuantity: item.quantity }
      });
    }
    await Cart.deleteMany({ _id: { $in: cartItemsId } });

    await sendUserEmail(req.user.email, "You order has been placed!");
    res.send({
      success: 1,
      message: "Order Placed Successfully",
    });
  } catch (error) {
    res.send({
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

    // Clear cart after order creation
    await Cart.deleteMany({ UserId: req.user._id });

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
    const allOrders = await Orders.find({ user: req.user._id })
      .populate("products.product", "name price imageUrl")
      .populate("address", "name mobileNum address pincode")
      .lean();
    res.send({
      success: 1,
      message: "All orders",
      allOrders
    })
  } catch (error) {
    res.send({
      success: 0,
      message: error.message || error
    })
  }
}

module.exports.showCart = async (req, res) => {
  try {
    const userCart = await Cart.find({ UserId: req.user._id })
      .populate("products", "name price imageUrl brand quantity")
      .lean();
    if (!userCart || userCart.length === 0) {
      return res.send({
        success: 0,
        message: "Your Cart is Empty."
      })
    }
    res.send({
      success: 1,
      message: "All carts...",
      userCart
    })
  } catch (error) {
    res.send({
      success: 0,
      message: error.message || error
    })
  }
}

module.exports.showWishlist = async (req, res) => {
  try {
    const userWishlist = await User.findById(req.user._id)
      .select("wishlist")
      .populate("wishlist", "name price imageUrl brand quantity")
      .lean();
    if (!userWishlist || userWishlist.wishlist.length == 0) {
      return res.send({
        success: 0,
        message: "Your wish list is empty",
        wishlist: []
      })
    }
    res.send({
      success: 1,
      message: "Your all wishlist",
      wishlist: userWishlist.wishlist
    })
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
    for (const item of items) {
      const product = item.product || item._id;
      await Cart.findOneAndUpdate(
        { UserId: req.user._id, products: product },
        { quantity: item.quantity },
        { upsert: true }
      );
    }
    const updatedCart = await Cart.find({ UserId: req.user._id }).populate("products").lean();
    res.send({ success: 1, message: "Cart synchronized", userCart: updatedCart });
  } catch (error) {
    res.status(500).send({ success: 0, message: error.message || error });
  }
}