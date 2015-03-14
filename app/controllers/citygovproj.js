var CitygovprojService = require('../models/services/citygovproj');
var util = require('util');
var xlsx = require('node-xlsx');
var fs = require('fs');
var path = require('path');

module.exports = function (app) {

    app.get('/citygovproj', checkLogin , function (req, res) {
        CitygovprojService.getAll(function (err, citygovprojs) {
            if (err) {
                citygovprojs = [];
            }
            res.render('citygovproj', {
                title: '网络部项目管理',
                user: req.session.user,
                citygovprojs: citygovprojs,
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
            return res.send({success:true});
        });
    });

    //保存项目
    app.post('/citygovproj/save',checkLogin,function(req,res){
        var proj = req.body.proj;
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
        CitygovprojService.updateOne(proj,function (err, nUpdated) {
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
        CitygovprojService.getAll(function (err, citygovprojs) {
            if (err) {
                console.log(err);
                citygovprojs = [];
            }
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

            var buffer = xlsx.build([{name: "市政项目", data: data}]);

            fs.writeFile(path.normalize("public/excel/市政项目.xlsx"),buffer,function(err){
                if(err) console.log(err);
                res.download(path.normalize("public/excel/市政项目.xlsx"), function (err) {
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
