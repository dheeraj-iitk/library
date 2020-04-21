var mongoose=require("mongoose");

var loginSchema=new mongoose.Schema({
    Email:{
        type:String,
        required:"Required"
    },
   
    Password: String
});

module.exports=mongoose.model("login",loginSchema);





