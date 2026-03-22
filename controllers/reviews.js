const review=require("../models/review.js"); 
const listings=require("../models/model.js");


module.exports.createReview=async(req,res)=>{
 let listing = await listings.findById(req.params.id)
 let newReview =new review(req.body.review);
 newReview .author =req.user._id
 listing.reviews.push(newReview);
 await newReview.save();
 await listing.save();
 let {id}=req.params ;
 req.flash("success","new review created");
res.redirect(`/listing/${id}`)
}

module.exports.deleteReview=async(req,res)=>{
    let {id,reviewid} =req.params;
    await review.findByIdAndDelete(reviewid);
    await listings.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    req.flash("success","review deleted");
    res.redirect(`/listing/${id}`)
}