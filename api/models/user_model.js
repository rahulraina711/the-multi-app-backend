const mongoose = require('mongoose');

const userSchema= new mongoose.Schema({
    name:{type: String, required: true},
    email: {type: String, required: true, unique: true},
    typeOfUser : {type: String, default: "gamer"},
    profilePic: {type: String},
    about:{type: String},
    occupation:{type: String}
},{
    timestamps:true
});

module.exports = mongoose.model("User", userSchema);