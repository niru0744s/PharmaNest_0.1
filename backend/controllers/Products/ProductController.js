const Product = require("../../modules/Products");

const addProduct = async(req,res)=>{
    try {
        const {name , brand , form , strength , category , price , description , image , quantity} = req.body;
        const initProducts = new Product({
            name,brand , form , strength , category , price , description , image , quantity , hostId : req.user._id
        });
        await initProducts.save();
        res.send({
            success:1,
            message:"Product added successfully "
        })
    } catch (error) {
        res.send({
            success:0,
            message:error
        })
    }
}

const updateproduct = async(req,res)=>{
    try {
        const {id} = req.query;
        const {name , brand , form , strength , category , price , description , image , quantity} = req.body;
        await Product.findByIdAndUpdate(id,{
            name , 
            brand,
            form,
            strength,
            category,
            price, 
            description ,
            image,
            quantity
        }) ;
        res.send({
            success:1,
            message:"product has been updated successfully "
        })
    } catch (error) {
        res.send({
            success:0,
            message:error
        })
    }
}

const deleteProduct = async (req,res)=>{
    try {
        const {id} = req.query;
        await Product.findByIdAndDelete(id);
        res.send({
            success:1,
            message:"Deleted Successfully"
        });
    } catch (error) {
        res.send({
            success:0,
            message:error
        })
    }
}