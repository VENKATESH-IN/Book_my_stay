const express =require("express");
const router =express.Router({mergeParams:true});
const user =require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport =require("passport");

router.get("/signup",(req,res)=>{
    res.render("./user/signup.ejs");
})

router.post("/signup",wrapAsync(async(req,res)=>{
    try{
     let{username,email,password}=req.body;
    const newuser =new user({email,username});
    const reguser = await user.register(newuser,password);
    console.log(reguser);
    req.flash("success","welcome to bms");
    res.redirect("/listings");
    } catch(err){
      req.flash("error",err.message);
      res.redirect("/signup");
    }
}));


router.get("/login",(req,res)=>{
    res.render("./user/login.ejs");
});

router.post("/login", 
    passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),
    async(req,res)=>{
    let {username}=req.body;
    req.flash("success",`welcome back ${username}`);
    res.redirect("/listings")
});

module.exports =router