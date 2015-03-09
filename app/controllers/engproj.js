var EngprojService = require('../models/services/engproj');
var util = require('util');

module.exports = function (app) {

    app.get('/engineeringproj', checkLogin , function (req, res) {
        //取出所有engprojs
        EngprojService.getAll(function (err, engprojs) {
            if (err) {
                engprojs = [];
            }
            console.log("enprojs: ");
            console.log(util.inspect(engprojs,{depth:3}));
            console.log("engprojs[0].basicInfo.serialno: ");
            console.log(engprojs[0].basicInfo.serialno);
            res.render('engineeringproj', {
                title: '工程公司项目管理',
                user: req.session.user,
                engprojs: engprojs,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
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