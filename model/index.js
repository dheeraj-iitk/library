const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/libraryLogin",{ useNewUrlParser: true },function(error){
    if(!error){
        console.log("connected to database"); 
    }
    else{
        console.log("error connecting to database");
        
    }
});
const Course=require("./loginSchema");



mongoose.connect("mongodb://localhost:27017/book",{ useNewUrlParser: true },function(error){
    if(!error){
        console.log("connected to database book"); 
    }
    else{
        console.log("error connecting to database2");
    }
});
const Course2=require("./bookSchema");