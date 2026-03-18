const express =require("express");
const app =express();
const path =require("path");
const mongoose=require("mongoose")
const methodOverride =require("method-override")
const ejsMate =require("ejs-mate")
const ExpressError =require("./utils/expressError.js") ;
const listingsr =require("./routes/listing.js");
const reviews =require("./routes/review.js");
const session =require("express-session");
const flash =require("connect-flash");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({extended : true}))
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate)

const sessionOption ={
    secret :"enjoypandagooooo",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 7*24*60*60*1000,
        maxAge :7*24*60*60*1000,
        httpOnly:true,
    }
};

app.get("/",(req,res)=>{
    res.send("all working good")
});

app.use(session(sessionOption));
app.use(flash());

main().then(()=>{
    console.log("connect successfull")
}).catch((err)=>{
    console.log(err)
})

async function main() {
 await mongoose.connect('mongodb://127.0.0.1:27017/BMSTAY');
}

app.use((req,res,next)=>{
    res.locals.success =req.flash("success");
    res.locals.error =req.flash("error");
    next();
});

app.use("/listings",listingsr);
app.use("/listing",listingsr);

app.use("/listings/:id/reviews",reviews);

app.all('/*splat',(req,res,next)=>{
    next( new ExpressError(404,"page not found"));
});
app.use((err,req,res,next)=>{
    let {status=500,message="somting went wrong !"}=err;
    res.status(status).render("error.ejs",{message})
    // res.status(status).send(message)
});

app.listen(8080,()=>{
    console.log("listining at port 8080");
});