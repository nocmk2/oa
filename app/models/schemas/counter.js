var mongoose = require('mongoose');

var CounterSchema = new mongoose.Schema({ 
    _id:String,
    seq:String
});

module.exports = CounterSchema;