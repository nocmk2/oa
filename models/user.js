var mongodb = require('./db');
var objectId = require('mongodb').ObjectID;

function User(user) {
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
    this.phone = user.phone;
    this.depart = user.depart;
    this.city = user.city;
};

module.exports = User;

//存储用户信息
User.prototype.save = function (callback) {
    //要存入数据库的用户文档
    var user = {
        name: this.name,          //用户名
        password: this.password,  //密码
        email: this.email,         //邮箱
        phone: this.phone,        //联系电话
        depart: this.depart,      //部门
        city: this.city            //城市
    };
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //登录数据库
        db.authenticate("blogAdmin", "blogAdmin", function (err, result) {
            if(err){
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            if (result === true) {
                //读取 users 集合
                db.collection('users', function (err, collection) {
                    if (err) {
                        mongodb.close();
                        return callback(err);//错误，返回 err 信息
                    }
                    //将用户数据插入 users 集合
                    collection.insert(user, {
                        safe: true
                    }, function (err, user) {
                        mongodb.close();
                        if (err) {
                            return callback(err);//错误，返回 err 信息
                        }
                        callback(null, user[0]);//成功！err 为 null，并返回存储后的用户文档
                    });
                });
            }
        });
    });
};

//读取用户信息
User.get = function (name, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //登录数据库
        db.authenticate("blogAdmin", "blogAdmin", function (err, result) {
            if(err){
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            if (result === true) {
                //读取 users 集合
                db.collection('users', function (err, collection) {
                    if (err) {
                        mongodb.close();
                        return callback(err);//错误，返回 err 信息
                    }
                    //查找用户名（name键）值为 name 一个文档
                    collection.findOne({
                        name: name
                    }, function (err, user) {
                        mongodb.close();
                        if (err) {
                            return callback(err);//失败！返回 err 信息
                        }
                        callback(null, user);//成功！返回查询的用户信息
                    });
                });
            }

        });
    });
};

//通过id读取用户信息
User.getById = function (id, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //登录数据库
        db.authenticate("blogAdmin", "blogAdmin", function (err, result) {
            if(err){
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            if (result === true) {
                //读取 users 集合
                db.collection('users', function (err, collection) {
                    if (err) {
                        mongodb.close();
                        return callback(err);//错误，返回 err 信息
                    }
                    //查找用户名（name键）值为 name 一个文档
                    collection.findOne({
                        _id:objectId(id)
                    }, function (err, user) {
                        mongodb.close();
                        if (err) {
                            return callback(err);//失败！返回 err 信息
                        }
                        callback(null, user);//成功！返回查询的用户信息
                    });
                });
            }

        });
    });
};

//读取用户信息列表
User.getall = function (name, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //登录数据库
        db.authenticate("blogAdmin", "blogAdmin", function (err, result) {
            if(err){
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            if (result === true) {
                //读取 users 集合
                db.collection('users', function (err, collection) {
                    if (err) {
                        mongodb.close();
                        return callback(err);
                    }
                    var query = {};
                    if (name) {
                        query.name = name;
                    }
                    //根据 query 对象查询文章
                    collection.find(query).sort({
                        name: -1
                    }).toArray(function (err, docs) {
                        mongodb.close();
                        if (err) {
                            return callback(err);//失败！返回 err
                        }
                        callback(null, docs);//成功！以数组形式返回查询的结果
                    });
                });
            }
        });
    });
};

//依据id删除指定用户
User.deleteById = function (ids, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //登录数据库
        db.authenticate("blogAdmin", "blogAdmin", function (err, result) {
            if(err){
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            if (result === true) {
                //读取 users 集合
                db.collection('users', function (err, collection) {
                    if (err) {
                        mongodb.close();
                        return callback(err);//错误，返回 err 信息
                    }
                    //将id数组封装为objectId对象数组
                    idsTransformed = [];
                    for(var i = 0 ; i < ids.length ; i++){
                        idsTransformed.push({
                            _id:objectId(ids[i])
                        })
                    }
                    //依据id数组删除所选用户
                    collection.remove({
                        "$or":idsTransformed
                    }, function (err, nRemoved) {
                        mongodb.close();
                        if (err) {
                            return callback(err);//失败！返回 err 信息
                        }
                        callback(null, nRemoved);//成功！返回删除条数
                    });
                });
            }
        });
    });
};

//更新用户信息
User.updateOne = function (userToUpdate, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //登录数据库
        db.authenticate("blogAdmin", "blogAdmin", function (err, result) {
            if(err){
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            if (result === true) {
                //读取 users 集合
                db.collection('users', function (err, collection) {
                    if (err) {
                        mongodb.close();
                        return callback(err);//错误，返回 err 信息
                    }

                    //将userToUpdate的_id属性封装为objectId
                    userToUpdate._id = objectId(userToUpdate._id);

                    console.log("user in mongo to update: " + userToUpdate)
                    //更新用户信息
                    collection.update({
                            _id: userToUpdate._id
                        },
                        {$set: {
                            "name":userToUpdate.name,
                            "email":userToUpdate.email,
                            "phone":userToUpdate.phone,
                            "depart":userToUpdate.depart,
                            "city": userToUpdate.city
                        }},
                        function (err, nUpdate) {
                        mongodb.close();
                        if (err) {
                            return callback(err);//失败！返回 err 信息
                        }
                        callback(null, nUpdate);//成功！返回更新条数
                    });
                });
            }
        });
    });
};

//查询用户名是否被其他用户占用
User.findUserNameIsUsedByOthers = function (user, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //登录数据库
        db.authenticate("blogAdmin", "blogAdmin", function (err, result) {
            if(err){
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            if (result === true) {
                //读取 users 集合
                db.collection('users', function (err, collection) {
                    if (err) {
                        mongodb.close();
                        return callback(err);//错误，返回 err 信息
                    }
                    //查找用户名（name键）值为 name 一个文档
                    collection.find(
                        {
                            _id:{
                                "$ne":objectId(user._id)
                                }
                        },{
                        name: user.name
                    }, function (err, user) {
                        mongodb.close();
                        if (err) {
                            return callback(err);//失败！返回 err 信息
                        }
                        callback(null, user);//成功！返回查询的用户信息
                    });
                });
            }

        });
    });
};