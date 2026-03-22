const express =require("express");
const router =express.Router({mergeParams:true});
const wrapAsync =require("../utils/wrapAsync.js");

const {validateReview,isLoggedIn,isOwnerAuthor} =require("../middleware.js")
const reviewController =require("../controllers/reviews.js")

//review route
router.post("/", validateReview,isLoggedIn,wrapAsync(reviewController.createReview)) 

// delete review route
router.delete("/:reviewid", isLoggedIn, isOwnerAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router