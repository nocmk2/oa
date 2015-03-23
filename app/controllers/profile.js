var crypto = require('crypto');
var UserService = require('../models/services/user');
var util = require('util');

module.exports = function (app) {

    app.get('/profile', checkLogin , function (req, res) {

        console.log('session.user');
        console.log(console.log(req.session.user));

        res.render('profile', {
            title: '个人信息',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });

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