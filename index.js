const express =require("express");
const app =express();
const path =require("path");
const mongoose=require("mongoose")
const listings=require("./models/model.js")
const methodOverride =require("method-override")
const ejsMate =require("ejs-mate")
const wrapAsync =require("./utils/wrapAsync.js")
const ExpressError =require("./utils/expressError.js") 
const review=require("./models/review.js")
const {reviewSchema}=require("./schema.js")

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({extended : true}))
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate)

main().then(()=>{
    console.log("connect successfull")
}).catch((err)=>{
    console.log(err)
})

async function main() {
 await mongoose.connect('mongodb://127.0.0.1:27017/BMSTAY');
}

const validateReview =(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if (error){
        let errmsg =error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errmsg)
    }else{
        next();
    }
};
app.get("/",(req,res)=>{
    res.send("all working good")
})

app.get("/listings",wrapAsync(async(req,res)=>{
    const allListings = await listings.find({})
    res.render("index.ejs",{allListings})
}))

app.get("/listing/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params
    const Listings = await listings.findById(id).populate("reviews")
    res.render("show.ejs",{Listings})
}))

app.get("/listings/new",(req,res)=>{
      res.render("new.ejs")
})

app.post("/listings",wrapAsync(async(req,res,next)=>{
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
   res.redirect("/listings")
}));

app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id} =req.params
    editData = await listings.findById(id);
    res.render("edit.ejs",{editData})
}))

app.put("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params ;
    await listings.findByIdAndUpdate(id,{...req.body})
    res.redirect("/listings")
}))
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params ;
    await listings.findByIdAndDelete(id)
    res.redirect("/listings")
    
}))
app.post("/listings/:id/reviews", validateReview,wrapAsync(async(req,res)=>{
 listing = await listings.findById(req.params.id)
 let newReview =new review(req.body.review);
 listing.reviews.push(newReview);
 await newReview.save();
 await listing.save();
 let {id}=req.params ;
res.redirect(`/listing/${id}`)
})) 

// delete review route
app.delete("/listings/:id/reviews/:reviewid", wrapAsync(async(req,res)=>{
    let {id,reviewid} =req.params;
    await review.findByIdAndDelete(reviewid);
    await listings.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    res.redirect(`/listing/${id}`)
})
)
app.all('/*splat',(req,res,next)=>{
    next( new ExpressError(404,"page not found"));
})



app.use((err,req,res,next)=>{
    let {status=500,message="somting went wrong !"}=err;
    res.status(status).render("error.ejs",{message})
    // res.status(status).send(message)
})

app.listen(8080,()=>{
    console.log("listining at port 8080");
})