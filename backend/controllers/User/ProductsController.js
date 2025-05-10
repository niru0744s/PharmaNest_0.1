const User = require("../../modules/User");
const Product = require("../../modules/Products");
const Cart = require("../../modules/CartItems");
const Orders= require("../../modules/orders");

module.exports.purchaseProduct = async(req,res)=>{
    try {
        const {cartId} = req.body;
        const existCart = await Cart.findByIdAndDelete(cartId);
        const addOrder = new Orders({
            user:req.user._id,
            product:existCart
        });
        await addOrder.save();
        res.send({
            success:1,
            message:"Order Placed Successfully"
        });
    } catch (error) {
        res.send({
            success:0,
            message:error
        })
    }
}

module.exports.cancelOrder = async(req,res)=>{
    try {
        const {orderId} = req.params;
        await Orders.findByIdAndDelete(orderId);
        res.send({
            success:1,
            message:"Order Cancelled!"
        })
    } catch (error) {
        res.send({
            success:0,
            message:error
        })
    }
};

module.exports.addCart = async(req,res)=>{
    try {
    const {productId} = req.body;
    const {userId} = req.query;
    const existingCart = await Cart.findOne({ UserId: userId, products: productId });
    if (existingCart) {
      existingCart.quantity += 1;
      await existingCart.save();
    } else {
      await Cart.create({
        UserId: userId,
        products: productId,
        quantity: 1
      });
    }
    res.send({
        success:1,
        message:"Product added to the cart"
    });
    } catch (error) {
        res.send({
            success:1,
            message:error
        })
    }
}

module.exports.editCart = async(req,res)=>{
    try {
        const {cartId} = req.query;
        const {quantity} = req.body;
        await findByIdAndUpdate(cartId,{
            quantity:quantity
        });
        res.send({
            success:1,
            message:"Cart Updated"
        });
    } catch (error) {
        res.send({
            success:1,
            message:error
        })
    }
}

module.exports.deleteCart = async(req,res)=>{
    try {
        const {cartId} = req.query;
        await Cart.findByIdAndDelete(cartId);
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
        const {userId} = req.user._id;
        const {productId} = req.body;
        const existUser = await User.findById(userId);
        const product = await Product.findById(productId);
        existUser.wishlist.push(product);
        await existUser.save()
        res.send({
            success:1,
            message:"Product added to Wishlist"
        })
    } catch (error) {
        res.send({
            success:0,
            message:error
        })
    }
}

module.exports.removeWishlist = async (req,res)=>{
    try {
        const {id , productId} = req.params;
        await  User.findByIdAndUpdate(id,{$pull:{wishlist:productId}});
        res.send({
            success:1,
            message:"Wishlist Removed"
        })
    } catch (error) {
        res.send({
            success:0,
            message:error
        })
    }
}

module.exports.showOrders = async(req,res)=>{
    try {
        const allOrders = await Orders.find({user:req.user._id}).populate("product");
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
                message:"Your wish list is empty"
            })
        }
        res.send({
            success:1,
            message:"Your all wishlist",
            userWishlist
        })
    } catch (error) {
        res.send({
            success:0,
            message:error
        })
    }
}