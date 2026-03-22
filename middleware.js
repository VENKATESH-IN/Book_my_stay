const listing =require("./models/model.js");
const review =require("./models/review.js");
const ExpressError =require("./utils/expressError.js");
const {reviewSchema}=require("./schema.js");



module.exports.isLoggedIn =(req,res,next)=>{
if(!req.isAuthenticated()){
       //redirect url
       req.session.redirectUrl=req.originalUrl;
       console.log(req.session.redirectUrl)
        req.flash("error","you must login");
        return res.redirect("/login");
    };
    next();
};

module.exports.saveRedirectUrl =(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl =req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner= async(req,res,next)=>{
    let {id}=req.params ;
    let listings =await listing.findById(id);
    if(!listings.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you dont have permision to do");
        return res.redirect(`/listings/${id}`)
    }
    next();
}

module.exports.validateReview =(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if (error){
        let errmsg =error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errmsg)
    }else{
        next();
    }
};

module.exports.isOwnerAuthor= async(req,res,next)=>{
    let {id,reviewid}=req.params ;
    let reviews =await review.findById(reviewid);
    
    if(!reviews.author.equals(res.locals.currUser._id)){
        req.flash("error","you dont have permision to do");
        return res.redirect(`/listings/${id}`)
    }
    next();
}



