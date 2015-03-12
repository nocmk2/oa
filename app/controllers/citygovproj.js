var CitygovprojService = require('../models/services/citygovproj');
var util = require('util');
var xlsx = require('node-xlsx');

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
