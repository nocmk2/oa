var EngprojService = require('../models/services/engproj');
var util = require('util');
var xlsx = require('node-xlsx');
var fs = require('fs');
var path = require('path');

module.exports = function (app) {

    app.get('/engineeringproj', checkLogin , function (req, res) {
        //取出所有engprojs
        EngprojService.getAll(function (err, engprojs) {
            if (err) {
                console.log(err);
                engprojs = [];
            }
            res.render('engineeringproj', {
                title: '工程公司项目管理',
                user: req.session.user,
                engprojs: engprojs,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });

    //删除项目
    app.delete('/engineeringproj', checkLogin , function (req, res) {
        var idsToDelete = req.body;
        EngprojService.deleteById(idsToDelete,function(err,nRemoved){
            if(err){
                console.log(err);
                req.flash('error', err);
                return res.send({success:false});
            }
            return res.send({success:true});
        });
    });

    //保存项目
    app.post('/engineeringproj/save',checkLogin,function(req,res){
        var proj = req.body.proj;
        EngprojService.save(proj,function (err, proj) {
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

    //获取项目信息
    app.post('/engineeringproj/getById',checkLogin,function(req,res){
        var id = req.body.id;
        EngprojService.getById(id,function(err,engproj){
            if(err){
                console.log(err);
                req.flash('error', err);
                res.send({engproj:null});
            }
            return res.send(engproj);
        });
    });

    //编辑项目信息
    app.post('/engineeringproj/edit',checkLogin,function(req,res){
        var proj = req.body.proj;
        EngprojService.updateOne(proj,function (err, nUpdated) {
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
    app.get('/engineeringproj/getExcel', checkLogin , function (req, res) {
        //取出所有engprojs
        EngprojService.getAll(function (err, engprojs) {
            if (err) {
                console.log(err);
                engprojs = [];
            }
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
                            ,"主材料供应","申请领料日期（甲供）","实际领料日期（甲供）","材料表","主材料金额（乙供）","备注"
                            ,"施工情况","施工情况简述","预计完工时间","开工时间","完工时间","监理验收情况","监理验收问题反馈","甲方验收情况","管照办理情况","配合费（附件）","选线费（附件）","跟测费（附件）","备注"
                            ,"竣工文本收到日期","竣工资料施工队上交时间（附件）","竣工文本提交日期（附件）","甲方对竣工资料的反馈情况","施工队工作量（表格）","备注"
                            ,"合同签订情况","合同签订日期","合同文本（附件）","合同总金额","预付款","预付款开票日期（附件）","预付款收款日期","进度款开票日期（附件）","进度款收款日期","尾款开票日期（附件）","尾款收款日期","是否已送审（附件）","送审日期","审定金额","备注"
                            ,"实际收款","施工队结款","其他费用","利润","备注"]);

            var buffer = xlsx.build([{name: "工程公司项目", data: data}]);

            fs.writeFile(path.normalize("public/excel/工程公司项目.xlsx"),buffer,function(err){
                if(err) console.log(err);
                res.download(path.normalize("public/excel/工程公司项目.xlsx"), function (err) {
                    if(err) console.log(err);
                });
            });

        });



    });

    function checkLogin(req, res, next) {
        if (!req.session.user) {
            req.flash('error', '已登出!');
            res.redirect('/login');
        }
        next();
    }

    function checkNotLogin(req, res, next) {
        if (req.session.user) {
            req.flash('error', '已登录!');
            res.redirect('back');
        }
        next();
    }
};