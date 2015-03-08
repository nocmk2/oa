var EngprojService = require('../models/services/engproj');

module.exports = function (app) {

    app.get('/engineeringproj', checkLogin , function (req, res) {
        //取出所有engprojs
        EngprojService.getAll(function (err, engprojs) {
            if (err) {
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