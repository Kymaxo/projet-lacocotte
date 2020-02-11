var express     = require("express");
var router      = express.Router({mergeParams: true});
var Meal        = require("../models/meal");
var Comments    = require("../models/comment");
var middleware  = require("../middleware");


//Comments new
router.get("/new", middleware.isLoggedIn, (req, res) => {
  //find 
  Meal.findById(req.params.id, (err, meal) => {
    if(err) {
      console.log(err); 
    } else{
      //render the comments page
      res.render("comments/form",{ meal: meal });
    }
  });
});

//Comments create
router.post("/", middleware.isLoggedIn, (req, res) => {
  //lookup meal using id
  Meal.findById(req.params.id, (err, meal) => {
    if(err){
      req.flash("error", "Something is wrong.");
      console.log(err);
      res.redirect("/meals");
    } else {
      Comments.create(req.body.comment, (err, comment) => {
        if(err) {
          console.log(err);
        } else {
          //add username and id to the comment
          comment.author.id       = req.user._id;
          comment.author.username = req.user.username;
          console.log("New comment sent from user: " +comment.author.username);
          //save comment
          comment.save();
          meal.comments.push(comment);
          // console.log(comment);
          meal.save();
          //console.log(comment);
          req.flash("success", "Comment successfully added.");
          res.redirect('/meals/' + meal._id);
        }

      });
    }
  });
});
//Comment edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
  Comments.findById(req.params.comment_id, (err, foundComment) => {
    if(err){
      res.redirect("back");
    } else {
      res.render("comments/edit", {meal_id: req.params.id, comment: foundComment});
    }
  });
});

//Comment update route
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comments.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
      if(err){
        res.redirect("back");
      } else {
        req.flash("success","Comment Updated Successfully.");
        res.redirect("/meals/" + req.params.id);
      }
    });
});

//Comment delete route
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comments.findByIdAndRemove(req.params.comment_id, (err) => {
    if(err){
      res.redirect("back");
    } else {
      req.flash("success","Comment deleted.");
      res.redirect("/meals/" +req.params.id);
    }
  })
});

module.exports = router;
