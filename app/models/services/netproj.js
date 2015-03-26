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

//生产符合node-xlsx要求的格式化数据
netprojService.getDataForExcel = function(netprojs){
	var data = [];
	for(var i = 0 ; i < netprojs.length ; i++){
		data[i] = [];
		for(var key in netprojs[i]){
			if(key === "basicInfo"|| key === "incomeInfo"){
				for(var innerKey in netprojs[i][key]){
					if(typeof(netprojs[i][key][innerKey]) === "string"){
						data[i] .push(netprojs[i][key][innerKey]);
					}
				}
			}
		}
		data[i].reverse();
	}

	data.unshift(["序号","工单号","甲方项目负责人","乙方项目负责人","项目属性","项目类别","实施原因","项目名称","工程地址","所属区域","施工队","施工队负责人","委托时间","立项情况","开工时间","完工时间","竣工图纸收到日期（附件）","甲方验收情况","送审日期（附件）","备注"
		,"预算","结算","开票金额（附件）","实际收款","施工队结款","施工队工作量表格","其他费用","利润","备注"]);

	return data;
};

module.exports = netprojService;