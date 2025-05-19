const Product = require("../../modules/Products");

module.exports.fetchData = async(req,res)=>{
    try {
        const categoryWise = await Product.aggregate([
            {
              $group: {
                _id: "$category",
                products: {
                  $push: {
                    _id:        "$_id",
                    name:       "$name",
                    brand:      "$brand",
                    form:       "$form",
                    strength:   "$strength",
                    price:      "$price",
                    imageUrl:   "$imageUrl",
                    description:"$description",
                    quantity:   "$quantity",
                    mainPrice:  "$mainPrice"
                  }
                }
              }
            },
            {
              $project: {
                _id:      0,
                category: "$_id",
                products: 1
              }
            }
          ]);
          res.send({
            success:1,
            message:"Product data fetched..!",
            categoryWise
          })
    } catch (error) {
        res.send({
            success:0,
            message:error
        });
    }
}

module.exports.addProduct = async(req,res)=>{
    try {
        const url = req.file.path;
        const filename = req.file.filename;
        const {name , brand , form , strength , category , price ,mainPrice, description , quantity} = req.body;
        const initProducts = new Product({
            name,brand , form , strength , category,mainPrice, price , description , quantity , hostId : req.user._id
        });
        initProducts.imageUrl = {url , filename};
        await initProducts.save();
        res.send({
            success:1,
            message:"Product added successfully ",
            initProducts
        })
    } catch (error) {
        res.send({
            success:0,
            message:error
        })
    }
}

module.exports.updateproduct = async(req,res)=>{
    try {
        const {id} = req.query;
        const {name , brand , form , strength , category ,mainPrice ,  price , description , quantity} = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(id,{
            name , 
            brand,
            form,
            strength,
            category,
            price, 
            mainPrice,
            description ,
            quantity
        }) ;
        if(typeof req.file !== "undefined"){
            const url = req.file.path;
            const filename = req.file.filename;
            updatedProduct.imageUrl = {url , filename};
            await updatedProduct.save();
        }
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

module.exports.deleteProduct = async (req,res)=>{
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