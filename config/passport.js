const LocalStrategy=require("passport-local").Strategy;
const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const passport=require("passport");
const login=require("../model/loginSchema");

module.exports=function(passport){
    passport.use("local-login",
    new LocalStrategy({
        usernameField : 'Email',//usernamefield is default
        passwordField : 'Password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },(req,Email,Password,done)=>{
        login.find({"local.Email":Email},function(err,user){
            if (err) { console.log(err);
                 return done(err); }
           else if (!user) { console.log(Email);
           return done(null, false); }
           else{  console.log(user); return done(null, user);}
        })
      /*  .then(user=>{
            if(!user){
                console.log("No user");
                return done(null,false,{message:"email is not registred"})
            }
            else{
                console.log("A user");
                return done(null,user)
            }
        })
        .catch(err=>console.log(err));*/
    }
    )
)
passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
}
