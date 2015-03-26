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

//生产符合node-xlsx要求的格式化数据
engprojService.getDataForExcel = function(engprojs){
	var data = [];
	for(var i = 0 ; i < engprojs.length ; i++){
		data[i] = [];
		for(var key in engprojs[i]){
			if(key === "basicInfo" || key === "materialInfo" || key === "constructionInfo" || key === "textInfo" || key === "contractInfo" || key === "incomeInfo"){
				for(var innerKey in engprojs[i][key]){
					if(typeof(engprojs[i][key][innerKey]) === "string"){
						data[i] .push(engprojs[i][key][innerKey]);
					}
				}
			}
		}
		data[i].reverse();
	}

	data.unshift(["序号","传输编号","受控编号","工程名称","甲方项目负责人","乙方项目负责人","项目类别","工程属性","项目名称","工程地址","甲方单位","所属区域","设计单位","设计负责人","监理单位","监理负责人","施工队","施工队负责人","委托时间","备注"
		,"主材料供应","申请领料日期","实际领料日期","主材料金额","材料表","备注"
		,"施工情况","施工情况简述","预计完工时间","开工时间","完工时间","监理验收情况","监理验收问题反馈","甲方验收情况","管照办理情况","配合费（附件）","选线费（附件）","跟测费（附件）","备注"
		,"竣工文本收到日期","竣工资料施工队上交时间（附件）","竣工文本提交日期（附件）","甲方对竣工资料的反馈情况","施工队工作量（表格）","备注"
		,"合同签订情况","合同签订日期","合同文本（附件）","合同总金额","预付款","预付款开票日期（附件）","预付款收款日期","进度款开票日期（附件）","进度款收款日期","尾款开票日期（附件）","尾款收款日期","是否已送审（附件）","送审日期","审定金额","备注"
		,"实际收款","施工队结款","其他费用","利润","备注"]);

	return data;
};

module.exports = engprojService;