var Citygovproj = require('../models/citygovproj');

var citygovprojService = {};

//获取所有项目
citygovprojService.getAll = function(callback){
    var citygovprojs = Citygovproj.find({});
    citygovprojs.exec(callback);
};

//保存项目
citygovprojService.save = function(citygovproj,callback){
    var citygovproj = new Citygovproj(citygovproj);
    citygovproj.save(function(err,citygovprojSaved){
        if(err) {
            callback(err);
        }else{
            callback(null,citygovprojSaved);
        }
    });
};

//依据ID获取项目
citygovprojService.getById = function(id,callback){
    Citygovproj.findById(id,function(err,citygovproj){
        if(err){
            callback(err);
        }else{
            callback(null,citygovproj);
        }
    });
};

//更新项目
citygovprojService.updateOne = function(citygovproj,callback){
    Citygovproj.findByIdAndUpdate(citygovproj._id,citygovproj,function(err,nUpdated){
        if(err){
            callback(err);
        }else{
            callback(null,nUpdated);
        }
    });
};

//依据id删除项目
citygovprojService.deleteById = function(ids,callback){
    Citygovproj.remove({_id:{$in:ids}},function(err,nRemoved){
        if(err){
            callback(err);
        }else{
            callback(null,nRemoved);
        }
    });
};

module.exports = citygovprojService;