const express =require("express");
const router =express.Router();
const wrapAsync =require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner} =require("../middleware.js");
const listingController =require("../controllers/listings.js")

const multer =require("multer")
const upload=multer({dest:"uploads/"})
// new route 
router.get("/new", isLoggedIn,listingController.newform);

router.route("/")
.get(wrapAsync(listingController.index))
// .post(isLoggedIn,wrapAsync(listingController.createnewlisting));
.post(upload.single('listing[image]'),(req,res)=>{
    res.send(req.file)
}
)
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,wrapAsync(listingController.editListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.deletelisting));



//edit route to open edit page
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(listingController.editformrender));


module.exports = router ;