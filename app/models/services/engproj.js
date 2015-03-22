var Engproj = require('../models/engproj');

var engprojService = {};

//获取所有项目
engprojService.getAll = function(callback){
    var engprojs = Engproj.find({});
    engprojs.exec(callback);
};

//保存项目
engprojService.save = function(engproj,callback){
    var engproj = new Engproj(engproj);
    engproj.save(function(err,engprojSaved){
        if(err) {
            callback(err);
        }else{
            callback(null,engprojSaved);
        }
    }

    //engproj.update({_id:_id},{$set:{ "basicInfo":{serialno:'MDragon'}},function(err){});

    );
};

//依据ID获取项目
engprojService.getById = function(id,callback){
    Engproj.findById(id,function(err,engproj){
        if(err){
            callback(err);
        }else{
            callback(null,engproj);
        }
    });
};

//更新项目
engprojService.updateOne = function(engproj,callback){
    Engproj.findByIdAndUpdate(engproj._id,engproj,function(err,nUpdated){
        if(err){
            callback(err);
        }else{
            callback(null,nUpdated);
        }
    });
};

//依据id删除项目
engprojService.deleteById = function(ids,callback){
    Engproj.remove({_id:{$in:ids}},function(err,nRemoved){
        if(err){
            callback(err);
        }else{
            callback(null,nRemoved);
        }
    });
};

module.exports = engprojService;