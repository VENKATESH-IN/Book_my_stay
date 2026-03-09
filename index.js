const express =require("express");
const app =express();
const path =require("path");
const mongoose=require("mongoose")
const listings=require("./models/model.js")
const methodOverride =require("method-override")
const ejsMate =require("ejs-mate")

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

app.get("/",(req,res)=>{
    res.send("all working good")
})

app.get("/listings",async(req,res)=>{
    const allListings = await listings.find({})
    res.render("index.ejs",{allListings})
})

app.get("/listing/:id",async(req,res)=>{
    let {id}=req.params
    const Listings = await listings.findById(id)
    res.render("show.ejs",{Listings})
})

app.get("/listings/new",(req,res)=>{
      res.render("new.ejs")
})

app.post("/listings",(req,res)=>{
   let newData=({title,description,image,price,location,country } =req.body)
   imgurl =newData.image
   if(imgurl ===""){
    imgurl ="https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
   }
   newData.image ={
    filename: "listingimage",
    url: imgurl
   }
   listings.insertOne(newData)
   res.redirect("/listings")
})

app.get("/listings/:id/edit",async(req,res)=>{
    let {id} =req.params
    editData = await listings.findById(id);
    res.render("edit.ejs",{editData})
})

app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params ;
    await listings.findByIdAndUpdate(id,{...req.body})
    res.redirect("/listings")
})
app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params ;
    await listings.findByIdAndDelete(id)
    res.redirect("/listings")
    
})
app.listen(8080,()=>{
    console.log("listining at port 8080");
})