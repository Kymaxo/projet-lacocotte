var express    = require("express");
var router     = express.Router();
var Meal       = require("../models/meal");
var middleware = require("../middleware");

// Index
router.get("/",middleware.isLoggedIn, (req, res) => {
// Get all meals from the database
var cart = req.session.cart;
//console.log(cart);
var displayCart = {items:[]};
var total = 0;

//Get the total amount
for(var item in cart){
  displayCart.items.push(cart[item]);
  total += (cart[item].qty * cart[item].price);
}
displayCart.total = total;

Meal.findById(req.params.id, (err, foundMeal) => {
    if(err){
      console.log("There is a problem, cannot find the meal !");
      console.log(err);
    }
    else {
      // Render cart
      res.render("cart/index",{cart: displayCart, total: total, meals: foundMeal});

        }
    });
});

router.post("/:id", middleware.isLoggedIn, (req, res) => {
  req.session.cart = req.session.cart || {};
  var cart = req.session.cart;

  // Create a new meal and save it into database
  Meal.findById(req.params.id,(err, foundMeal) => {
    if(err) {
      console.log(err);
    }
    if(cart[req.params.id]) {
      cart[req.params.id].qty++;
    }
    else {
      cart[req.params.id] = {
        item: foundMeal._id, 
        title: foundMeal.title,
        price: foundMeal.price,
        qty: 1
      }
    }
      //redirect to cart page
      res.redirect("/cart");
  });
});
module.exports = router;
