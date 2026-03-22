const user =require("../models/user.js");

module.exports.renderSignUpfrom=(req,res)=>{
    res.render("./user/signup.ejs");
}


module.exports.signUp=async(req,res)=>{
    try{
     let{username,email,password}=req.body;
    const newuser =new user({email,username});
    const reguser = await user.register(newuser,password);
    req.login(reguser,(err)=>{
        if(err){
        return next(err);
        }
      req.flash("success",`welcome  ${username}`);
      res.redirect("/listings")
    })
    } catch(err){
      req.flash("error",err.message);
      res.redirect("/signup");
    }
}

module.exports.renderLoginform=(req,res)=>{
    res.render("./user/login.ejs");
}

module.exports.login=async(req,res)=>{
    let {username}=req.body;
    req.flash("success",`welcome back ${username}`);
    let redirectUrl =res.locals.redirectUrl ||"listings";
    res.redirect(redirectUrl);

}

module.exports.logOut=(req,res)=>{
    req.logout((err)=>{
        if(err){
        return next(err);
        }
        req.flash("success","your are logged out !");
        res.redirect("/listings");
    })
}