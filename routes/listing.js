const express =require("express");
const router =express.Router();
const wrapAsync =require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner} =require("../middleware.js");
const listingController =require("../controllers/listings.js")
const {storage}=require("../cloudConfig.js");
const multer =require("multer");
const upload=multer({storage});
// new route 
router.get("/new", isLoggedIn,listingController.newform);

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,
    upload.single('listing[image]'),
    wrapAsync(listingController.createnewlisting)
);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    wrapAsync(listingController.editListing))

.delete(isLoggedIn,isOwner,wrapAsync(listingController.deletelisting));

//edit route to open edit page
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(listingController.editformrender));


module.exports = router ;