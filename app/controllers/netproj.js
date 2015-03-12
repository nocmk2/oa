var NetprojService = require('../models/services/netproj');
var util = require('util');
var xlsx = require('node-xlsx');
var fs = require('fs');
var path = require('path');

module.exports = function (app) {

    app.get('/netproj', checkLogin , function (req, res) {
        //取出所有engprojs
        NetprojService.getAll(function (err, netprojs) {
            if (err) {
                netprojs = [];
            }
            res.render('netproj', {
                title: '网络部项目管理',
                user: req.session.user,
                netprojs: netprojs,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });

    //删除项目
    app.delete('/netproj', checkLogin , function (req, res) {
        var idsToDelete = req.body;
        NetprojService.deleteById(idsToDelete,function(err,nRemoved){
            if(err){
                console.log(err);
                req.flash('error', err);
                return res.send({success:false});
            }
            return res.send({success:true});
        });
    });

    //保存项目
    app.post('/netproj/save',checkLogin,function(req,res){
        var proj = req.body.proj;
        console.log(util.inspect(proj));
        NetprojService.save(proj,function (err, proj) {
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
    app.post('/netproj/getById',checkLogin,function(req,res){
        var id = req.body.id;
        NetprojService.getById(id,function(err,netproj){
            if(err){
                console.log(err);
                req.flash('error', err);
                res.send({netproj:null});
            }
            return res.send(netproj);
        });
    });

    //编辑项目信息
    app.post('/netproj/edit',checkLogin,function(req,res){
        var proj = req.body.proj;
        NetprojService.updateOne(proj,function (err, nUpdated) {
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
    app.get('/netproj/getExcel', checkLogin , function (req, res) {
        NetprojService.getAll(function (err, netprojs) {
            if (err) {
                console.log(err);
                netprojs = [];
            }
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

            var buffer = xlsx.build([{name: "网络部项目", data: data}]);

            fs.writeFile(path.normalize("public/excel/网络部项目.xlsx"),buffer,function(err){
                if(err) console.log(err);
                res.download(path.normalize("public/excel/网络部项目.xlsx"), function (err) {
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
