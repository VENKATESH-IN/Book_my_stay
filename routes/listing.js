const express =require("express");
const router =express.Router();
const wrapAsync =require("../utils/wrapAsync.js")
const listings=require("../models/model.js");
const ExpressError =require("../utils/expressError.js");

//index route
router.get("/",wrapAsync(async(req,res)=>{
    const allListings = await listings.find({})
    res.render("index.ejs",{allListings})
}));

// new route 
router.get("/new",(req,res)=>{
      res.render("new.ejs")
});

//show route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params
    const Listings = await listings.findById(id).populate("reviews");
    if(!Listings){
        req.flash("error","listing does not exist");
        res.redirect("/listings");
    }else{
    res.render("show.ejs",{Listings})
    }
}));

//create new listing route
router.post("/",wrapAsync(async(req,res,next)=>{
    if(req.body === "undefined"){
        throw new ExpressError(400,"enter the valid data")
    }
    let newData=({title,description,image,price,location,country } =req.body)
   imgurl =newData.image
   if(imgurl ===""){
    imgurl ="https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
   }
   newData.image ={
    filename: "listingimage",
    url: imgurl
   }
    await listings.insertOne(newData)
   req.flash("success","sucessfully created new listing");
   res.redirect("/listings")
}));


//edit route to open edit page
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id} =req.params
    editData = await listings.findById(id);
    res.render("edit.ejs",{editData})
}));
//edit route to edit content
router.put("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params ;
    await listings.findByIdAndUpdate(id,{...req.body});
    req.flash("success","listing edited sucessfully");
    res.redirect("/listings")
}));
//delete listing route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params ;
    await listings.findByIdAndDelete(id);
    req.flash("success","sucessfully deleted a listing");
    res.redirect("/listings")
    
}));

module.exports = router ;