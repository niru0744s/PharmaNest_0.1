const User = require("../../modules/User");
const Product = require("../../modules/Products");
const Cart = require("../../modules/CartItems");
const Orders= require("../../modules/orders");
const Address = require("../../modules/Locations");

module.exports.placeOrder = async(req,res)=>{
    try {
        const {finalPrice , cartItemsId} = req.body;
        const cartItems = await Cart.find({ _id: { $in: cartItemsId } }).populate("products");
        const allAddress = await Address.find({userId:req.user._id});
        
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
      address:allAddress[allAddress.length - 1]._id
    });
    await orderDoc.save();
    for (const item of orderProducts) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { quantity: -item.quantity }
      });
    }
    await Cart.deleteMany({ _id: { $in: cartItemsId } });

    const updateOrderStatus = async (status, delay) => {
      setTimeout(async () => {
        await Orders.findByIdAndUpdate(orderDoc._id, { status });
      }, delay);
    };

    // 10-minute intervals (in milliseconds)
    updateOrderStatus("shipped", 10 * 60 * 1000);
    updateOrderStatus("on_the_way", 20 * 60 * 1000);
    updateOrderStatus("delivered", 30 * 60 * 1000);

    res.send({
      success: 1,
      message: "Order Placed Successfully",
    });
    } catch (error) {
        res.send({
            success:0,
            message:error
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


module.exports.addCart = async(req,res)=>{
    try {
    const {id} = req.params;
    let existingCart = await Cart.findOne({ UserId: req.user._id, products: id }).populate("products");
    if (existingCart) {
      existingCart.quantity += 1;
      await existingCart.save();
    } else {
      const newCart = await Cart.create({
        UserId: req.user._id,
        products: id,
        quantity: 1
      });
      existingCart = await Cart.findById(newCart._id).populate("products");
    }
    res.send({
        success:1,
        message:"Product added to the cart",
        existingCart
    });
    } catch (error) {
        res.send({
            success:0,
            message:error
        })
    }
}

module.exports.editCart = async(req,res)=>{
    try {
        const {id} = req.params;
        const {quantity} = req.body;
        await Cart.findByIdAndUpdate(id,{
            quantity:quantity
        });
        res.send({
            success:1,
            message:"Cart Updated"
        });
    } catch (error) {
        res.send({
            success:0,
            message:error
        })
    }
}

module.exports.deleteCart = async(req,res)=>{
    try {
        const {id} = req.params;
        await Cart.findByIdAndDelete(id);
        res.send({
            success:1,
            message:"Product deleted from Cart"
        });
    } catch (error) {
        res.send({
            success:1,
            message:error
        })
    }
};

module.exports.addWishlist = async(req,res)=>{
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

module.exports.removeWishlist = async (req,res)=>{
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

module.exports.showOrders = async(req,res)=>{
    try {
        const allOrders = await Orders.find({user:req.user._id}).populate("products.product address");
        res.send({
            success:1,
            message:"All orders",
            allOrders
        })
    } catch (error) {
        res.send({
            success:0,
            message:error
        })
    }
}

module.exports.showCart = async(req,res)=>{
    try {
        const userCart = await Cart.find({UserId:req.user._id}).populate("products");
        if(!userCart){
            return res.send({
                success:0,
                message:"Your Cart is Empty."
            })
        }
        res.send({
            success:1,
            message:"All carts...",
            userCart
        })
    } catch (error) {
        res.send({
            success:0,
            message:error
        })
    }
}

module.exports.showWishlist = async(req,res)=>{
    try {
        const userWishlist = await User.findById(req.user._id).populate("wishlist");
        if(userWishlist.wishlist.length == 0){
            return res.send({
                success:0,
                message:"Your wish list is empty",
                wishlist:[]
            })
        }
        res.send({
            success:1,
            message:"Your all wishlist",
            wishlist : userWishlist.wishlist
        })
    } catch (error) {
        res.send({
            success:0,
            message:error
        })
    }
}