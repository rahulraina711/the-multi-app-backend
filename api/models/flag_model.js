const mongoose = require('mongoose');

const flagSchema = new mongoose.Schema({
    id:{type: String}
},
{
    timestamps:true
});

module.exports = mongoose.model("Flag" , flagSchema);