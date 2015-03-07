var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    name:{
        unique:true,
        type:String
    },
    password:String,
    email:String,
    phone:String,
    depart:String,
    city:String,
    date:String
});

module.exports = UserSchema;