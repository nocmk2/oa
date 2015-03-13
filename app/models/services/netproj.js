var Netproj = require('../models/netproj');

var netprojService = {};

//获取所有项目
netprojService.getAll = function(callback){
    var netprojs = Netproj.find({});
    netprojs.exec(callback);
};

//保存项目
netprojService.save = function(netproj,callback){
    var netproj = new Netproj(netproj);
    netproj.save(function(err,netprojSaved){
        if(err) {
            callback(err);
        }else{
            callback(null,netprojSaved);
        }
    });
};

//依据ID获取项目
netprojService.getById = function(id,callback){
    Netproj.findById(id,function(err,netproj){
        if(err){
            callback(err);
        }else{
            callback(null,netproj);
        }
    });
};

//更新项目
netprojService.updateOne = function(netproj,callback){
    Netproj.findByIdAndUpdate(netproj._id,netproj,function(err,nUpdated){
        if(err){
            callback(err);
        }else{
            callback(null,nUpdated);
        }
    });
};

//依据id删除项目
netprojService.deleteById = function(ids,callback){
    Netproj.remove({_id:{$in:ids}},function(err,nRemoved){
        if(err){
            callback(err);
        }else{
            callback(null,nRemoved);
        }
    });
};

module.exports = netprojService;