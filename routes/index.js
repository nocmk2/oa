var crypto = require('crypto')
    , User = require('../models/user.js')
    , Post = require('../models/post.js');

module.exports = function (app) {
    app.get('/', checkLogin);
    app.get('/', function (req, res) {
        // Post.get(null, function (err, posts) {
        //  if (err) {
        //    posts = [];
        //  }
        res.render('index', {
            // title: '主页',
            user: req.session.user,
            // posts: posts,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
        // });
    });


    app.get('/user', checkLogin);
    app.get('/user', function (req, res) {
        //null 不指定具体 取出所有用户
        User.getall(null, function (err, users) {
            if (err) {
                users = [];
            }
            res.render('user', {
                title: '用户管理',
                user: req.session.user,
                users: users,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });

//app.post('/user', checkNotLogin);
    app.post('/user', function (req, res) {
        console.log(req.body.user);
        var
            user = req.body.user;
            name = user.name,
            password = user.password,
            password_re = user['vpassword'];
        if (password_re != password) {
            //req.flash('error', '两次输入的密码不一致!');
            //return res.redirect('/user');
            return res.send({
                success:false,
                msg:"两次输入的密码不一致"
            });
        }
        var md5 = crypto.createHash('md5'),
            password = md5.update(user.password).digest('hex');
        var newUser = new User({
            name: name,
            password: password,
            email: user.email,
            phone: user.phone,
            depart: user.depart,
            city: user.city
        });
        User.get(newUser.name, function (err, user) {
            if (user) {
                //req.flash('error', '用户已存在!');
                //return res.redirect('/user');
                return res.send({
                    success:false,
                    msg:"用户名已存在"
                });
            }
            newUser.save(function (err, user) {
                if (err) {
                    //req.flash('error', err);
                    //return res.redirect('/user');
                    return res.send({
                        success:false,
                        msg:"数据存储出错"
                    });
                }
                //req.flash('success', '新增用户成功!');
                //res.redirect('/user');
                return res.send({
                    success:true
                });
            });
        });
    });

    //删除用户
    app.delete('/user',function(req,res){
        var idsToDelete = req.body;
        User.deleteById(idsToDelete,function(err,nRemoved){
            if(err){
                console.log(err);
                req.flash('error', err);
                return res.send({result:"delete failed"});
            }
            return res.send({result:"delete success"});
        });
    });

    //获取用户ID，返回该ID用户
    app.post('/user/getById',function(req,res){
        var id = req.body.id;
        User.getById(id,function(err,user){
            if(err){
                console.log(err);
                req.flash('error', err);
                res.send({result:"getUserById failed"});
            }
            return res.send(user);
        })
    });

    //修改用户信息
    app.post('/user/update',function(req,res){
        var userToUpdate = req.body.user;
        //验证用户名是否被占用
        User.findUserNameIsUsedByOthers(userToUpdate, function (err, user) {
            if (user) {
                //req.flash('error', '用户已存在!');
                //return res.redirect('/user');
                return res.send({
                    success:false,
                    msg:"用户名已被占用"
                });
            }
            User.updateOne(userToUpdate,function(err,nUpdate){
                if(err){
                    console.log(err);
                    //req.flash('error', err);
                    //res.redirect("/user")
                    return res.send({
                        success:false,
                        msg:"数据存储出错"
                    });
                }
                //req.flash('success', '修改用户信息成功!');
                //res.redirect('/user');
                return res.send({
                    success:true
                });
            });
        });

    });


    /*
     app.post('/reg', checkNotLogin);
     app.post('/reg', function (req, res) {
     var name = req.body.name,
     password = req.body.password,
     password_re = req.body['password-repeat'];
     if (password_re != password) {
     req.flash('error', '两次输入的密码不一致!');
     return res.redirect('/reg');
     }
     var md5 = crypto.createHash('md5'),
     password = md5.update(req.body.password).digest('hex');
     var newUser = new User({
     name: name,
     password: password,
     email: req.body.email
     });
     User.get(newUser.name, function (err, user) {
     if (user) {
     req.flash('error', '用户已存在!');
     return res.redirect('/reg');
     }
     newUser.save(function (err, user) {
     if (err) {
     req.flash('error', err);
     return res.redirect('/reg');
     }
     req.session.user = user;
     req.flash('success', '注册成功!');
     res.redirect('/');
     });
     });
     });
     */


    app.get('/login', checkNotLogin);
    app.get('/login', function (req, res) {
        res.render('login', {
            title: '登录',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.post('/login', checkNotLogin);
    app.post('/login', function (req, res) {
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        User.get(req.body.name, function (err, user) {
            if (!user) {
                req.flash('error', '用户不存在!');
                return res.redirect('/login');
            }
            if (user.password != password) {
                req.flash('error', '密码错误!');
                return res.redirect('/login');
            }
            req.session.user = user;
            req.flash('success', '登陆成功!');
            res.redirect('/');
        });
    });

    /*
     app.get('/post', checkLogin);
     app.get('/post', function (req, res) {
     res.render('post', {
     title: '发表',
     user: req.session.user,
     success: req.flash('success').toString(),
     error: req.flash('error').toString()
     });
     });

     app.post('/post', checkLogin);
     app.post('/post', function (req, res) {
     var currentUser = req.session.user,
     post = new Post(currentUser.name, req.body.title, req.body.post);
     post.save(function (err) {
     if (err) {
     req.flash('error', err);
     return res.redirect('/');
     }
     req.flash('success', '发布成功!');
     res.redirect('/');//发表成功跳转到主页
     });
     });
     */
    app.get('/logout', checkLogin);
    app.get('/logout', function (req, res) {
        req.session.user = null;
        req.flash('success', '登出成功!');
        res.redirect('/');
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