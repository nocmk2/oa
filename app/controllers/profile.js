var crypto = require('crypto');
var UserService = require('../models/services/user');
var util = require('util');

module.exports = function (app) {

    app.get('/profile', checkLogin , function (req, res) {

        console.log('session.user');
        console.log(console.log(req.session.user));
        console.log(req.query.q);

        if(req.query.q === 'succeed'){
            res.render('profile', {
                title: '个人信息',
                info:'更新成功',
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        }else{
            res.render('profile', {
                title: '个人信息',
                info:'',
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        }
    });

    app.post('/profile/validatePassword',checkLogin,function(req,res){
        var userToValidate = req.body.user;
        var md5 = crypto.createHash('md5'),
            passwordMd5 = md5.update(userToValidate.passwordNow).digest('hex');

        userToValidate.passwordNow = passwordMd5;

        console.log("user in validation:");
        console.log(util.inspect(userToValidate));

        if(userToValidate.passwordNow === "" || userToValidate.newPassword === "" || userToValidate.reNewPassword === "") {
            res.send({success:false,msg:'密码不能为空'});
            return;
        }

        UserService.validatePassword(userToValidate._id,userToValidate.passwordNow,function(err,result){
            if(err){
                console.log(err);
                res.send({success:false,msg:'数据库错误'});
            }

            if(result === true){
                console.log('验证通过');
                res.send({success:true,msg:'验证通过'});
            }else{
                console.log('验证不通过');
                res.send({success:false,msg:'验证不通过'});
            }
        })

    });

    //修改用户信息
    app.post('/profile/update',function(req,res){
        var userToUpdate = req.body.user;

        //检查是否修改密码
        if(userToUpdate.newPassword !== ''){
            var md5 = crypto.createHash('md5'),
                passwordMd5 = md5.update(userToUpdate.newPassword).digest('hex');
            userToUpdate.password = passwordMd5;
        }


        //删除密码验证数据
        delete userToUpdate.passwordNow;
        delete userToUpdate.newPassword;
        delete userToUpdate.reNewPassword;

        console.log("user in update:");
        console.log(util.inspect(userToUpdate));

        //验证用户名是否被占用
        UserService.findUserNameIsUsedByOthers(userToUpdate, function (err, user) {
            if (user.length != 0) {
                return res.send({
                    success:false,
                    msg:"用户名已被占用"
                });
            }
            UserService.updateOne(userToUpdate,function(err,nUpdate){
                if(err){
                    console.log(err);
                    return res.send({
                        success:false,
                        msg:"数据存储出错"
                    });
                }

                //更新session
                if(userToUpdate.password !== ''){
                    var _password = userToUpdate.password;
                    req.session.user = userToUpdate;
                    req.session.user.password = _password;
                }else{
                    var _password = req.session.user.password;
                    req.session.user = userToUpdate;
                    req.session.user.password = _password;
                }

                return res.send({
                    success:true
                });

            });
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