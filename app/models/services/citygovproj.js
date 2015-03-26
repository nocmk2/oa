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

//生产符合node-xlsx要求的格式化数据
citygovprojService.getDataForExcel = function(citygovprojs){
	var data = [];
	for(var i = 0 ; i < citygovprojs.length ; i++){
		data[i] = [];
		for(var key in citygovprojs[i]){
			if(key === "basicInfo" || key === "materialInfo" || key === "constructionInfo" || key === "textInfo" || key === "contractInfo" || key === "incomeInfo"){
				for(var innerKey in citygovprojs[i][key]){
					if(typeof(citygovprojs[i][key][innerKey]) === "string"){
						data[i] .push(citygovprojs[i][key][innerKey]);
					}
				}
			}
		}
		data[i].reverse();
	}

	data.unshift(["序号","是否统计","受控编号","工程名称","甲方项目负责人","项目类别","工程属性","项目名称","项目内容","工程地址","甲方单位","所属区域","设计单位","设计负责人","监理单位","监理负责人","施工队","备注"
		,"主材料使用（乙供）","主材料金额（乙供）"
		,"割接报告申请","割接报告申请日期","割接日期","开工时间","完工时间","备注"
		,"竣工文本（甲方下发）收到情况","竣工文本收到日期","竣工文本提交日期","甲方对竣工资料的反馈情况","竣工资料（施工队给乙方）提交时间","竣工资料是否收到","施工队工作量（表格）"
		,"甲方合同金额","甲方是否已收款","是否转其他公司","乙方合同签订日期","乙方合同金额","乙方送审日期","乙方审定金额","乙方预付款开票日期（附件）","乙方预付款开票金额","乙方进度款开票日期（附件）","乙方进度款开票金额","乙方尾款开票日期（附件）","乙方尾款开票金额","乙方预付款到款日期","乙方预付款到款金额","乙方进度款到款日期","乙方进度款到款金额","乙方尾款到款日期","乙方尾款到款金额","我公司合同签订日期","合同文本（附件）","我公司合同款金额","我公司合同预付款开票日期（附件）","我公司合同预付款开票金额","我公司合同进度款开票日期（附件）","我公司合同进度款开票金额","我公司合同尾款开票日期（附件）","我公司合同尾款开票金额","我公司合同预付款到款日期","我公司合同预付款到款金额","我公司合同进度款到款日期","我公司合同进度款到款金额","我公司送审日期","我公司审定金额"
		,"实际收款","施工队结款","其他费用","利润"]);

	return data;
};

module.exports = citygovprojService;