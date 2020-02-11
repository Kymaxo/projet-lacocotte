var express   = require("express");
var router    = express.Router();
var passport  = require("passport");
var User      = require("../models/user");
// Root Route
router.get("/", (req, res) =>{
  res.render("landing");
});

//================
//Auth Routes
//show register form
router.get("/register", (req, res) => {
  res.render("register", {page: 'register'});
});

//sign up logic

router.post("/register", (req, res) => {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if(err){
      // req.flash("error",err.message);
      return res.render("register", {error: err.message});
    }
    passport.authenticate("local")(req, res, () =>{
      req.flash("success","Welcome to the Oriental Meals Shop  " +user.username);
      res.redirect("/meals");
      // res.send("Signing you up !");
    });
  });
});

//SHOW LOGIN FORM
router.get("/login",(req, res) => {
    res.render("login", { page: 'login'});
});

//handling login logic
//("/login",middlware,callback)
router.post("/login", passport.authenticate("local", {
      successRedirect: "/meals",
      failureRedirect: "/login"
}), (req, res) => {
});

//add logout Routes
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Logged you out successfully")
  res.redirect("/meals");
});

module.exports = router;
