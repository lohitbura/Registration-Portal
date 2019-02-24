const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username : String,
        password : String,
        mobile : String,
        email : String,
        name : String,
        dob : String,
        gender : String,
        image : String
    }
);



User = mongoose.model('user',userSchema);



module.exports = User;

