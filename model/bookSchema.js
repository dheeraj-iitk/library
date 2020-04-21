
var mongoose=require("mongoose");
var bookSchema=new mongoose.Schema({
    Book_Name:{
        type:String,
        required:"Required"
    },
    img: { data: Buffer, contentType: String },
    Book_Publisher:{
        type:String,
        required:"Required"
    }
});
mongoose.model("bookLogin",bookSchema);