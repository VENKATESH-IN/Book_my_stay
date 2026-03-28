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
    };
    if(!req.file){
        throw new ExpressError(400,"please upload listing--image")
    }
    let url=req.file.path;
    let filename =req.file.filename;
    console.log(req.body);
    const {title,description,price,location,country,catagory } =req.body
    let newData={
        title,description,image:{filename,url},price,location,country,catagory
    };
    console.log(newData);
   newData.owner=req.user._id;
   await listings.insertOne(newData);
   req.flash("success","sucessfully created new listing");
   res.redirect("/listings")
}

module.exports.editformrender=async(req,res)=>{
    let {id} =req.params
    editData = await listings.findById(id);
    let originalimageurl =editData.image.url;
    originalimageurl = originalimageurl.replace("/upload","/upload/h_300,w_400");
    res.render("edit.ejs",{editData,originalimageurl})
}

module.exports.editListing=async(req,res)=>{
    let {id}=req.params ;
    console.log(req.body)
    let listing =await listings.findByIdAndUpdate(id,{...req.body});
    console.log(listing);
    if(typeof req.file !=="undefined"){  
    let url=req.file.path;
    let filename =req.file.filename;
    listing.image={filename,url};
    await listing.save();
    }else{
        await listing.save();
    }
    req.flash("success","listing edited sucessfully");
    res.redirect("/listings");
}

module.exports.deletelisting=async(req,res)=>{
    let {id}=req.params ;
    await listings.findByIdAndDelete(id);
    req.flash("success","sucessfully deleted a listing");
    res.redirect("/listings")
    
};

module.exports.listingsFilter=async(req,res)=>{
    filter=req.params.id;
    const alllistings = await listings.find({catagory:filter});
    res.render("filters.ejs",{alllistings});
}