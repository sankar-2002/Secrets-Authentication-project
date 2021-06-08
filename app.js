
//requirements
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();


//setting the requirements

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

//connecting database

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true,useUnifiedTopology: true});


//making schema for data entries
const userSchema = {
  name: String,
  email: String,
  mobnum: String,
  password:String
};

//connecting data to schema so that it can use the provided schema...

const User = new mongoose.model("User", userSchema);



//server codes...

//rendering home page on "/" route using get request
app.get("/", function(req, res) {
  res.render("home");
})

//rendering login page on "/login" route
app.get("/login", function(req, res) {
  res.render("login");
})

//rendering register page on "/register" route
app.get("/register", function(req, res) {
  res.render("register");
})

//collecting data entered in input using bodyparser and storing it in newUser

app.post("/register", function(req, res) {

  const newUser = new User({
    name:req.body.name,
    email:req.body.username,
    mobnum:req.body.mobnumber,
    password: md5(req.body.password),
  });

  //saving the data of newUser into database and rendering the success page

  newUser.save(function(err) {
    if(err) {
      console.log(err);
    } else {
      res.render("regsucc");
    }
  });
});

//collecting user input from login page in "/login" route and checking whether it exists in database...

app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = md5(req.body.password);

  User.findOne({email: username}, function(err, foundUser) {
    if(err) {
      console.log(err);
    } else {
      if(foundUser) {

        if(foundUser.password === password) {
          res.render("secrets");
        } else {
          res.render("failure")
        }

      } else {
        res.render("failure")
      }
    }
  })
})

//logging out and redirecting to homePage
app.get("/logout", function(req, res) {
  res.redirect("/");
})


//listening on port 3000 and confirming whether server started
app.listen(3000, function() {
  console.log("Server Started On Port 3000");
});
