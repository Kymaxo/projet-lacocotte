var Meal     = require("../models/meal");
var Comments = require("../models/comment");

// All the middleare goes here
var middlewareObj = {};

middlewareObj.checkMealOwnership = (req, res, next) => {
  
  //Check if the user is logged-in
 if(req.isAuthenticated()){
        Meal.findById(req.params.id, (err, foundMeal) => {
           if(err) {
             req.flash("error", "Meal not found.");
               res.redirect("back");
           }  else {
               // Check if a user own the meal
            if(foundMeal.author.id.equals(req.user._id)) {
                next();
            } else {
              req.flash("error", "You dont have permission to do that.");
                res.redirect("back");
            }
           }
        });
    } else {
      req.flash("error", "You need to be logged-in to do that.");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = (req, res, next) => {
  
  //Check if a user logged-in
 if(req.isAuthenticated()) {
        Comments.findById(req.params.comment_id, (err, foundComment) => {
           if(err){
             req.flash("error", "Comment not found!");
               res.redirect("back");
           }  else {
               // Does a user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
              req.flash("error", "You dont have permission to do that.");
                res.redirect("back");
            }
           }
        });
    } else {
      req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/login");
}

module.exports = middlewareObj;
