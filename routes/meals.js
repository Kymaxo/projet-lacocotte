var express    = require("express");
var router     = express.Router();
var Meal       = require("../models/meal");
var middleware = require("../middleware");

// Index
router.get("/", (req, res) => {
// Get all meals from the DB
Meal.find({}, (err, allMeals) => {
  if(err) {
    console.log("Problem connecting to the DB");
    console.log(err);
  }
  else {
    // THen render them to the page
        res.render("meals/index",{ meals:allMeals, page: 'meals' });
      }
    });
});

// CREATE Add new meals
router.post("/", middleware.isLoggedIn, (req, res) => {
    // get data from form
  var name        =  req.body.name;
  var price       =  req.body.price;
  var image       =  req.body.image;
  var description =  req.body.description;
  var author      = {
          id: req.user._id,
          username: req.user.username
  };
  var newMeal = {
        name:name, 
        price: price, 
        image:image, 
        description:description, 
        author:author
      };

  // Create a new meal and save it into database
  Meal.create(newMeal, (err, newlyCreated) => {
    if(err) {
      console.log(err);
    }
    else {
        //redirect to meals page
        // console.log(newlyCreated);
        res.redirect("/meals");
        }
    });
  });

// New form to create new meal
router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render("meals/form");
});

//Show info about one meal
router.get("/:id", (req, res) => {
  //find the meal with provided id
  // FindById(id, callback)
  Meal.findById(req.params.id).populate("comments").exec((err, foundMeal) => {
    if (err) {
      console.log(err);
    } else{
      //render the show page
      res.render("meals/show", { meal: foundMeal });
    }
  });
});

//Edit meal route
router.get("/:id/edit",middleware.checkMealOwnership, (req, res) => {
  Meal.findById(req.params.id, (err, foundMeal) => {
          res.render("meals/edit", { meal: foundMeal });
    });
});

//Update meal route
router.put("/:id", middleware.checkMealOwnership, (req, res) => {
    var newData = {
          name: req.body.name, 
          image: req.body.image, 
          description: req.body.description, 
          price: req.body.price
    };
  //Find the correct meal
  Meal.findByIdAndUpdate(req.params.id, {$set: newData}, (err, updatedMeal) => {
    if(err) {
      req.flash("error", err.message);
      res.redirect("/meals");
    } else {
        req.flash("success", "Successfully updated!");
        res.redirect("/meals/" +updatedMeal._id);
    }
    });
});

//Delete meal route
router.delete("/:id",middleware.checkMealOwnership, (req, res) => {
  Meal.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect("/meals");
    } else {
      res.redirect("/meals");
    }
  });
});
module.exports = router;
