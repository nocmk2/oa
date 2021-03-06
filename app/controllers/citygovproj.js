var CitygovprojService = require('../models/services/citygovproj');
var CounterService = require('../models/services/counter');
var moment = require('moment');
var util = require('util');
var xlsx = require('node-xlsx');
var fs = require('fs');
var path = require('path');
var fse = require('fs-extra');
var _ = require('lodash');
var selectOptions = require('../../config/projs/citygovproj').selectOptions;

module.exports = function (app) {

    app.get('/citygovproj', checkLogin , function (req, res) {
	    //若用户没有权限，返回首页
	    if(req.session.user.authority.citygovprojControl.visible !== true ){
		    return res.redirect('/');
	    }

        CitygovprojService.getAll(function (err, citygovprojs) {
            if (err) {
                citygovprojs = [];
            }

	        //查看用户是否有权限查看不进入统计的项目
	        if(req.session.user.authority.citygovprojControl.seeNotInStatis !== true ){
		        _.remove(citygovprojs, function (proj) {
			        return proj.basicInfo.isstatis === '否';
		        });
	        }

	        //展示的基本信息除序列号外的字符串长度最多为7，其余补上'...'
	        for (var i = 0 ; i < citygovprojs.length ; i++){

		        for(var key in citygovprojs[i].basicInfo){

			        if(typeof citygovprojs[i].basicInfo[key] === "string" && key !== "serialno"){
				        if(citygovprojs[i].basicInfo[key].length > 10){
					        citygovprojs[i].basicInfo[key] = (citygovprojs[i].basicInfo[key].substring(0,7) + '...');
				        }
			        }
		        }
	        }

            res.render('citygovproj', {
                title: '网络部项目管理',
                user: req.session.user,
                citygovprojs: citygovprojs,
	            selectOptions : selectOptions,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });

    //删除项目
    app.delete('/citygovproj', checkLogin , function (req, res) {
        var idsToDelete = req.body;
        CitygovprojService.deleteById(idsToDelete,function(err,nRemoved){
            if(err){
                console.log(err);
                req.flash('error', err);
                return res.send({success:false});
            }
	        //遍历删除对应项目附件
	        for(var i = 0 ; i < idsToDelete.length ; i++){
		        fse.removeSync(path.join(__dirname,("../../public/attachment/citygovproj/" + idsToDelete[i])));
	        }
            return res.send({success:true});
        });
    });

    //保存项目
    app.post('/citygovproj/save',checkLogin,function(req,res){
        var proj = req.body.proj;

	    var today = moment().format('YYYYMMDD');


	    //检查counter中日期
	    CounterService.isToday(today, function (err,result) {
		    if(err){
			    return res.send({
				    success:false,
				    msg:"数据存储出错"
			    });
		    }
		    if(result === true){
			    //是当日
			    CounterService.getSeqID(today, function (err,seqId) {
				    if(err){
					    return res.send({
						    success:false,
						    msg:"数据存储出错"
					    });
				    }
				    //seqId补零
				    if(parseInt(seqId) < 10){
					    seqId = "00" + seqId;
				    }else if(parseInt(seqId)  < 100){
					    seqId = "0" + seqId
				    }

				    proj.basicInfo.serialno = "SZ" + today + seqId;


				    //保存
				    CitygovprojService.save(proj,function (err, proj) {
					    if (err) {
						    return res.send({
							    success:false,
							    msg:"数据存储出错"
						    });
					    }
					    return res.send({
						    success:true
					    });
				    });

			    });
		    }else{
			    //非当日
			    CounterService.init(today,function(err){
				    if(err){
					    return res.send({
						    success:false,
						    msg:"数据存储出错"
					    });
				    }
				    CounterService.getSeqID(today, function (err,seqId) {
					    if(err){
						    return res.send({
							    success:false,
							    msg:"数据存储出错"
						    });
					    }
					    //seqId补零
					    if(parseInt(seqId) < 10){
						    seqId = "00" + seqId;
					    }else if(parseInt(seqId)  < 100){
						    seqId = "0" + seqId
					    }

					    proj.basicInfo.serialno = "SZ" + today + seqId;


					    //保存
					    CitygovprojService.save(proj,function (err, proj) {
						    if (err) {
							    return res.send({
								    success:false,
								    msg:"数据存储出错"
							    });
						    }
						    return res.send({
							    success:true
						    });
					    });

				    });
			    })
		    }
	    });

    });

    //获取项目信息
    app.post('/citygovproj/getById',checkLogin,function(req,res){
        var id = req.body.id;
        CitygovprojService.getById(id,function(err,citygovproj){
            if(err){
                console.log(err);
                req.flash('error', err);
                res.send({citygovproj:null});
            }
            return res.send(citygovproj);
        });
    });

    //编辑项目信息
    app.post('/citygovproj/edit',checkLogin,function(req,res){
        var proj = req.body.proj;

	    var _projToUpdate = {};
	    //根据权限限制修改
	    if(req.session.user.authority.citygovprojControl.basicInfo === true ){
		    _projToUpdate.basicInfo = proj.basicInfo;
	    }
	    if(req.session.user.authority.citygovprojControl.materialInfo === true ){
		    _projToUpdate.materialInfo = proj.materialInfo;
	    }
	    if(req.session.user.authority.citygovprojControl.constructionInfo === true ){
		    _projToUpdate.constructionInfo = proj.constructionInfo;
	    }
	    if(req.session.user.authority.citygovprojControl.textInfo === true ){
		    _projToUpdate.textInfo = proj.textInfo;
	    }
	    if(req.session.user.authority.citygovprojControl.contractInfo === true ){
		    _projToUpdate.contractInfo = proj.contractInfo;
	    }
	    if(req.session.user.authority.citygovprojControl.incomeInfo === true ){
		    _projToUpdate.incomeInfo = proj.incomeInfo;
	    }


        CitygovprojService.updateOne(proj._id,_projToUpdate,function (err, nUpdated) {
            if (err) {
                return res.send({
                    success:false
                });
            }
            return res.send({
                success:true
            });
        });
    });

    //导出Excel
    app.get('/citygovproj/getExcel', checkLogin , function (req, res) {
	    var _tmpFileName = req.session.user.name + _.now() + _.random(0,9999);
	    //取出所有市政项目
        CitygovprojService.getAll(function (err, citygovprojs) {
            if (err) {
                console.log(err);
                citygovprojs = [];
            }

	        var data = CitygovprojService.getDataForExcel(citygovprojs);

            var buffer = xlsx.build([{name: _tmpFileName, data: data}]);

            fs.writeFile(path.join(__dirname,"../../public/excel/",_tmpFileName),buffer,function(err){
                if(err) console.log(err);
                res.download(path.join(__dirname,"../../public/excel/",_tmpFileName),'市政项目.xlsx', function (err) {
                    if(err) console.log(err);
	                fse.remove(path.join(__dirname,"../../public/excel/",_tmpFileName), function (err) {
		                if(err) console.log(err)
	                });
                });
            });

        });
    });

	//附件上传
	app.post('/citygovproj/upload',checkLogin,function(req,res){

		//获取文件信息
		var fileInfo = req.body;

		var id = fileInfo.id;
		var file = fileInfo.fileName;
		var filename = "";

		for(_file in req.files){
			filename = req.files[_file].originalname;
		}

		CitygovprojService.updateUploadInfo(id,file,filename,function(err,nUpdated){
			res.type("html");
			if(err){
				console.log(err);
				return res.send({success:false});
			}else{
				return res.send({success:true,
					fileNameUploaded:filename});
			}

		});

	});

	//附件下载
	app.get('/citygovproj/downloadAttachment',checkLogin,function(req,res){

		//获取文件信息
		console.log(req.query);

		var id = req.query.id;
		var file = req.query.file;
		var pathOfFileToDownload = path.join(__dirname,("../../public/attachment/citygovproj/" + id + "/" + file + "/"));


		if(fs.existsSync(pathOfFileToDownload)){
			var filesInDir = fs.readdirSync(pathOfFileToDownload);

			var fileToBeDownloaded =  path.join(pathOfFileToDownload,filesInDir[0]);

			res.download(fileToBeDownloaded);
		}

	});

    function checkLogin(req, res, next) {
        if (!req.session.user) {
            req.flash('error', '已登出!');
            return res.redirect('/login');
        }
        return next();
    }

    function checkNotLogin(req, res, next) {
        if (req.session.user) {
            req.flash('error', '已登录!');
            return res.redirect('/');
        }
        return next();
    }
};
