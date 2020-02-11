var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

var passportLocalMongoose = require("passport-local-mongoose");
var userSchema = new mongoose.Schema({
  username: String,
  password: String
});

userSchema.plugin(passportLocalMongoose);
module.exports= mongoose.model("User",userSchema);
