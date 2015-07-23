var mongoose = require('mongoose');

var SelectoptionsSchema = new mongoose.Schema({
    //工程公司项目
    engproj:{
        propertiesList :[String]//工程属性
    },
    //网络项目
    netproj : {
        propertiesList :[String]//项目属性
    },
	//市政项目propertiesList
	citygovproj : {
		propertiesList :[String]//项目属性
	}
});

module.exports = SelectoptionsSchema;
