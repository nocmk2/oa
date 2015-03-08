var mongoose = require('mongoose');

var EngprojSchema = new mongoose.Schema({
    transid:{
        unique:true,
        type:String
    },//传输编号
    controlid:String,//受控编号
    projname:String//工程名称
});

module.exports = EngprojSchema;