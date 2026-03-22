const listings=require("../models/model.js");
const ExpressError =require("../utils/expressError.js");


module.exports.index=async(req,res)=>{
    const allListings = await listings.find({})
    res.render("index.ejs",{allListings})
}

module.exports.newform=(req,res)=>{
    res.render("new.ejs");
}

module.exports.showListing=async(req,res)=>{
    let {id}=req.params
    const Listings = await listings.findById(id)
    .populate({path:"reviews",populate:{path:"author"},})
    .populate("owner");
    if(!Listings){
        req.flash("error","listing does not exist");
        res.redirect("/listings");
    }else{
    res.render("show.ejs",{Listings})
    }
}

module.exports.createnewlisting=async(req,res,next)=>{
    if(!req.body){
        throw new ExpressError(400,"enter the valid data")
    }
    let newData=({title,description,image,price,location,country } =req.body)
   let imgurl =newData.image
   if(imgurl ===""){
    imgurl ="https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
   }
   newData.image ={
    filename: "listingimage",
    url: imgurl
   }
   newData.owner=req.user._id;
   await listings.insertOne(newData);
   req.flash("success","sucessfully created new listing");
   res.redirect("/listings")
}

module.exports.editformrender=async(req,res)=>{
    let {id} =req.params
    editData = await listings.findById(id);
    res.render("edit.ejs",{editData})
}

module.exports.editListing=async(req,res)=>{
    let {id}=req.params ;
    await listings.findByIdAndUpdate(id,{...req.body});
    req.flash("success","listing edited sucessfully");
    res.redirect("/listings")
}

module.exports.deletelisting=async(req,res)=>{
    let {id}=req.params ;
    await listings.findByIdAndDelete(id);
    req.flash("success","sucessfully deleted a listing");
    res.redirect("/listings")
    
}