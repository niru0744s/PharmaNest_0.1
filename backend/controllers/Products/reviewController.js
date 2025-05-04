const Review = require('../../modules/reviews');

const addreview = async (req,res)=>{
    const userId = req.user._id;
    const {comment,rating} = req.body();
    
}