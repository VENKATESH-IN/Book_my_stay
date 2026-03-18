const express =require("express");
const router =express.Router({mergeParams:true});
const {reviewSchema}=require("../schema.js");
const wrapAsync =require("../utils/wrapAsync.js");
const ExpressError =require("../utils/expressError.js");
const review=require("../models/review.js"); 
const listings=require("../models/model.js");

const validateReview =(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if (error){
        let errmsg =error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errmsg)
    }else{
        next();
    }
};

//review route
router.post("/", validateReview,wrapAsync(async(req,res)=>{
 let listing = await listings.findById(req.params.id)
 let newReview =new review(req.body.review);

 listing.reviews.push(newReview);

 await newReview.save();
 await listing.save();
 let {id}=req.params ;
 req.flash("success","new review created");
res.redirect(`/listing/${id}`)
})) 

// delete review route
router.delete("/:reviewid", wrapAsync(async(req,res)=>{
    let {id,reviewid} =req.params;
    await review.findByIdAndDelete(reviewid);
    await listings.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    req.flash("success","review deleted");
    res.redirect(`/listing/${id}`)
})
)

module.exports = router