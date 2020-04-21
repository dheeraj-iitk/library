const model=require("./model");
var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var path=require("path");
app.use(bodyParser.json());
const bcrypt=require("bcrypt");
var fs = require('fs');
const multer = require('multer');
const upload = multer({dest: __dirname + '/uploads/images'}); //for saving it my pc
const passport=require("passport");
var mongoose =require("mongoose");
app.use(bodyParser.urlencoded({extended:true}));
const session=require("express-session");

var verify_password;

app.set("view engine","jade");//set view engine
app.set('views',path.join(__dirname+"/views/layout"));

require("./config/passport")(passport);
app.use(session({
    secret:"secret",
    resave:true,
    saveUninitialized:true
}));
app.use(passport.initialize());
app.use(passport.session());

/*function auth (req, res, next) {
    console.log(req.headers);
    var authHeader = req.headers.authorization;
    if (!authHeader) {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        next(err);
        return;
    }
  
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var user = auth[0];
    var pass = auth[1];
    if (user == 'admin' && pass == 'password') {
        next(); // authorized
    } else {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');      
        err.status = 401;
        next(err);
    }
  }
  
  app.use(auth);*/ //it is a code for basic authentication
app.use(express.static(path.join(__dirname,"public")));

const LoginModel=mongoose.model("login","loginSchema");
var signup= new LoginModel;

const BookModel=mongoose.model("bookLogin","bookSchema");
var Add_Book=new BookModel;


//Add_Book.img.data = fs.readFileSync("C:/Users/HP/library/static/assets/images/eye.png");


    
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'agarwaldheeraj2019@gmail.com',
        pass: 'ruchiagarwal'
    }
    
});

app.get("/",function(req,res){
    res.render("index");
});

/*app.post("/login",function(req,res){
LoginModel.find({Email:req.body.Email,Password:req.body.Password},function(err,docs){
if(!err){
    if(docs.toString().length==0){
        res.send("please create your account");
    }
    else{
        res.render("login");
    }
}
else{
    console.log("erroe logging in!!!");
}
});
});*/
/*app.post("/login",function(req,res,next){
    passport.authenticate("local",{
        successRedirect:"/add_books",
        failureRedirect:"/list_students"
    })(req,res,next);
});*/

app.post('/login', passport.authenticate("local-login"),function(req,res){
    res.render("login");
});
app.post("/login_lib",function(req,res){
    if(req.body.Email=="adheeraj" && req.body.Password=="Dheeraj"){
        res.render("librarian");
    }
    else res.send("you have entered wrong credentials");
})
app.get("/register",function(req,res){
    res.render("register");
});
app.post("/send_email",function(req,res){
   LoginModel.find({Email:req.body.Email,Password:req.body.Password},function(err,data){
    if(!err){
    if(data.toString().length!=0)
    res.send("your account already exists");
       else{
           signup.Email=req.body.Email;
           bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(salt,(err,hash)=>{
                verify_password=salt;
                this.Password=salt;
                transporter.sendMail({
                    from: 'agarwaldheeraj2019@gmail.com',
                      to: req.body.Email,
                      subject: 'Verify Email ',
                      text: "this is your password "+salt
                    },function(err,data){
if(!err) {
    console.log("email.sent");
res.render("account_verify");
}
else {
    console.log(err);
    res.send("email not correct")
}                });
            });
        });
    
       }
    }
       else{
           console.log("error creatng account");
       }
   });
});

app.post("/forgot_password",function(req,res){
    LoginModel.find({Email:req.body.Email},function(err,data){
        if(data.toString().length!=0){
            console.log(data);
            transporter.sendMail({
                from: 'agarwaldheeraj2019@gmail.com',
                  to: req.body.Email,
                  subject: 'Verify Email ',
                  text: data.toString()
                },function(err,data){
if(!err) {
console.log("email.sent");
res.send("data has been sent");
}
else {
console.log(err);
res.send("we are facing problems");
}              
  });            

        }
        else{

            res.send("your account is not registered" +req.body.Email);
        }
    })
})

app.post("/account_verify",function(req,res){
    if(req.body.Password==verify_password){
        signup.Password=req.body.Password;
        signup.save(function(err,docs){
            if(!err){
                res.send("account created succesfully");
            }
            else{
                res.send(err);
            }
           });
    }
    else{
        res.send("wrong password entered");
    }
    });
app.get("/add_books",function(req,res){
res.render("add_books");
});
/*app.get("/add_images",function(req,res){
    res.render("add_images");
    });*/
app.get("/list_books_librarian",function(req,res){
    BookModel.find(function(err,docs){
        if(!err){
            res.render("list_books_librarian",{"list":docs});
            
        }
        else{
            res.send(error);
        }
    });
});
Add_Book.img.data="default"; //it has to be a global variable for passing second parameter in  list books

app.post("/add_books", upload.single('photo'),function(req,res){
Add_Book.Book_Name=req.body.Book_Name;
Add_Book.Book_Publisher=req.body.Book_Publisher;
Add_Book.img.data=fs.readFileSync(req.file.path)
Add_Book.img.contentType = 'image/png';
Add_Book.save(function(err,docs){
    if(!err){
        res.send("book added successfully");
        //display the image
        // res.end(Add_Book.img.data,"binary");
    }
    else{
        res.send("no book added");
    }
    });
    });

app.get("/list_students",function(req,res){
    LoginModel.find(function(err,docs){
        if(!err){
            res.render("list_students",{"list":docs});
            
        }
        else{
            res.send(error);
        }
    });
});

app.get("/new_arrivals",function(req,res){
    BookModel.find().sort({_id:-1}).limit(2)
    .then((docs)=>{
            res.render("new_arrivals",{"list":docs});
    }).catch((err)=>{
            res.send(error);
        });
    });

app.get("/list_books",isLoggedIn,function(req,res){
        BookModel.find(function(err,docs){
            if(!err){
                res.render("list_books",{"list":docs,"src": Add_Book.img.data.toString('base64')});//image only showing without restarting the server
            }
            else{
                res.send(error);
            }
        });
});
app.get("/new_arrivals_for_students",isLoggedIn,function(req,res){
    BookModel.find().sort({_id:-1}).limit(2)
    .then((docs)=>{
            res.render("new_arrivals_for_students",{"list":docs});
    }).catch((err)=>{
            res.send(err);
        });
    });
app.get("/search_students",function(req,res){
    LoginModel.find({Email:req.query.Email},function(err,data){
        if(!err){
            console.log(req.query.Email);
            res.render("list_students",{"list":data});
        }
    });
});
app.get("/search_books",isLoggedIn,function(req,res){
    BookModel.find({Book_Name:req.query.Book_Name},function(err,data){
        if(!err){
            res.render("list_books",{"list":data});
        }
    });
});

function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.send('you are not logged in!!!');
}
app.get("/forgot_password",function(req,res){
    res.render("forgot_password");
})
app.get('/log_out', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.listen(process.env.PORT || "3000",function(err,docs){
    console.log("server is working");
    });