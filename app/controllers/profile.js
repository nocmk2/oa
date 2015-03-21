var crypto = require('crypto');
var UserService = require('../models/services/user');

module.exports = function (app) {

    app.get('/profile', checkLogin , function (req, res) {

        res.render('profile', {

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